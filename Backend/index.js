require("dotenv").config();

const express = require("express");
const cors = require("cors");

const ratesRouter =
    require("./routes/rates");

const compareRouter =
    require("./routes/compare");

const alertsRouter =
    require("./routes/alerts");

const aiRouter =
    require("./routes/ai");

const app = express();

const PORT =
    process.env.PORT || 3000;

app.use(
    cors({
        origin: true
    })
);

app.use(
    express.json()
);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message:
            "RateRadar backend is running"
    });
});

app.get("/health", (req, res) => {
    res.json({
        success: true,
        service: "RateRadar API",
        status: "healthy",
        timestamp:
            new Date().toISOString()
    });
});

app.use(
    "/api/rates",
    ratesRouter
);

app.use(
    "/api/compare",
    compareRouter
);

app.use(
    "/api/alerts",
    alertsRouter
);

app.use(
    "/api/ai",
    aiRouter
);

app.use(
    (req, res) => {
        res.status(404).json({
            success: false,
            error: "Route not found"
        });
    }
);

app.use(
    (error, req, res, next) => {
        console.error(
            "Unhandled error:",
            error
        );

        res.status(500).json({
            success: false,
            error:
                "Internal server error"
        });
    }
);

app.listen(
    PORT,
    () => {
        console.log(
            `RateRadar backend running on port ${PORT}`
        );
    }
);