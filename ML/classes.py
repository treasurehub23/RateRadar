from pydantic import Field, BaseModel, ValidationError
from typing import Literal
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
    isAnomaly: bool = False
    median: float | None
    percentage_deviation: float | None
    insufficient_history: bool   = True  

class MerchantInput(BaseModel):
    completion_rate: float
    order_count: int
    average_release_time: float # Still need to know the unit
    recent_reviews: list[str]

Status = Literal["Low", "Medium", "High"]
class MerchantResult(BaseModel):
    reliability_status: Status |None
    reason: str |None 
    low_order_count: bool = False
    error: str | None = None