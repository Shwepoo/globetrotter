import { useEffect, useState } from "react";
import { fetchRandomDestination, submitAnswer } from "../utils/api";

const Game = () => {
  const [question, setQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchQuestion();
  }, []);

  const fetchQuestion = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRandomDestination();
      console.log("Fetched destination:", data); // Debugging log
      setQuestion(data);
      setSelectedAnswer(""); // Reset selected answer
      setFeedback(null); // Clear previous feedback
    } catch (err) {
      console.error("Error fetching destination:", err);
      setError("Failed to load question. Try again!");
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!selectedAnswer) return;
    try {
      const res = await submitAnswer({ city: question.city, answer: selectedAnswer });
      setFeedback(res.message);
      setTimeout(() => {
        fetchQuestion(); // Load new question after 2 seconds
      }, 2000);
    } catch (err) {
      console.error("Error submitting answer:", err);
      setFeedback("Failed to submit answer. Try again!");
    }
  };

  if (loading) return <p className="text-center text-lg">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!question) return <p className="text-center">No questions available.</p>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg text-center">
      <h2 className="text-2xl font-bold text-blue-600">Guess the Destination!</h2>
      
      {/* Clues */}
      <div className="mt-4">
        <p className="text-lg font-semibold text-gray-700">Clues:</p>
        <p className="text-gray-600">{question.clues?.join(" | ")}</p>
      </div>

      {/* Fun Fact */}
      <div className="mt-4">
        <p className="text-lg font-semibold text-gray-700">Fun Fact:</p>
        <p className="text-gray-600">{question.fun_fact?.join(" | ")}</p>
      </div>

      {/* Trivia Options */}
      <div className="mt-4">
        <p className="text-lg font-semibold text-gray-700">Choose Your Answer:</p>
        {question.trivia?.map((option, index) => (
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

      {/* Submit Button */}
      <button 
        onClick={handleSubmit} 
        className="bg-green-500 text-white p-3 rounded-lg mt-4 w-full hover:bg-green-600 transition"
      >
        Submit Answer
      </button>

      {/* Feedback Message */}
      {feedback && (
        <p className={`mt-4 p-2 text-lg font-semibold ${feedback.includes("Correct") ? "text-green-600" : "text-red-500"}`}>
          {feedback}
        </p>
      )}
    </div>
  );
};

export default Game;
