
//MACRO RANGES
//built from config/macros.js so the ranges are only defined in one place
//each range is [min, max): min is included, max is not. null means no limit on that side
//Calories, Protein, and Carbohydrates are compared against the recipe's value directly
//Fat is a fraction of calories (fat grams * 9 / calories), not grams. config stores it as a percent
const macroConfig = require("../config/macros");

const MACRO_RANGES = Object.fromEntries(
    macroConfig.map((category) => {
        const divisor = category.name === "Fat" ? 100 : 1;
        const toFraction = (n) => (n === null ? null : n / divisor);
        return [
            category.name,
            Object.fromEntries(
                category.toggles.map((t) => [t.name, [toFraction(t.min), toFraction(t.max)]])
            ),
        ];
    })
);

const MACRO_COLUMNS = {
    Calories: "r.calories",
    Protein: "r.protein",
    Carbohydrates: "r.carbs",
    Fat: "(r.fat * 9.0 / r.calories)",
};

function findRecipes(db, { ingredients, macros, foodPref }, limit = 4) {
    const where = [];
    const params = [];
    const picked = [...new Set(ingredients)];
    const placeholders = (list) => list.map(() => "?").join(",");

    for (const [category, options] of Object.entries(MACRO_RANGES)) {
        const selection = macros[category];
        if (selection) {
            const [min, max] = options[selection];
            const expression = MACRO_COLUMNS[category];

            if (min !== null) {
                where.push(`${expression} >= ?`);
                params.push(min);
            }
            if (max !== null) {
                where.push(`${expression} < ?`);
                params.push(max);
            }
        }

    }

    const cuisines = foodPref.Cuisine;
    if (cuisines.length > 0) {
        where.push(`c.name IN (${placeholders(cuisines)})`);
        params.push(...cuisines);
    }

    const flavors = foodPref["Flavor Profile"];
    if (flavors.length > 0) {
        where.push(`r.recipeID IN (
            SELECT rf.recipeID FROM RECIPEFLAVOR rf
            JOIN FLAVORPROFILE f ON f.flavorID = rf.flavorID 
            WHERE f.name IN (${placeholders(flavors)})
            )`);

        params.push(...flavors);
    }

    const diets = foodPref.Diet;
    if (diets.length > 0) {
        where.push(`r.recipeID IN (
        SELECT rd.recipeID
        FROM RECIPEDIET rd
        JOIN DIET d ON d.dietID = rd.dietID
        WHERE d.name IN (${placeholders(diets)})
        GROUP BY rd.recipeID
        HAVING COUNT(DISTINCT d.dietID) = ?
    )`);
        params.push(...diets, diets.length);
    }


    const whereSql = where.length ? "WHERE " + where.join(" AND ") : "";

    const sql = `
    SELECT r.recipeID, r.name, r.description, r.instructions,
           r.calories, r.protein, r.fat, r.carbs,
           c.name AS cuisine,
           -- pantry staples (isStaple = 1) are assumed on hand, so they are left out of both counts
           SUM(CASE WHEN i.isStaple = 0 AND i.name IN (${placeholders(picked)}) THEN 1 ELSE 0 END) AS matchedCount,
           SUM(CASE WHEN i.isStaple = 0 THEN 1 ELSE 0 END) AS totalCount
    FROM RECIPE r
    JOIN CUISINE c ON c.cuisineID = r.cuisineID
    JOIN RECIPEINGREDIENT ri ON ri.recipeID = r.recipeID
    JOIN INGREDIENT i ON i.ingredientID = ri.ingredientID
    ${whereSql}
    GROUP BY r.recipeID
    HAVING matchedCount = totalCount
    ORDER BY matchedCount DESC, (totalCount - matchedCount) ASC, r.name
    LIMIT ?
`;

    const allParams = [...picked, ...params, limit];
    const rows = db.prepare(sql).all(...allParams);

    const getIngredients = db.prepare(`
    SELECT i.name, ri.quantity, ri.unit
    FROM RECIPEINGREDIENT ri
    JOIN INGREDIENT i ON i.ingredientID = ri.ingredientID
    WHERE ri.recipeID = ?
`);

    const getDiets = db.prepare(`
    SELECT d.name
    FROM RECIPEDIET rd
    JOIN DIET d ON d.dietID = rd.dietID
    WHERE rd.recipeID = ?
`);

    const getFlavors = db.prepare(`
    SELECT f.name
    FROM RECIPEFLAVOR rf
    JOIN FLAVORPROFILE f ON f.flavorID = rf.flavorID
    WHERE rf.recipeID = ?
`);

    return rows.map((row) => ({
        ...row,
        ingredients: getIngredients.all(row.recipeID),
        diets: getDiets.all(row.recipeID).map((d) => d.name),
        flavors: getFlavors.all(row.recipeID).map((f) => f.name),
    }));

}

module.exports = { findRecipes };
