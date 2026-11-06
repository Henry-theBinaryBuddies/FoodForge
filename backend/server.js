import "dotenv/config";
import express from "express";
import cors from "cors";
import recipesRouter from "./routes/recipes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:4000" }));
app.use(express.json());
app.use("/api/recipes", recipesRouter);

app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});

app.listen(PORT, () => {
    console.log(`FoodForge backend running at http://localhost:${PORT}`);
});
