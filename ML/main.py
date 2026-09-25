from fastapi import FastAPI, HTTPException
import uvicorn
from ML.classes import Status, ExtractFeeInput, FeeResult, AnomalyInput, AnomalyResult, MerchantInput, MerchantResult
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

def baseline_reliability(data:MerchantInput) -> tuple[Status, bool]:
    levels: tuple[Status, ...] = ("Low", "Medium", "High")  # ordered worst to best

    def downgrade(status: Status) -> Status:
        idx = levels.index(status)
        idx = max(idx - 1, 0)  # move one step down, but not below "Low"
        return levels[idx]
    
    low_order_count = False

    status: Status

    if data.order_count <20:
        low_order_count = True
        if data.completion_rate >= 85:
            status = "High"
        elif data.completion_rate >= 60:
            status = "Medium"
        else:
            status = "Low"
    else:
        if data.completion_rate >= 80:
            status = "High"
        elif data.completion_rate >= 50:
            status = "Medium"
        else: 
            status = "Low"

    if data.average_release_time > 30:
        status = downgrade(status)

    
    return status, low_order_count


FALLBACK_REASONS: dict[Status, str] = {
    "High": "This merchant has a strong completion rate and releases funds quickly.",
    "Medium": "This merchant is generally reliable, but has a lower completion rate, a slower release time, or limited trade history worth noting.",
    "Low": "This merchant has a low completion rate, slow fund releases, or too little trade history to fully trust yet.",
}

@app.post("/score_merchant", response_model=MerchantResult)
def score_merchant(data:MerchantInput):
    reliability_status, low_order_count = baseline_reliability(data)
    try:
        reviews_text = "\n".join(f"- {r}" for r in data.recent_reviews) if data.recent_reviews else "No recent reviews available."

        prompt = f"""You are evaluating a P2P crypto merchant for reliability, not rate.

        A rule-based system has already calculated a baseline reliability status of "{reliability_status}" using these numbers:
        - Completion rate: {data.completion_rate}%
        - Average release time: {data.average_release_time} minutes
        - Order count: {data.order_count}

        Recent reviews:
        {reviews_text}

        Your job:
        1. Write one short, non-technical sentence explaining the reliability status to a regular user — reference the reviews if they reveal something meaningful.
        2. You may only DOWNGRADE the baseline status if the reviews reveal a serious, repeated problem the numbers don't show (e.g. multiple recent reports of delays, scams, or failed trades). You may never upgrade it. If you see no reason to downgrade, keep the status exactly as given.
        3. The status must be exactly one of: "High", "Medium", "Low" — never any other word.

        Respond in JSON only with exactly these keys:
        {{"reason": "one short sentence", "status": "High" or "Medium" or "Low"}}"""

        response = client.chat.completions.create(model="openai/gpt-oss-20b",
                    messages=[{"role": "user", "content": prompt}],
                    temperature=0,
                    response_format={"type": "json_object"},)
        raw_text = response.choices[0].message.content
        if raw_text is None:
            raise ValueError("The model returned no content")
        reply = json.loads(raw_text)
        reason = reply["reason"]
        new_status = reply["status"]
        levels: tuple[Status, ...] = ("Low", "Medium", "High")  # ordered worst to best
        
        if new_status not in levels or levels.index(new_status) > levels.index(reliability_status):
            new_status = reliability_status
        result = MerchantResult(
            reliability_status=new_status,
            reason=reason,
            low_order_count=low_order_count,

        )
    except Exception as e:
        result=MerchantResult(reliability_status=reliability_status,
                              low_order_count=low_order_count,
                              reason=FALLBACK_REASONS[reliability_status],
                              error=str(e))

    return result
    