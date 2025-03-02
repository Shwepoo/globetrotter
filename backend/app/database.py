from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# MongoDB Connection String
MONGO_URI = os.getenv("MONGO_URI")  # Store this in .env file
DB_NAME = "globetrotter"

# Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client[DB_NAME]
