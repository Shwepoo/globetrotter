from fastapi import APIRouter, HTTPException
from app.database import db
from app.models import User
from bson import ObjectId

router = APIRouter()

@router.post("/register")
def register_user(user: User):
    collection = db["users"]
    existing_user = collection.find_one({"username": user.username})
    
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    user_id = collection.insert_one(user.dict()).inserted_id
    return {"message": "User registered successfully", "user_id": str(user_id)}

@router.get("/{id}/score")
def get_user_score(id: str):
    collection = db["users"]

    try:
        user = collection.find_one({"_id": ObjectId(id)})  # Convert id to ObjectId
    except:
        raise HTTPException(status_code=400, detail="Invalid user ID format")

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": str(user["_id"]),  # Convert ObjectId to string
        "username": user["username"],
        "score": user.get("score", 0)
    }
