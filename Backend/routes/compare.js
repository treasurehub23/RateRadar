const express = require("express");

const {
    getWiseRate
} = require("../services/wiseService");

const {
    runAggregator
} = require("../services/aggregatorService");

const {
    getLatestComparison
} = require("../services/kvService");

const router = express.Router();

const cache = new Map();

const CACHE_DURATION =
    5 * 60 * 1000;

function getCacheKey(
    amount,
    sourceCurrency,
    targetCurrency
) {
    return `${amount}-${sourceCurrency}-${targetCurrency}`;
}

router.get("/", async (req, res) => {
    try {
        const amount = Number(
            req.query.amount || 1000
        );

        const sourceCurrency = (
            req.query.sourceCurrency || "USD"
        ).toUpperCase();

        const targetCurrency = (
            req.query.targetCurrency || "NGN"
        ).toUpperCase();

        if (!Number.isFinite(amount) || amount <= 0) {
            return res.status(400).json({
                success: false,
                error: "Amount must be greater than zero"
            });
        }

        const cacheKey = getCacheKey(
            amount,
            sourceCurrency,
            targetCurrency
        );

        const cached = cache.get(cacheKey);

        if (
            cached &&
            Date.now() - cached.timestamp <
                CACHE_DURATION
        ) {
            return res.json(cached.data);
        }

        const wise = await getWiseRate(
            amount,
            sourceCurrency,
            targetCurrency
        );

        await runAggregator([
            wise
        ]);

        const comparison =
            await getLatestComparison();

        const responseData = {
            success: true,
            data: comparison
        };

        cache.set(cacheKey, {
            timestamp: Date.now(),
            data: responseData
        });

        return res.json(responseData);
    } catch (error) {
        console.error(
            "Comparison error:",
            error.message
        );

        res.status(502).json({
            success: false,
            error:
                "Unable to generate rate comparison"
        });
    }
});

module.exports = router;