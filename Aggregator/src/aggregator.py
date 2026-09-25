#Aggregator/src/aggregator.py

from datetime import datetime, timezone

from .anomaly import check_anomaly


def normalize_rate(raw):
    required_fields = [
        "source",
        "base_currency",
        "target_currency",
        "amount_sent",
        "rate",
        "fee",
        "amount_received",
        "timestamp"
    ]

    missing = [
        field
        for field in required_fields
        if raw.get(field) is None
    ]

    if missing:
        raise ValueError(
            f"Missing required fields: {', '.join(missing)}"
        )

    amount_sent = float(raw["amount_sent"])
    rate = float(raw["rate"])
    fee = float(raw["fee"])
    amount_received = float(raw["amount_received"])

    if amount_sent <= 0:
        raise ValueError("amount_sent must be greater than zero")

    if rate <= 0:
        raise ValueError("rate must be greater than zero")

    if fee < 0:
        raise ValueError("fee cannot be negative")

    if amount_received < 0:
        raise ValueError("amount_received cannot be negative")

    return {
        "source": str(raw["source"]).lower(),
        "source_type": raw.get("source_type"),

        "base_currency": str(
            raw["base_currency"]
        ).upper(),

        "target_currency": str(
            raw["target_currency"]
        ).upper(),

        "corridor": (
            f"{str(raw['base_currency']).upper()}/"
            f"{str(raw['target_currency']).upper()}"
        ),

        "amount_sent": amount_sent,
        "rate": rate,
        "fee": fee,
        "amount_received": amount_received,

        "timestamp": raw["timestamp"],

        "merchant": raw.get("merchant"),
        "merchant_completion_rate": raw.get(
            "merchant_completion_rate"
        ),
        "merchant_order_count": raw.get(
            "merchant_order_count"
        ),
        "merchant_release_time": raw.get(
            "merchant_release_time"
        )
    }


def aggregate_rates(raw_rates, historical_rates):
    normalized_rates = []

    for raw_rate in raw_rates:
        normalized_rates.append(
            normalize_rate(raw_rate)
        )

    routes = []
    alerts = []

    for rate in normalized_rates:
        anomaly = check_anomaly(
            rate["rate"],
            historical_rates
        )

        rate["anomaly"] = anomaly

        if anomaly["flagged"]:
            alerts.append({
                "type": "rate_anomaly",
                "source": rate["source"],
                "corridor": rate["corridor"],
                "message": (
                    f"{rate['source']} rate deviates "
                    f"{anomaly['deviation_percent']}% "
                    f"from the historical average."
                ),
                "details": anomaly
            })
        else:
            routes.append(rate)

    routes.sort(
        key=lambda route: route["amount_received"],
        reverse=True
    )

    first = normalized_rates[0]

    return {
        "corridor": first["corridor"],
        "amount": first["amount_sent"],
        "base_currency": first["base_currency"],
        "target_currency": first["target_currency"],

        "generated_at": datetime.now(
            timezone.utc
        ).isoformat(),

        "routes": routes,

        "all_routes": normalized_rates,

        "best_route": (
            routes[0]["source"]
            if routes
            else None
        ),

        "alerts": alerts
    }