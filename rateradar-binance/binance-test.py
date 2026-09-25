#import httpx
#binance_url = "https://api2.bybit.com/fiat/otc/item/online"
#binance_connection = httpx.Client(base_url=binance_url,
 #                                 headers={"Content-Type": "application/json"})
#parameters = {"asset" : "USDT",
#              "fiat" : "NGN",
#              "tradeType" : "SELL"}

#esponse = binance_connection.get("/bapi/c2c/v1/public/c2c/agent/quote-price",
 #                                   params=parameters)

#try:
    #print(response.status_code)
    #print(response.text)
    #response.raise_for_status()

    #data = response.json()
    #print(data)
    #if response.status_code == 200:
       # print("Request successful!")
    #else:
       # print(f"Request failed with status code: {response.status_code}")
#except httpx.RequestError as e:
    #print(f"An error occurred while making the request: {e}")

import httpx

url = "https://api2.bybit.com/fiat/otc/item/online"

response = httpx.get(url)

print("Status code:", response.status_code)
print("Response:")
print(response.text)

