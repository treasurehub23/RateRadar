
const axios = require("axios");

const APIFY_BASE_URL = "https://api.apify.com/v2";

function getApifyHeaders() {
    return {
        Authorization: `Bearer ${process.env.APIFY_TOKEN}`,
        "Content-Type": "application/json"
    };
}

async function runWiseActor(
    amount,
    sourceCurrency,
    targetCurrency
) {
    const actorId = process.env.WISE_ACTOR_ID;

    if (!actorId) {
        throw new Error("WISE_ACTOR_ID is not configured");
    }

    if (!process.env.APIFY_TOKEN) {
        throw new Error("APIFY_TOKEN is not configured");
    }

    const response = await axios.post(
        `${APIFY_BASE_URL}/acts/${actorId}/runs`,
        {
            amount,
            sourceCurrency,
            targetCurrency
        },
        {
            params: {
                waitForFinish: 60
            },
            headers: getApifyHeaders(),
            timeout: 70000
        }
    );

    return response.data.data;
}

async function getWiseDataset(runId) {
    const response = await axios.get(
        `${APIFY_BASE_URL}/actor-runs/${runId}/dataset/items`,
        {
            params: {
                clean: true,
                limit: 1
            },
            headers: getApifyHeaders(),
            timeout: 15000
        }
    );

    return response.data;
}

async function getWiseRate(
    amount,
    sourceCurrency,
    targetCurrency
) {
    const run = await runWiseActor(
        amount,
        sourceCurrency,
        targetCurrency
    );

    if (!run || run.status !== "SUCCEEDED") {
        throw new Error(
            `Wise Actor failed with status: ${run?.status || "UNKNOWN"}`
        );
    }

    const dataset = await getWiseDataset(run.id);

    if (!Array.isArray(dataset) || dataset.length === 0) {
        throw new Error(
            "Wise Actor returned no dataset records"
        );
    }

    return dataset[0];
}

module.exports = {
    getWiseRate
};