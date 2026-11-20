require("dotenv").config();
const express = require("express");
const { askGroq } = require("./ai");

const app = express();
const PORT = process.env.PORT || 4004;
const SERVICE_API_KEY = process.env.SERVICE_API_KEY;

app.use(express.json());

app.get("/health", function (req, res) {
    res.json({ status: "ok", service: "ai-agent-service", mode: process.env.AI_MODE || "mock" });
});

//INTERNAL API KEY: everything below requires x-api-key
app.use(function (req, res, next) {
    if (!SERVICE_API_KEY || req.get("x-api-key") !== SERVICE_API_KEY) {
        return res.status(401).json({ error: "Missing or invalid API key." });
    }
    next();
});

//first AI call: proves Groq works from this service
app.get("/test-ai", async function (req, res) {
    try {
        const reply = await askGroq("Suggest one simple dinner using eggs and spinach. Keep it to two sentences.");
        res.json({ reply });
    } catch (err) {
        console.error(err);
        res.status(err.status === 429 ? 429 : 503).json({ error: "The assistant is temporarily unavailable. Please try again later." });
    }
});

//TODO: POST /assistant/... route that calls runAgent() from agent.js

app.use(function (req, res) {
    res.status(404).json({ error: "Endpoint not found." });
});

app.listen(PORT, function () {
    console.log("ai-agent-service running at http://localhost:" + PORT);
});
