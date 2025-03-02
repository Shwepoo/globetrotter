from pydantic import BaseModel
from typing import List, Optional
from bson import ObjectId

# Pydantic model for a destination
class Destination(BaseModel):
    city: str
    country: str
    clues: List[str]
    fun_fact: Optional[List[str]] = None  # Mark as Optional if it might be missing
    trivia: Optional[List[str]] = None    # Same as above

# Pydantic model for a user
class User(BaseModel):
    username: str
    score: int = 0

    class Config:
        from_attributes = True  # Allows Pydantic to work with MongoDB documents

# Model for validating user's answer request
class AnswerRequest(BaseModel):
    city: str
    answer: str
