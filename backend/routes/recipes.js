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

    if(!Array.isArray(ingredients)) {
        return res.status(400).json({ error: "Ingredients must be array." });
    }

    const allowedIngredients = new Set(
        recipeData.ingredients.flatMap((category) =>
            category.items.map((item) => item.name))
    );

    if (!ingredients.every((i) => allowedIngredients.has(i))) {
        return res.status(400).json({ error: "One or more ingredients are not recognized." });
    }

    if (new Set(ingredients).size < 2) {
        return res.status(400).json({ error: "Select at least two ingredients." });
    }

    res.json({ ingredients, macros, foodPref });

});

export default router;
