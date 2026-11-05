import { Router } from "express";
import { askGroq } from "../services/ai.js";


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

    const { ingredients } = req.body;

    if(!Array.isArray(ingredients)) {
        return res.status(400).json({ error: "Ingredients must be array." });
    }

    if(ingredients.length === 0){
        return res.status(400).json({ error: "Please select an ingredient." });
    }

    if(!ingredients.every((i) => typeof i === "string" && i.trim().length > 0)) {
        return res.status(400).json({ error: "Each ingredient must be a nonempty string. "});
    }

    res.json({ ingredients });

});

export default router;
