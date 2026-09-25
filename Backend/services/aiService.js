const axios = require("axios");

async function generateInsight(comparison) {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
        throw new Error(
            "GROQ_API_KEY is not configured"
        );
    }

    const prompt = `
You are the RateRadar financial-data explanation assistant.

Analyze the structured exchange-rate data below.

Rules:
- Do not invent rates, fees, providers, or facts.
- Only discuss information present in the supplied data.
- Explain the current rate, fee, amount received, and anomaly information.
- If there are multiple routes, explain the differences.
- If an anomaly is flagged, clearly mention it.
- Keep the response concise and useful for a dashboard.
- Do not present financial advice.

RateRadar data:

${JSON.stringify(comparison, null, 2)}
`;

    const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
            model:
                process.env.GROQ_MODEL ||
                "llama-3.1-8b-instant",

            messages: [
                {
                    role: "system",
                    content:
                        "You explain structured financial data accurately and concisely."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],

            temperature: 0.2,

            max_tokens: 300
        },
        {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            timeout: 30000
        }
    );

    return (
        response.data?.choices?.[0]?.message?.content ||
        "No AI insight was generated."
    );
}

module.exports = {
    generateInsight
};