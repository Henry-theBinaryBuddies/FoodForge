import { Router } from "express";
import { askGroq } from "../services/ai.js";
import recipeData from "../../frontend/src/data/data.json" with { type: "json" };



const router = Router();

router.get("/test-ai", async (req, res) => {
    try {
        const reply = await askGroq("Suggest one simple dinner using eggs and spinach. Keep it to two sentences.");
        res.json({ reply });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "AI request failed" });
    }
});

router.post("/", (req, res) => {

    const { ingredients, macros, foodPref } = req.body ?? {};

    // Ensuring ingredients is an Array
    if(!Array.isArray(ingredients)) {
        return res.status(400).json({ error: "Ingredients must be array." });
    }

    // Creating a set for all ingredients in JSON file
    const allowedIngredients = new Set(
        recipeData.ingredients.flatMap((category) =>
            category.items.map((item) => item.name))
    );

    // Ensuring each ingredient is in the allowed ingredits set
    // Every ingredient must be in the JSON file
    if (!ingredients.every((i) => allowedIngredients.has(i))) {
        return res.status(400).json({ error: "One or more ingredients are not recognized." });
    }

    // A user must select at least 2 ingredients
    if (new Set(ingredients).size < 2) {
        return res.status(400).json({ error: "Select at least two ingredients." });
    }

    // Render results
    res.json({ ingredients, macros, foodPref });

});

export default router;
