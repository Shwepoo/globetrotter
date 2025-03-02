import { useEffect, useState } from "react";
import { fetchRandomDestination, submitAnswer, updateUserScore, generateInvite } from "../utils/api"; // Import generateInvite

const Game = ({ userId }) => {
  const [question, setQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timer, setTimer] = useState(60);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [inviteLink, setInviteLink] = useState("");  // State to store the invite link
  const [inviteError, setInviteError] = useState(""); // State to store invite errors

  useEffect(() => {
    fetchQuestion();
    startTimer();
  }, []);

  useEffect(() => {
    if (gameOver) {
      console.log("Game Over, calling saveScore...");
      saveScore(); // Ensure saveScore runs when gameOver state is true
    }
  }, [gameOver]);

  const fetchQuestion = async () => {
    if (gameOver) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRandomDestination();
      if (!data || !data.city || !data.choices) {
        throw new Error("Invalid data received");
      }
      setQuestion(data);
      setSelectedAnswer("");
      setFeedback(null);
    } catch (err) {
      setError("Failed to load question. Try again!");
    }
    setLoading(false);
  };

  const startTimer = () => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setGameOver(true);
          setTimer(0); // Reset timer to 0
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmit = async () => {
    if (!selectedAnswer || gameOver) return;
    try {
      const res = await submitAnswer({ city: question.city, answer: selectedAnswer });
      setFeedback(res.message);
      if (res.message.includes("Correct")) {
        setScore((prev) => prev + 10); // Increase score for correct answers
      }
      setTimeout(fetchQuestion, 1000);
    } catch (err) {
      setFeedback("Failed to submit answer. Try again!");
    }
  };

  const saveScore = async () => {
    if (!userId) {
      console.log("User ID is missing, cannot save score.");
      return;
    }
    try {
      console.log(`Saving final score ${score} for user ${userId}`);
      const res = await updateUserScore(userId, score);
      console.log("Score updated successfully:", res);
    } catch (error) {
      console.error("Failed to update score:", error);
    }
  };

  // Generate Invite link
  const handleGenerateInvite = async () => {
    if (!userId || !score) {
      setInviteError("Missing User ID or Score.");
      return;
    }
    setInviteError("");
    try {
      const data = await generateInvite(userId,score);  // Call generateInvite with userId
      if (data.error) throw new Error(data.error);
      setInviteLink(`${window.location.origin}/register?invite=${data.token}`);
    } catch (err) {
      setInviteError("Failed to generate invite link. Try again!");
    }
  };

  // Copy Invite link to clipboard
  const handleCopyLink = () => {
    if (inviteLink) {
      navigator.clipboard.writeText(inviteLink);
      alert("Invite link copied to clipboard!");
    }
  };

  if (loading) return <p className="text-center text-lg">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg text-center">
      <h2 className="text-2xl font-bold text-blue-600">Guess the Destination!</h2>
      <p className="text-lg font-semibold text-red-500">Time Left: {timer}s</p>
      <p className="text-lg font-semibold text-green-600">Score: {score}</p>

      <div className="mt-4">
        <p className="text-lg font-semibold text-gray-700">Clues:</p>
        {question?.clues?.map((clue, index) => (
          <p key={index} className="text-gray-600">{clue}</p>
        ))}
      </div>

      <div className="mt-4">
        <p className="text-lg font-semibold text-gray-700">Choose Your Answer:</p>
        {question?.choices?.map((option, index) => (
          <button
            key={index}
            onClick={() => setSelectedAnswer(option)}
            className={`block w-full mt-2 p-3 rounded-lg border transition ${
              selectedAnswer === option ? "bg-blue-500 text-white border-blue-700" : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={gameOver}
        className="bg-green-500 text-white p-3 rounded-lg mt-4 w-full hover:bg-green-600 transition"
      >
        Submit Answer
      </button>

      {feedback && (
        <p className={`mt-4 p-2 text-lg font-semibold ${feedback.includes("Correct") ? "text-green-600" : "text-red-500"}`}>
          {feedback}
        </p>
      )}

      {/* Show Invite Link after Game Over */}
      {gameOver && (
        <div>
          <p className="text-xl font-bold text-red-600 mt-4">Game Over! Your Score: {score}</p>
          <button
            onClick={handleGenerateInvite}
            className="bg-blue-500 text-white p-3 rounded-lg mt-4 w-full hover:bg-blue-600 transition"
          >
            Generate Invite Link
          </button>

          {inviteLink && (
            <div className="mt-4 p-2 bg-white border rounded-lg w-80">
              <p className="text-gray-700 break-all">{inviteLink}</p>
              <button
                onClick={handleCopyLink}
                className="mt-2 bg-green-500 text-white p-2 rounded-lg text-sm hover:bg-green-600"
              >
                Copy Link
              </button>
            </div>
          )}

          {inviteError && <p className="mt-4 text-lg text-red-600">{inviteError}</p>}
        </div>
      )}
    </div>
  );
};

export default Game;
