# Aggregator/src/main.py

from apify import Actor

from .aggregator import aggregate_rates
from .kv_store import (
    get_rate_history,
    update_rate_history,
    save_latest_comparison,
    save_alerts
)


async def main():
    async with Actor:

        actor_input = await Actor.get_input() or {}

        raw_rates = actor_input.get(
            "rates",
            []
        )

        kv_store_id = actor_input.get("kvStoreId")
        if not isinstance(raw_rates, list):
            raise ValueError(
                "'rates' must be an array"
            )

        if not raw_rates:
            raise ValueError(
                "No rate data supplied to aggregator"
            )

        
        historical_history = await get_rate_history(
            kv_store_id
        )

        historical_rates = [
            item["rate"]
            for item in historical_history
            if isinstance(item, dict)
            and isinstance(
                item.get("rate"),
                (int, float)
            )
        ]

        comparison = aggregate_rates(
            raw_rates,
            historical_rates
        )

        await update_rate_history(
            kv_store_id,
            comparison["all_routes"]
        )

        await save_latest_comparison(
            kv_store_id,
            comparison
        )

        await save_alerts(
            kv_store_id,
            comparison["alerts"]
        )

        await Actor.push_data(
            comparison
        )

        print(
            "RateRadar aggregation completed."
        )

        print(
            f"Corridor: {comparison['corridor']}"
        )

        print(
            f"Routes processed: "
            f"{len(comparison['all_routes'])}"
        )

        print(
            f"Routes accepted: "
            f"{len(comparison['routes'])}"
        )

        print(
            f"Alerts: "
            f"{len(comparison['alerts'])}"
        )


if __name__ == "__main__":
    import asyncio

    asyncio.run(main())