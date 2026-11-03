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

export default router;
