const express = require("express");

const {
    getLatestComparison
} = require("../services/kvService");

const {
    generateInsight
} = require("../services/aiService");

const router = express.Router();

router.post("/insight", async (req, res) => {
    try {
        const comparison =
            await getLatestComparison();

        const insight =
            await generateInsight(
                comparison
            );

        res.json({
            success: true,
            data: {
                insight
            }
        });
    } catch (error) {
        console.error(
            "AI error:",
            error.message
        );

        res.status(502).json({
            success: false,
            error:
                "Unable to generate AI insight"
        });
    }
});

module.exports = router;