from fastapi import FastAPI
from app.routes import destination, invite,user
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://globetrottershwe.netlify.app"],  # Allow from local and hosted origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

app.include_router(destination.router, prefix="/destination", tags=["Destination"])
app.include_router(user.router, prefix="/user", tags=["User"])
app.include_router(invite.router, prefix="/invite", tags=["Invite"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Globetrotter API!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
