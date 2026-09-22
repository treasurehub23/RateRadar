from fastapi import FastAPI, HTTPException
import uvicorn
from ML.classes import ExtractFeeInput, FeeResult, AnomalyInput, AnomalyResult
from dotenv import load_dotenv
from groq import Groq
import os
import json
import statistics
load_dotenv()
client = Groq(api_key = os.getenv("GROQ_API_KEY"))
app = FastAPI()
@app.get("/")
def health_check(): 
    return {"status": "healthy"}

cache : dict[str, FeeResult] = {}
@app.post("/extract_fee", response_model=FeeResult)
def extract_fee(data: ExtractFeeInput):
    key = f"{data.source}:{data.text}"
    prompt = f"Extract the percentage fee, flat_fee, currency(a short code like NGN) and conditions from the following text:{data.text} (source: {data.source}). Use null for anything not stated. Percentage is a number where 3 means 3%. Respond in JSON format with the following keys: percentage_fee, flat_fee, currency, conditions."
    if key in cache:
        return cache[key]
    try:
        response = client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=[{"role": "user", "content": prompt}],
            temperature=0,
            response_format={"type": "json_object"},
        )
        raw = response.choices[0].message.content
        if raw is None:
            raise ValueError("The model returned no content")
        result = json.loads(raw)
        result = FeeResult(
    percentage_fee=result.get("percentage_fee"),
            flat_fee=result.get("flat_fee"),
            currency=result.get("currency"),
                conditions=result.get("conditions")
            )
    except Exception as e:
        result = FeeResult(
            percentage_fee=None,
            flat_fee=None,
            currency=None,
            conditions=None,
            error=str(e))
    if result.error is None:
        cache[key]=result
    return result

@app.post("/check_anomaly", response_model=AnomalyResult)
def check_anomaly(input: AnomalyInput):
    ins_history = True
    anomaly = False
    if input.recent_rates == [] or input.recent_rates == [0]:
        result = AnomalyResult(
            isAnomaly=False,
            median=None,
            percentage_deviation=None,
            insufficient_history=True
        )
        return result
    
    rr_median = statistics.median(input.recent_rates)
    percentage_difference = abs((input.new_rate - rr_median) / rr_median)
    if len(input.recent_rates) >= 3:
        ins_history = False

    if percentage_difference > 0.20:
        anomaly = True

    result = AnomalyResult(
        isAnomaly= anomaly,
        median = rr_median,
        percentage_deviation = percentage_difference,
        insufficient_history= ins_history
        )
    return result