
const axios = require("axios");

const APIFY_BASE_URL = "https://api.apify.com/v2";

async function getKVValue(key) {
    const storeId = process.env.AGGREGATOR_KV_STORE_ID;

    if (!storeId) {
        throw new Error(
            "AGGREGATOR_KV_STORE_ID is not configured"
        );
    }

    if (!process.env.APIFY_TOKEN) {
        throw new Error(
            "APIFY_TOKEN is not configured"
        );
    }

    const response = await axios.get(
        `${APIFY_BASE_URL}/key-value-stores/${storeId}/records/${key}`,
        {
            headers: {
                Authorization: `Bearer ${process.env.APIFY_TOKEN}`
            },
            timeout: 15000
        }
    );

    return response.data;
}

async function getLatestComparison() {
    return getKVValue(
        "LATEST_COMPARISON"
    );
}

async function getLatestAlerts() {
    return getKVValue(
        "LATEST_ALERTS"
    );
}

module.exports = {
    getKVValue,
    getLatestComparison,
    getLatestAlerts
};