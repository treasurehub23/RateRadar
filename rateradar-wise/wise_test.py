import httpx

wise_url = "https://wise.com"
wise_connection = httpx.Client(base_url=wise_url,
                                headers={"Content-Type": "application/json"})
parameters = {"sendAmount" : 100, 
              "sourceCurrency" : "USD", 
              "targetCurrency" : "NGN",
              "filter" : "POPULAR",
              "includeWise" : "true"}

response = wise_connection.get(
    "/gateway/v4/comparisons",
    params=parameters
)

try:
    print(response.status_code)
    print(response.text)
 
    response.raise_for_status()
    data = response.json()
    print(data)

    if response.status_code == 200:
        print("Request successful!")
    else:
        print(f"Request failed with status code: {response.status_code}")
except httpx.RequestError as e:
    print(f"An error occurred while making the request: {e}")


    
for provider in data["providers"]:
    if provider.get("alias") == "wise":
        print(provider)
        break

quote = provider["quotes"][0]
print("...quote details....\n")
print("Rate:", quote["rate"])
print("Fee:", quote["fee"])
print("Received:", quote["receivedAmount"])
print("Timestamp:", quote["dateCollected"])