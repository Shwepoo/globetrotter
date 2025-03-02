from pydantic import BaseModel
from typing import List, Optional
from bson import ObjectId
from datetime import datetime

# Pydantic model for a destination
class Destination(BaseModel):
    city: str
    country: str
    clues: List[str]
    fun_fact: Optional[List[str]] = None  # Mark as Optional if it might be missing
    trivia: Optional[List[str]] = None    # Same as above

class Session(BaseModel):
    session_id: str
    score: int
    timestamp: datetime

# Pydantic model for a user
class User(BaseModel):
    username: str
    password:str
    sessions: List[Session] = []

    class Config:
        from_attributes = True  # Allows Pydantic to work with MongoDB documents

# Model for validating user's answer request
class AnswerRequest(BaseModel):
    city: str
    answer: str


class ScoreUpdateRequest(BaseModel):
    new_score: int
