from pydantic import Field, BaseModel
class ExtractFeeInput(BaseModel):
    text: str
    source: str

class FeeResult(BaseModel):
    percentage_fee: float | None = Field(ge=0, le=40)
    flat_fee: float | None = Field(ge=0)
    currency: str |None
    conditions: str | None
    error: str | None = None


class AnomalyInput(BaseModel):
    source: str
    new_rate: float
    recent_rates: list[float]

class AnomalyResult(BaseModel):
    isAnomaly: bool
    median: float | None
    percentage_deviation: float | None
    insufficient_history: bool    
