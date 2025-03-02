from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_register_user():
    response = client.post("/user/register", json={"username": "testuser"})
    assert response.status_code == 200
    assert "user_id" in response.json()

def test_get_random_destination():
    response = client.get("/destination/random")
    assert response.status_code == 200
    assert "city" in response.json()

def test_submit_answer():
    response = client.post("/destination/answer", json={"city": "Paris", "answer": "Eiffel Tower"})
    assert response.status_code == 200
