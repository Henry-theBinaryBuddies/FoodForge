require("dotenv").config();
const express = require("express");
const { openDatabase } = require("./db/database");
const { findRecipes } = require("./db/search");

const { getOptions } = require("./db/options");

const db = openDatabase();

//stop early with a clear message if the database was never seeded
if (getOptions(db).ingredients.length === 0) {
    console.error("The database has no ingredients. Run 'npm run seed' first.");
    process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 4001;
const SERVICE_API_KEY = process.env.SERVICE_API_KEY;

app.use(express.json());

//health check: the only route that does not need the internal key
app.get("/health", function (req, res) {
    res.json({ status: "ok", service: "recipe-service" });
});

//INTERNAL API KEY: every route below requires the x-api-key header (set by the gateway)
app.use(function (req, res, next) {
    if (!SERVICE_API_KEY || req.get("x-api-key") !== SERVICE_API_KEY) {
        return res.status(401).json({ error: "Missing or invalid API key." });
    }
    next();
});

//everything the frontend can show as a selection (ingredients, macros, food preferences)
app.get("/options", function (req, res) {
    res.json(getOptions(db));
});

app.post("/recipe/search", function (req, res) {
    //DEFENSIVE CHECK: ENSURE JSON valid
    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
        return res.status(400).json({
            error: "Request body must be a JSON object."
        })
    }

    const ingredients = req.body.ingredients;
    const macros = req.body.macros;
    const foodPref = req.body.foodPref;

    //current options from the database
    const recipeData = getOptions(db);

    //==================DEFENSIVE CHECKS======================
    //DEFENSIVE CHECKS: INGREDIENTS
    //Throw error if data received isn't an array
    if (!Array.isArray(ingredients)) {
        return res.status(400).json({
            error: "Ingredients must be an array."
        });
    }

    //extract each ingredients name from category, combine into one list, store unique names.
    const allowedIngredients = new Set(
        recipeData.ingredients.flatMap((category) =>
            category.items.map((item) => item.name))
    );
    //Throw error if array contains an ingredient that isn't a selectable option
    if (!ingredients.every((ingredient) => allowedIngredients.has(ingredient))) {
        return res.status(400).json({
            error: "One or more ingredients are not recognized."
        });
    }
    //Throw error if an entry is an empty string.
    if (!ingredients.every((ingredient) =>
        typeof ingredient === "string" && ingredient.trim().length > 0
    )) {
        return res.status(400).json({
            error: "Each ingredient must be a nonempty string."
        })
    }
    //Throw error if ingredients array is less than 2.
    //We cast to a new Set because it filters out duplicates.
    if (new Set(ingredients).size < 2) {
        return res.status(400).json({
            error: "Select at least two ingredients."
        })
    }

    //DEFENSIVE CHECKS: MACROS
    //Throw error if macros is not an object or null.
    if (macros === null || typeof macros !== "object" || Array.isArray(macros)) {
        return res.status(400).json({
            error: "Macros must be an object"
        });
    }
    //Throw error if macro selection not in the macro options
    for (const category of recipeData.macros) {
        const selection = macros[category.name];

        if (
            selection !== null &&
            !category.toggles.some((option) => option.name === selection)
        ) {
            return res.status(400).json({
                error: `Invalid selection for ${category.name}.`
            });
        }
    }


    //DEFENSIVE CHECKS: FOODPREF
    //Throw error is foodPref is not an object or null.
    if (
        foodPref === null ||
        typeof foodPref !== "object" ||
        Array.isArray(foodPref)
    ) {
        return res.status(400).json({
            error: "Food preferences must be an object."
        });
    }
    //Throw error if food selection not in the database options
    for (const category of recipeData.foodPref) {
        const selection = foodPref[category.name];

        if (!Array.isArray(selection)) {
            return res.status(400).json({
                error: `${category.name} must be an array.`
            });
        }

        if (!selection.every((selection) =>
            category.toggles.some((option) => option.name === selection)
        )) {
            return res.status(400).json({
                error: `Invalid selection for ${category.name}.`
            });
        }
    }

    try {
        const recipes = findRecipes(db, { ingredients, macros, foodPref });
        res.json({ recipes });
    } catch(error) {
        console.error(error);
        res.status(500).json({error: "Failed to search for recipes"});
    }


});

// Default route.  Should only get to here if a route
// was passed in that we don't have a handler for.  Keep
// this route as the very last handler or bad things will
// happen.
app.use(function (req, res) {
    res.status(404).json({
        error: "Endpoint not found."
    })
});

// Start the server.
app.listen(PORT, function () {
    console.log("FoodForge app running at http://localhost:" + PORT);
});