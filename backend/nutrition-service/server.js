require("dotenv").config();
const express = require("express");

const app = express();
const PORT = process.env.PORT || 4003;
const SERVICE_API_KEY = process.env.SERVICE_API_KEY;

//Open Food Facts: free, no API key. It asks clients to send an identifying User-Agent.
const OFF_URL = "https://world.openfoodfacts.org/cgi/search.pl";
const USER_AGENT = "FoodForge/1.0 (course project)";

//Open Food Facts sometimes answers 503 under load, so: one retry, and answers are cached
//in memory (an AI run often asks about the same ingredient several times)
const cache = new Map();
const CACHE_MS = 60 * 60 * 1000;

async function fetchFromOff(url) {
    let response;
    for (let attempt = 0; attempt < 2; attempt++) {
        response = await fetch(url, {
            headers: { "User-Agent": USER_AGENT },
            signal: AbortSignal.timeout(8000),
        });
        if (response.status < 500) break;
        await new Promise((resolve) => setTimeout(resolve, 700));
    }
    return response;
}

app.use(express.json());

app.get("/health", function (req, res) {
    res.json({ status: "ok", service: "nutrition-service" });
});

//INTERNAL API KEY: everything below requires x-api-key
app.use(function (req, res, next) {
    if (!SERVICE_API_KEY || req.get("x-api-key") !== SERVICE_API_KEY) {
        return res.status(401).json({ error: "Missing or invalid API key." });
    }
    next();
});

//GET /nutrition?ingredient=chicken
//returns calories, protein, fat and carbs per 100 g for the best matching product
app.get("/nutrition", async function (req, res) {
    const ingredient = req.query.ingredient;

    //validation
    if (typeof ingredient !== "string" || ingredient.trim().length === 0) {
        return res.status(400).json({ error: "Query parameter 'ingredient' is required." });
    }
    if (ingredient.length > 100) {
        return res.status(400).json({ error: "Query parameter 'ingredient' must be 100 characters or fewer." });
    }

    const key = ingredient.trim().toLowerCase();
    const cached = cache.get(key);
    if (cached && Date.now() - cached.at < CACHE_MS) {
        return res.json(cached.body);
    }

    const url = new URL(OFF_URL);
    url.search = new URLSearchParams({
        search_terms: ingredient.trim(),
        search_simple: "1",
        action: "process",
        json: "1",
        page_size: "10",
        fields: "product_name,brands,nutriments",
    }).toString();

    let data;
    try {
        const response = await fetchFromOff(url);
        if (response.status === 429) {
            return res.status(429).json({ error: "The nutrition data source is rate-limiting requests. Please try again shortly." });
        }
        if (!response.ok) throw new Error(`Open Food Facts returned ${response.status}`);
        data = await response.json();
    } catch (err) {
        console.error(err);
        return res.status(503).json({ error: "The nutrition data source is temporarily unavailable." });
    }

    //first product that actually has calorie data
    const product = (data.products ?? []).find(
        (p) => typeof p.nutriments?.["energy-kcal_100g"] === "number"
    );
    if (!product) {
        return res.status(404).json({ error: `No nutrition data was found for '${ingredient.trim()}'.` });
    }

    const n = product.nutriments;
    const round = (value) => Math.round((Number(value) || 0) * 10) / 10;
    const body = {
        ingredient: ingredient.trim(),
        source: "Open Food Facts",
        matchedProduct: product.product_name || null,
        per: "100g",
        calories: Math.round(n["energy-kcal_100g"]),
        protein: round(n.proteins_100g),
        fat: round(n.fat_100g),
        carbs: round(n.carbohydrates_100g),
    };
    cache.set(key, { at: Date.now(), body });
    res.json(body);
});

app.use(function (req, res) {
    res.status(404).json({ error: "Endpoint not found." });
});

app.listen(PORT, function () {
    console.log("nutrition-service running at http://localhost:" + PORT);
});
