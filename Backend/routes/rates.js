const express = require("express");

const {
    getWiseRate
} = require("../services/wiseService");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const amount = Number(
            req.query.amount || 100
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

        const rate = await getWiseRate(
            amount,
            sourceCurrency,
            targetCurrency
        );

        res.json({
            success: true,
            data: rate
        });
    } catch (error) {
        console.error(
            "Rates error:",
            error.message
        );

        res.status(502).json({
            success: false,
            error: "Unable to retrieve exchange rate"
        });
    }
});

module.exports = router;