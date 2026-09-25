const express = require("express");

const {
    getLatestAlerts
} = require("../services/kvService");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const alerts =
            await getLatestAlerts();

        res.json({
            success: true,
            data: alerts
        });
    } catch (error) {
        console.error(
            "Alerts error:",
            error.message
        );

        res.status(502).json({
            success: false,
            error:
                "Unable to retrieve alerts"
        });
    }
});

module.exports = router;