/*
This page displays the top players and their scores.
    Fetches user scores from the backend.
    Shows a ranked leaderboard with usernames and scores.
    Updates automatically when a new score is recorded.
*/
import { useState } from "react";
import { fetchUserScore } from "../utils/api";

const Scoreboard = () => {
  const [userId, setUserId] = useState("");
  const [score, setScore] = useState(null);
  const [error, setError] = useState("");

  const handleFetchScore = async () => {
    try {
      const data = await fetchUserScore(userId);
      if (data.detail) throw new Error(data.detail);
      setScore(data.score);
      setError("");
    } catch (err) {
      setError(err.message);
      setScore(null);
    }
  };

  return (
    <div className="p-10 text-center bg-gray-100 min-h-screen flex flex-col items-center">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">Scoreboard</h2>
      <input
        type="text"
        placeholder="Enter User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        className="p-2 border rounded-lg w-64 text-lg mb-2"
      />
      <button
        onClick={handleFetchScore}
        className="bg-blue-500 text-white p-3 rounded-lg text-lg hover:bg-blue-600"
      >
        Get Score
      </button>
      {score !== null && <p className="mt-4 text-lg font-bold">Your Score: {score}</p>}
      {error && <p className="mt-4 text-lg text-red-600">{error}</p>}
    </div>
  );
};

export default Scoreboard;
