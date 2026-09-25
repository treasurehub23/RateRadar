const axios = require("axios");

const APIFY_BASE_URL = "https://api.apify.com/v2";

function getHeaders() {
    return {
        Authorization: `Bearer ${process.env.APIFY_TOKEN}`,
        "Content-Type": "application/json"
    };
}

async function runAggregator(rates) {
    const actorId = process.env.AGGREGATOR_ACTOR_ID;

    if (!actorId) {
        throw new Error(
            "AGGREGATOR_ACTOR_ID is not configured"
        );
    }

    if (!process.env.APIFY_TOKEN) {
        throw new Error(
            "APIFY_TOKEN is not configured"
        );
    }

    const response = await axios.post(
        `${APIFY_BASE_URL}/acts/${actorId}/runs`,
        {
            rates
        },
        {
            params: {
                waitForFinish: 60
            },
            headers: getHeaders(),
            timeout: 70000
        }
    );

    const run = response.data.data;

    if (!run || run.status !== "SUCCEEDED") {
        throw new Error(
            `Aggregator Actor failed with status: ${
                run?.status || "UNKNOWN"
            }`
        );
    }

    return run;
}

module.exports = {
    runAggregator
};