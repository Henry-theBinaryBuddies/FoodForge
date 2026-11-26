//builds the list of options users can select, read from the database (+ macro config)

//used by GET /options (the frontend draws its selection cards from this)
//and by POST /recipe (to check that every selection is a real option)
//shape: { ingredients: [{name, description, items: [{name, img}]}],
//         macros:      [{name, toggles: [{name, description, img}]}],
//         foodPref:    [{name, toggles: [{name, img}]}] }

const macros = require("../config/macros");

function getOptions(db) {
    //selectable ingredients only (no pantry staples), grouped by category in database order
    const rows = db.prepare(`
        SELECT c.categoryID, c.name AS category, c.description, i.name, i.imageURL
        FROM INGREDIENT i
        JOIN INGREDIENTCATEGORY c ON c.categoryID = i.categoryID
        WHERE i.isStaple = 0
        ORDER BY c.categoryID, i.ingredientID
    `).all();

    const categories = new Map();
    for (const row of rows) {
        if (!categories.has(row.categoryID)) {
            categories.set(row.categoryID, {
                name: row.category,
                description: row.description,
                items: [],
            });
        }
        categories.get(row.categoryID).items.push({ name: row.name, img: row.imageURL });
    }

    const toggles = (table, idColumn) =>
        db.prepare(`SELECT name, imageURL FROM ${table} ORDER BY ${idColumn}`)
            .all()
            .map((row) => ({ name: row.name, img: row.imageURL }));

    return {
        ingredients: [...categories.values()],
        //min/max are for recipe search, the frontend only needs these fields
        macros: macros.map((category) => ({
            name: category.name,
            toggles: category.toggles.map(({ name, description, img }) => ({ name, description, img })),
        })),
        foodPref: [
            { name: "Cuisine", toggles: toggles("CUISINE", "cuisineID") },
            { name: "Diet", toggles: toggles("DIET", "dietID") },
            { name: "Flavor Profile", toggles: toggles("FLAVORPROFILE", "flavorID") },
        ],
    };
}

module.exports = { getOptions };
