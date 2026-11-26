//fills database with starter data

// cd backend
// npm run seed

//creates any missing tables/columns
//adds or updates the categories, ingredients, pantry staples, cuisines, diets, and flavors from catalog.js
//(nothing is deleted. an item removed from catalog.js stays in the database)
//for each recipe in recipes.js
// -not in the database >> inserts it (source = 'seed')
// -already in there as a seed recipe >> updates it to match recipes.js
// -already in there as an AI recipe >> skips and prints a warning

const { openDatabase, DB_PATH } = require("./database");
const catalog = require("./catalog");
const recipes = require("./recipes");

//HELPERS
//looks up ID by name
function lookup(map, name, kind, recipeName) {
    const id = map.get(name);
    if (id === undefined) {
        throw new Error(
            `Recipe "${recipeName}" uses unknown ${kind} "${name}". ` +
            `It must exactly match a ${kind} name in db/catalog.js.`
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
    //ingredient categories (selectable ones + pantry staples)
    const upsertCategory = db.prepare(`
        INSERT INTO INGREDIENTCATEGORY (name, description) VALUES (?, ?)
        ON CONFLICT (name) DO UPDATE SET description = excluded.description
    `);
    for (const category of [...catalog.categories, catalog.staples.category]) {
        upsertCategory.run(category.name, category.description ?? null);
    }
    const categoryIDs = idMap(db, "INGREDIENTCATEGORY", "categoryID");

    //ingredients
    const upsertIngredient = db.prepare(`
        INSERT INTO INGREDIENT (name, imageURL, categoryID, isStaple) VALUES (?, ?, ?, ?)
        ON CONFLICT (name) DO UPDATE SET
            imageURL = excluded.imageURL,
            categoryID = excluded.categoryID,
            isStaple = excluded.isStaple
    `);
    for (const category of catalog.categories) {
        for (const item of category.items) {
            upsertIngredient.run(item.name, item.img ?? null, categoryIDs.get(category.name), 0);
        }
    }
    const stapleCategoryID = categoryIDs.get(catalog.staples.category.name);
    for (const name of catalog.staples.items) {
        upsertIngredient.run(name, null, stapleCategoryID, 1);
    }

    //cuisines, diets, flavors
    for (const [table, options] of [
        ["CUISINE", catalog.cuisines],
        ["DIET", catalog.diets],
        ["FLAVORPROFILE", catalog.flavors],
    ]) {
        const upsert = db.prepare(`
            INSERT INTO ${table} (name, imageURL) VALUES (?, ?)
            ON CONFLICT (name) DO UPDATE SET imageURL = excluded.imageURL
        `);
        for (const option of options) {
            upsert.run(option.name, option.img ?? null);
        }
    }

    const ingredientIDs = idMap(db, "INGREDIENT", "ingredientID");
    const cuisineIDs = idMap(db, "CUISINE", "cuisineID");
    const dietIDs = idMap(db, "DIET", "dietID");
    const flavorIDs = idMap(db, "FLAVORPROFILE", "flavorID");
    const stapleNames = new Set(catalog.staples.items);

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
        if (!r.ingredients || !r.ingredients.some(([name]) => !stapleNames.has(name))) {
            throw new Error(
                `Recipe "${r.name}" must have at least one ingredient that is not a pantry staple.`
            );
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
    "INGREDIENTCATEGORY", "CUISINE", "DIET", "FLAVORPROFILE",
    "RECIPEINGREDIENT", "RECIPEDIET", "RECIPEFLAVOR",
]) {
    console.log(`  ${table.padEnd(18)} ${count(`SELECT COUNT(*) AS n FROM ${table}`)} rows`);
}
console.log(
    `  ${"INGREDIENT".padEnd(18)} ${count("SELECT COUNT(*) AS n FROM INGREDIENT")} rows ` +
    `(${count("SELECT COUNT(*) AS n FROM INGREDIENT WHERE isStaple = 1")} pantry staples)`
);
console.log(
    `  ${"RECIPE".padEnd(18)} ${count("SELECT COUNT(*) AS n FROM RECIPE")} rows ` +
    `(${count("SELECT COUNT(*) AS n FROM RECIPE WHERE source = 'seed'")} seed, ` +
    `${count("SELECT COUNT(*) AS n FROM RECIPE WHERE source = 'ai'")} AI)`
);
db.close();
