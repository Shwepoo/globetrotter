// utils/api.js
export const API_BASE_URL = "http://127.0.0.1:8000";

export const fetchRandomDestination = async () => {
  const response = await fetch(`${API_BASE_URL}/destination/random`);
  return response.json();
};

export const submitAnswer = async (answerData) => {
  const response = await fetch(`${API_BASE_URL}/destination/answer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(answerData),
  });
  return response.json();
};

export const registerUser = async (username) => {
  const response = await fetch(`${API_BASE_URL}/user/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  });
  return response.json();
};

export const fetchUserScore = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/user/${userId}/score`);
  return response.json();
};

export const generateInvite = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/invite`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
  return response.json();
};
