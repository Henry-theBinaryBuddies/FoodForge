const express = require("express");
const cors = require("cors");
const { askGroq } = require("./services/ai.js");
const { openDatabase } = require("./db/database");
const { findRecipes } = require("./db/search");

const db = openDatabase();


const recipeData = require("../frontend/src/data/data.json");

const app = express();
const PORT = 4000;
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/recipe/test-ai", async function (req, res) {
    try {
        const reply = await askGroq("Suggest one simple dinner using eggs and spinach. Keep it to two sentences.");
        res.json({ reply });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "AI request failed" });
    }
});

app.post("/recipe", function (req, res) {
    //DEFENSIVE CHECK: ENSURE JSON valid
    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
        return res.status(400).json({
            error: "Request body must be a JSON object."
        })
    }

    const ingredients = req.body.ingredients;
    const macros = req.body.macros;
    const foodPref = req.body.foodPref;

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
    //Throw error if array contains an ingredient not within JSON
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
    //Throw error if macro selection not in JSON options
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
    //Throw error if food selection not in JSON options
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

app.use(function (req, res) {
    res.status(404).json({
        error: "Endpoint not found."
    })
});

app.listen(PORT, function () {
    console.log("FoodForge app running at http://localhost:" + PORT);
});