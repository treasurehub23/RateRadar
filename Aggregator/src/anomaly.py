# Aggregator/src/anomaly.py

def check_anomaly(new_rate, historical_rates, threshold=0.20):
    if not historical_rates:
        return {
            "flagged": False,
            "deviation_percent": 0.0,
            "average_rate": None,
            "threshold_percent": threshold * 100,
            "reason": "No historical data available"
        }

    valid_rates = [
        float(rate)
        for rate in historical_rates
        if isinstance(rate, (int, float)) and float(rate) > 0
    ]

    if not valid_rates:
        return {
            "flagged": False,
            "deviation_percent": 0.0,
            "average_rate": None,
            "threshold_percent": threshold * 100,
            "reason": "No valid historical rates available"
        }

    average_rate = sum(valid_rates) / len(valid_rates)

    deviation = abs(float(new_rate) - average_rate) / average_rate

    flagged = deviation > threshold

    return {
        "flagged": flagged,
        "deviation_percent": round(deviation * 100, 2),
        "average_rate": round(average_rate, 6),
        "threshold_percent": threshold * 100,
        "reason": (
            "Rate deviates significantly from recent average"
            if flagged
            else "Rate is within expected range"
        )
    }