import { useState, useEffect } from "react";
import { fetchUserScore, fetchLeaderboard } from "../utils/api";

const Scoreboard = () => {
  const [userId, setUserId] = useState("");
  const [userScore, setUserScore] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const data = await fetchLeaderboard();
      setLeaderboard(data.leaderboard);
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
      setError("Failed to load leaderboard");
    }
  };

  const handleFetchUserScore = async () => {
    try {
      if (!userId) return;
      const data = await fetchUserScore(userId);
      if (data.detail) throw new Error(data.detail);
      setUserScore(data.score);
      setError("");
    } catch (err) {
      setError(err.message);
      setUserScore(null);
    }
  };

  return (
    <div className="p-10 text-center bg-gray-100 min-h-screen flex flex-col items-center">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">Scoreboard</h2>
      
      {/* User Score Section */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Enter User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="p-2 border rounded-lg w-64 text-lg mb-2"
        />
        <button
          onClick={handleFetchUserScore}
          className="bg-blue-500 text-white p-3 rounded-lg text-lg hover:bg-blue-600"
        >
          Get Score
        </button>
        {userScore !== null && <p className="mt-4 text-lg font-bold">Your Score: {userScore}</p>}
        {error && <p className="mt-4 text-lg text-red-600">{error}</p>}
      </div>

      {/* Leaderboard Section */}
      <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Leaderboard</h3>
        {leaderboard.length > 0 ? (
          <ul className="text-left">
            {leaderboard.map((player, index) => (
              <li
                key={index}
                className="p-2 border-b border-gray-300 flex justify-between"
              >
                <span className="font-semibold">{player.username}</span>
                <span className="text-blue-600 font-bold">{player.best_score}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No leaderboard data available</p>
        )}
      </div>
    </div>
  );
};

export default Scoreboard;
