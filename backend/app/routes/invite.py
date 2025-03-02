from fastapi import APIRouter
import uuid

router = APIRouter()

@router.post("/")
def generate_invite_link(score: int):
    invite_code = str(uuid.uuid4())
    return {"invite_link": f"https://globetrotter.com/invite/{invite_code}", "score": score}
