# FastAPI Backend for Globetrotter Game

## Overview
This is the backend for the **Globetrotter Game**, built using FastAPI. It handles user authentication, fetching random destinations for the game, validating answers, tracking scores, and generating invite links.

## Features
- User Authentication (Register, Login, Token-based Auth)
- Random Destination Generation
- Answer Validation
- User Score Management (Session-based score tracking)
- Leaderboard System
- Invite Link Generation

## Technologies Used
- **FastAPI** - Web framework
- **MongoDB** - Database for storing users and game data
- **JWT** - Authentication mechanism
- **UUID** - Unique session and invite link generation
- **Passlib** - Password hashing

## Installation

### Prerequisites
- Python 3.8+
- MongoDB (running locally or cloud-based)

### Setup Instructions
1. **Clone the Repository:**
   ```sh
   git clone https://github.com/your-repo/globetrotter-backend.git
   cd globetrotter-backend
   ```
2. **Create a Virtual Environment:**
   ```sh
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```
3. **Install Dependencies:**
   ```sh
   pip install -r requirements.txt
   ```
4. **Set Up Environment Variables:**
   Create a `.env` file and add the following:
   ```env
   SECRET_KEY=your_secret_key
   MONGO_URI=mongodb://localhost:27017
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ```
5. **Run the Server:**
   ```sh
   uvicorn main:app --reload
   ```

## API Endpoints

### Authentication
| Method | Endpoint       | Description |
|--------|--------------|-------------|
| `POST` | `/register`  | Register a new user |
| `POST` | `/login`     | User login and token generation |
| `GET`  | `/me`        | Get current logged-in user info |

### Game Routes
| Method | Endpoint        | Description |
|--------|---------------|-------------|
| `GET`  | `/random`     | Get a random destination |
| `POST` | `/answer`     | Submit an answer for validation |

### User Scores
| Method | Endpoint          | Description |
|--------|-----------------|-------------|
| `GET`  | `/{id}/score`   | Get a user's best score |
| `PUT`  | `/{id}/score`   | Update user score and session |
| `GET`  | `/leaderboard`  | Get the leaderboard ranking |

### Invite System
| Method | Endpoint       | Description |
|--------|--------------|-------------|
| `POST` | `/invite?score=100` | Generate an invite link with score |

## Testing with Postman
1. **Register a User:**
   - Method: `POST`
   - URL: `http://127.0.0.1:8000/register`
   - Body (JSON):
     ```json
     {
       "username": "testuser",
       "password": "testpassword"
     }
     ```

2. **Login and Get Token:**
   - Method: `POST`
   - URL: `http://127.0.0.1:8000/login`
   - Body (form-data):
     - `username`: `testuser`
     - `password`: `testpassword`
   - Response:
     ```json
     {
       "access_token": "your_jwt_token",
       "token_type": "bearer",
       "user_id": "user_id"
     }
     ```

3. **Fetch a Random Destination:**
   - Method: `GET`
   - URL: `http://127.0.0.1:8000/random`

4. **Submit an Answer:**
   - Method: `POST`
   - URL: `http://127.0.0.1:8000/answer`
   - Body (JSON):
     ```json
     {
       "city": "Paris",
       "answer": "Paris"
     }
     ```

5. **Update Score:**
   - Method: `PUT`
   - URL: `http://127.0.0.1:8000/{id}/score`
   - Headers:
     - `Authorization`: `Bearer your_jwt_token`
   - Body (JSON):
     ```json
     {
       "new_score": 100
     }
     ```

6. **Generate an Invite Link:**
   - Method: `POST`
   - URL: `http://127.0.0.1:8000/invite?score=100`

## Contributing
1. Fork the repository
2. Create a new feature branch
3. Make your changes and test them
4. Submit a pull request

## License
This project is licensed under the MIT License.

