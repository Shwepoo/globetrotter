from fastapi import APIRouter, HTTPException, Depends
from app.database import db
from app.models import User,ScoreUpdateRequest
from bson import ObjectId
from passlib.context import CryptContext
from datetime import datetime, timedelta
import jwt
import uuid
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

router = APIRouter()

SECRET_KEY = "your_secret_key"  # Change this in production
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Register user (with password hashing)
@router.post("/register")
def register_user(user: User):
    collection = db["users"]
    existing_user = collection.find_one({"username": user.username})

    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")

    user_data = user.dict()
    user_data["password"] = hash_password(user.password)  # Store hashed password
    user_data["score"] = 0  # Ensure new users start with a score of 0
    user_data["sessions"] = []  # Initialize sessions list

    user_id = collection.insert_one(user_data).inserted_id
    return {"message": "User registered successfully", "user_id": str(user_id)}

# User login
@router.post("/login")
def login_user(form_data: OAuth2PasswordRequestForm = Depends()):
    collection = db["users"]
    user = collection.find_one({"username": form_data.username})

    if not user or not verify_password(form_data.password, user["password"]):
        raise HTTPException(status_code=400, detail="Invalid username or password")

    access_token = create_access_token(data={"sub": str(user["_id"])}, expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    return {"access_token": access_token, "token_type": "bearer", "user_id": str(user["_id"])}

# Get current user
@router.get("/me")
def get_me(user_id: str = Depends(get_current_user)):
    collection = db["users"]
    user = collection.find_one({"_id": ObjectId(user_id)})

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {"id": str(user["_id"]), "username": user["username"]}

# Get a single user's score
@router.get("/{id}/score")
def get_user_score(id: str):
    collection = db["users"]

    try:
        user = collection.find_one({"_id": ObjectId(id)})
        best_score = max((session["score"] for session in user.get("sessions", [])), default=0)
    except:
        raise HTTPException(status_code=400, detail="Invalid user ID format")

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": str(user["_id"]),
        "username": user["username"],
        "score": best_score
    }

# **UPDATED: Store scores as session-based**
@router.put("/{id}/score")
def update_user_score(id: str, score_request: ScoreUpdateRequest):
    new_score = score_request.new_score  # Get the new_score from the body
    collection = db["users"]

    try:
        user = collection.find_one({"_id": ObjectId(id)})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        session_data = {
            "session_id": str(uuid.uuid4()),
            "score": new_score,
            "timestamp": datetime.utcnow()
        }

        # Append session to user's score history
        collection.update_one(
            {"_id": ObjectId(id)},
            {"$push": {"sessions": session_data}}
        )

        return {"message": "Score updated successfully", "session": session_data}

    except:
        raise HTTPException(status_code=400, detail="Invalid user ID format")

@router.get("/leaderboard")
def get_leaderboard():
    collection = db["users"]

    users = collection.find({}, {"username": 1, "sessions": 1})
    leaderboard = []

    for user in users:
        # Extract the best score from each user's sessions
        best_score = max((session["score"] for session in user.get("sessions", [])), default=0)
        leaderboard.append({"username": user["username"], "best_score": best_score})

    if not leaderboard:
        raise HTTPException(status_code=404, detail="No users found")

    # Sort leaderboard based on the best score in descending order
    leaderboard.sort(key=lambda x: x["best_score"], reverse=True)
    return {"leaderboard": leaderboard}


