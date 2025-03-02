from fastapi import APIRouter, HTTPException
from app.database import db
from app.models import AnswerRequest
import random

router = APIRouter()

@router.get("/random")
def get_random_destination():
    collection = db["destinations"]
    count = collection.count_documents({})
    if count == 0:
        raise HTTPException(status_code=404, detail="No destinations found")
    
    random_index = random.randint(0, count - 1)
    destination = collection.find().skip(random_index).limit(1)[0]
    return {
        "city": destination["city"],
        "country": destination["country"],
        "clues": destination["clues"],
        "choices": [destination["city"], "Random1", "Random2", "Random3"]  # Add wrong options
    }

@router.post("/answer")
def check_answer(answer: AnswerRequest):
    collection = db["destinations"]
    correct = collection.find_one({"city": answer.city})

    if not correct:
        raise HTTPException(status_code=404, detail="City not found")

    is_correct = answer.answer.lower() == correct["city"].lower()
    return {"correct": is_correct, "message": "Correct!" if is_correct else "Wrong answer!"}
