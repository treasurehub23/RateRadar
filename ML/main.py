from fastapi import FastAPI
import uvicorn
from pydantic import BaseModel
from dotenv import load_dotenv
from groq import Groq
import os
import json

load_dotenv()
MODEL = os.getenv("GROQ_MODEL")
client = Groq(api_key = os.getenv("GROQ_API_KEY"), model=os.getenv("GROQ_MODEL"))
app = FastAPI()
class ExtractFeeInput(BaseModel):
    text: str
    source: str

class ExtractFeeOutput(BaseModel):
    percentage_fee: int | None
    flat_fee: float | None
    currency: str
    conditions: str | None

@app.get("/")
def health_check(): 
    return {"status": "healthy"}

@app.post("extract_fee")
def extract_fee(data: ExtractFeeInput, response_model=ExtractFeeOutput):
    prompt = f"Extract the percentage fee, flat_fee, currency and conditions from the following text:{data.text} (source: {data.source}). Use null for anything not stated."
    response = client.chat.completions.create(
    model=MODEL,
    messages=[{"role": "user", "content": prompt}],
    temperature=0,
    response_format={"type": "json_object"},
)
    raw = response.choices[0].message.content
    data = json.loads(raw)
    data = ExtractFeeOutput(
        percentage_fee=data.get("percentage_fee"),
        flat_fee=data.get("flat_fee"),
        currency=data.get("currency"),
        conditions=data.get("conditions")
    )
    return data