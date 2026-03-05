from pydantic import BaseModel

class UserForecastRequest(BaseModel):
    age: int
    gender: str
    height: float
    weight: float
