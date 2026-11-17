const Groq = require("groq-sdk");

let groq;

async function askGroq(prompt) {
    // Created lazily so the server still starts without GROQ_API_KEY set
    groq ??= new Groq({ apiKey: process.env.GROQ_API_KEY });
    const completion = await groq.chat.completions.create({
        model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
    });
    return completion.choices[0].message.content;
}

module.exports = { askGroq };
