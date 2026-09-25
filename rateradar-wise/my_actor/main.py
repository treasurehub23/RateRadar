"""Module's job is to start the Apify Actor, read input for amount,
sourceCurrency and targetCurrency, request a quote from Wise,
find the Wise provider and quote, and push the normalized result
to the Apify Dataset.
"""

from __future__ import annotations

from apify import Actor
import httpx




async def main() -> None:
    """Define a main entry point for the Apify Actor.

    This coroutine is executed using `asyncio.run()`, so it must remain an asynchronous function for proper execution.
    Asynchronous execution is required for communication with Apify platform, and it also enhances performance in
    the field of web scraping significantly.
    """
    # Enter the context of the Actor.
    async with Actor:
        # Retrieve the Actor input, and use default values if not provided.
        actor_input = await Actor.get_input() or {}

        amount = actor_input["amount"]
        source_currency = actor_input["sourceCurrency"]
        target_currency = actor_input["targetCurrency"]

        parameters = {
            "sendAmount": amount,
            "sourceCurrency": source_currency,
            "targetCurrency": target_currency,
            "filter": "POPULAR",
            "includeWise": "true"
        }


        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://wise.com/gateway/v4/comparisons",
                params=parameters,
                headers={"Content-Type": "application/json"}
            )
        print(f"Response status code: {response.status_code}")
        response.raise_for_status()

        data = response.json()

        for provider in data["providers"]:
            if provider.get("alias") == "wise":
                provider_data = provider
                break
        quote = provider_data["quotes"][0]
        print("...quote details....\n")
        print("Rate:", quote["rate"])
        print("Fee:", quote["fee"])
        print("Received:", quote["receivedAmount"])
        print("Timestamp:", quote["dateCollected"])

        normalized_data ={
            "source" : "wise",
            "source_type" : "remittance",
            "base_currency" : source_currency,
            "target_currency" : target_currency,
            "amount_sent" : amount,
            "rate" : quote["rate"],
            "fee" : quote["fee"],
            "amount_received" : quote["receivedAmount"],
            "timestamp" : quote["dateCollected"]
        }

        await Actor.push_data(normalized_data)