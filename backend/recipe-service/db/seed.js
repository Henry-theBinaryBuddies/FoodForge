//fills database with starter data

// cd backend
// npm run seed

//creates any missing tables
//adds any categories, ingredients, cuisines, diets, and flavors from data.json that aren't in the database yet
//for each recipe in recipes.js
// -not in the database >> inserts it (source = 'seed')
// -already in there as a seed recipe >> updates it to match recipes.js
// -already in there as an AI recipe >> skips and prints a warning

const { openDatabase, DB_PATH } = require("./database");
const appData = require("../../../frontend/src/data/data.json");
const recipes = require("./recipes");

//HELPERS
//finds a foodPref section in data.json by name
function foodPrefSection(name) {
    const section = appData.foodPref.find((s) => s.name === name);
    if (!section) {
        throw new Error(`data.json has no foodPref section named "${name}".`);
    }
    return section.toggles;
}

//looks up ID by name
function lookup(map, name, kind, recipeName) {
    const id = map.get(name);
    if (id === undefined) {
        throw new Error(
            `Recipe "${recipeName}" uses unknown ${kind} "${name}". ` +
            `It must exactly match a name in the ${kind} list in data.json.`
        );
    }
    return id;
}

//reads an entire table into a Map of name >> id
function idMap(db, table, idColumn) {
    const rows = db.prepare(`SELECT ${idColumn} AS id, name FROM ${table}`).all();
    return new Map(rows.map((row) => [row.name, row.id]));
}

//SEED
const db = openDatabase();
const stats = { added: 0, updated: 0, skipped: [] };

db.exec("BEGIN");
try {
    //add ingredient categories and ingredients only if missing
    const insertCategory = db.prepare(
        "INSERT OR IGNORE INTO INGREDIENTCATEGORY (name, description) VALUES (?, ?)"
    );
    for (const category of appData.ingredients) {
        insertCategory.run(category.name, category.description ?? null);
    }
    const categoryIDs = idMap(db, "INGREDIENTCATEGORY", "categoryID");

    const insertIngredient = db.prepare(
        "INSERT OR IGNORE INTO INGREDIENT (name, imageURL, categoryID) VALUES (?, ?, ?)"
    );
    for (const category of appData.ingredients) {
        for (const item of category.items) {
            insertIngredient.run(item.name, item.img ?? null, categoryIDs.get(category.name));
        }
    }

    //name-only tables, only added if missing
    for (const [table, sectionName] of [
        ["CUISINE", "Cuisine"],
        ["DIET", "Diet"],
        ["FLAVORPROFILE", "Flavor Profile"],
    ]) {
        const insert = db.prepare(`INSERT OR IGNORE INTO ${table} (name) VALUES (?)`);
        for (const option of foodPrefSection(sectionName)) {
            insert.run(option.name);
        }
    }

    const ingredientIDs = idMap(db, "INGREDIENT", "ingredientID");
    const cuisineIDs = idMap(db, "CUISINE", "cuisineID");
    const dietIDs = idMap(db, "DIET", "dietID");
    const flavorIDs = idMap(db, "FLAVORPROFILE", "flavorID");

    //recipes
    const findRecipe = db.prepare("SELECT recipeID, source FROM RECIPE WHERE name = ?");
    const insertRecipe = db.prepare(`
        INSERT INTO RECIPE
            (name, description, instructions, calories, protein, fat, carbs, cuisineID, source)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'seed')
    `);
    const updateRecipe = db.prepare(`
        UPDATE RECIPE
        SET name = ?, description = ?, instructions = ?, calories = ?,
            protein = ?, fat = ?, carbs = ?, cuisineID = ?
        WHERE recipeID = ?
    `);
    const clearLinks = [
        db.prepare("DELETE FROM RECIPEINGREDIENT WHERE recipeID = ?"),
        db.prepare("DELETE FROM RECIPEDIET WHERE recipeID = ?"),
        db.prepare("DELETE FROM RECIPEFLAVOR WHERE recipeID = ?"),
    ];
    const insertRecipeIngredient = db.prepare(
        "INSERT INTO RECIPEINGREDIENT (recipeID, ingredientID, quantity, unit) VALUES (?, ?, ?, ?)"
    );
    const insertRecipeDiet = db.prepare(
        "INSERT INTO RECIPEDIET (recipeID, dietID) VALUES (?, ?)"
    );
    const insertRecipeFlavor = db.prepare(
        "INSERT INTO RECIPEFLAVOR (recipeID, flavorID) VALUES (?, ?)"
    );

    for (const r of recipes) {
        if (!r.ingredients || r.ingredients.length === 0) {
            throw new Error(`Recipe "${r.name}" must have at least one ingredient.`);
        }

        const fields = [
            r.name,
            r.description ?? null,
            r.instructions,
            r.calories,
            r.protein,
            r.fat,
            r.carbs,
            lookup(cuisineIDs, r.cuisine, "cuisine", r.name),
        ];

        let recipeID;
        const existing = findRecipe.get(r.name);
        if (!existing) {
            recipeID = insertRecipe.run(...fields).lastInsertRowid;
            stats.added++;
        } else if (existing.source === "seed") {
            //update so recipeID stays the same
            recipeID = existing.recipeID;
            updateRecipe.run(...fields, recipeID);
            for (const stmt of clearLinks) stmt.run(recipeID);
            stats.updated++;
        } else {
            stats.skipped.push(r.name);
            continue;
        }

        for (const [name, quantity = null, unit = null] of r.ingredients) {
            insertRecipeIngredient.run(
                recipeID,
                lookup(ingredientIDs, name, "ingredient", r.name),
                quantity,
                unit
            );
        }
        for (const diet of r.diets ?? []) {
            insertRecipeDiet.run(recipeID, lookup(dietIDs, diet, "diet", r.name));
        }
        for (const flavor of r.flavors ?? []) {
            insertRecipeFlavor.run(recipeID, lookup(flavorIDs, flavor, "flavor", r.name));
        }
    }

    db.exec("COMMIT");
} catch (err) {
    //error >> undo everything from this run
    db.exec("ROLLBACK");
    db.close();
    console.error("Seeding failed (no changes were made):", err.message);
    process.exit(1);
}

//summary

console.log(`Seeded ${DB_PATH}`);
console.log(`  Seed recipes added:   ${stats.added}`);
console.log(`  Seed recipes updated: ${stats.updated}`);
for (const name of stats.skipped) {
    console.warn(`  Skipped "${name}": an AI recipe with that name already exists.`);
}

const count = (sql) => db.prepare(sql).get().n;
console.log("");
for (const table of [
    "INGREDIENTCATEGORY", "INGREDIENT", "CUISINE", "DIET", "FLAVORPROFILE",
    "RECIPEINGREDIENT", "RECIPEDIET", "RECIPEFLAVOR",
]) {
    console.log(`  ${table.padEnd(18)} ${count(`SELECT COUNT(*) AS n FROM ${table}`)} rows`);
}
console.log(
    `  ${"RECIPE".padEnd(18)} ${count("SELECT COUNT(*) AS n FROM RECIPE")} rows ` +
    `(${count("SELECT COUNT(*) AS n FROM RECIPE WHERE source = 'seed'")} seed, ` +
    `${count("SELECT COUNT(*) AS n FROM RECIPE WHERE source = 'ai'")} AI)`
);
db.close();
