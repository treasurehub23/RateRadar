from apify import Actor


async def get_store(store_id: str):
    if not store_id:
        raise ValueError("kvStoreId is required")

    return await Actor.open_key_value_store(
        id=store_id,
        force_cloud=True
    )


async def get_rate_history(store_id: str):
    store = await get_store(store_id)

    history = await store.get_value(
        "RATE_HISTORY",
        []
    )

    if not isinstance(history, list):
        return []

    return history


async def update_rate_history(
    store_id: str,
    rates
):
    store = await get_store(store_id)

    await store.set_value(
        "RATE_HISTORY",
        rates
    )


async def save_latest_comparison(
    store_id: str,
    comparison
):
    store = await get_store(store_id)

    await store.set_value(
        "LATEST_COMPARISON",
        comparison
    )


async def save_alerts(
    store_id: str,
    alerts
):
    store = await get_store(store_id)

    await store.set_value(
        "LATEST_ALERTS",
        alerts
    )