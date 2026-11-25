require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
const SERVICE_API_KEY = process.env.SERVICE_API_KEY;

//service URLs come from the environment, with localhost defaults
const SERVICES = {
    recipe: process.env.RECIPE_SERVICE_URL || "http://localhost:4001",
    nutrition: process.env.NUTRITION_SERVICE_URL || "http://localhost:4003",
    ai: process.env.AI_SERVICE_URL || "http://localhost:4004",
};

app.use(cors({ origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173" }));
app.use(express.json());

//forwards a request to a service, adds the internal x-api-key, and passes the
//service's status and body straight back (including an empty 204)
//if the service cannot be reached: 502
async function forward(res, serviceName, path, { method = "GET", body, query } = {}) {
    const url = new URL(path, SERVICES[serviceName]);
    if (query) url.search = new URLSearchParams(query).toString();

    try {
        const response = await fetch(url, {
            method,
            headers: {
                "x-api-key": SERVICE_API_KEY,
                ...(body !== undefined && { "Content-Type": "application/json" }),
            },
            body: body !== undefined ? JSON.stringify(body) : undefined,
            //the AI service makes several Groq calls, so it gets longer
            signal: AbortSignal.timeout(serviceName === "ai" ? 60000 : 10000),
        });

        //read as text first: a 204 has no body, so calling .json() on it would throw
        const text = await response.text();
        res.status(response.status);
        if (!text) return res.end();
        res.type(response.headers.get("content-type") || "application/json").send(text);
    } catch (err) {
        console.error(`Gateway could not reach ${serviceName} service:`, err.message);
        res.status(502).json({ error: `The API Gateway could not reach the ${serviceName} service.` });
    }
}

//HEALTH: reports every service as up or down (503 if any is down)
app.get("/api/health", async function (req, res) {
    const entries = await Promise.all(
        Object.entries(SERVICES).map(async ([name, baseUrl]) => {
            try {
                const response = await fetch(new URL("/health", baseUrl), { signal: AbortSignal.timeout(3000) });
                return [name, response.ok ? "up" : "down"];
            } catch {
                return [name, "down"];
            }
        })
    );
    const services = Object.fromEntries(entries);
    const allUp = entries.every(([, status]) => status === "up");
    res.status(allUp ? 200 : 503).json({ status: allUp ? "ok" : "degraded", gateway: "up", services });
});

//OPTIONS: everything the frontend can show as a selection (from the recipe service's database)
app.get("/api/options", (req, res) =>
    forward(res, "recipe", "/options"));

//RECIPES
app.post("/api/recipe/search", (req, res) =>
    forward(res, "recipe", "/recipe/search", { method: "POST", body: req.body }));

//NUTRITION
app.get("/api/nutrition", (req, res) =>
    forward(res, "nutrition", "/nutrition", { query: req.query }));

//default route: must stay below every route above
app.use(function (req, res) {
    res.status(404).json({ error: "Endpoint not found." });
});

app.listen(PORT, function () {
    console.log("api-gateway running at http://localhost:" + PORT);
});
