import json
import os
from app.database import db

# Get the absolute path to `destinations.json`
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # Points to `backend/app/`
DATA_FILE = os.path.join(BASE_DIR, "data", "destinations.json")

# Load the JSON file
with open(DATA_FILE, "r", encoding="utf-8") as file:
    destinations = json.load(file)

# Insert data into MongoDB
collection = db["destinations"]  # Create or access the 'destinations' collection
collection.insert_many(destinations)

print("Data successfully loaded into MongoDB!")
