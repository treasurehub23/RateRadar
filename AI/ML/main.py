from fastapi import FastAPI
import uvicorn
from pydantic import BaseModel
from dotenv import load_dotenv
from groq import Groq
import os

load_dotenv()

client = Groq(api_key = os.getenv("GROQ_API_KEY"), model=os.getenv("GROQ_MODEL"))
app = FastAPI()
]class 
@app.get("/")
def health_check(): 
    return {"status": "healthy"}

@app.post("extract_fee")
def extract_fee(data: dict):