export const API_BASE_URL = "http://127.0.0.1:8000";

// Helper function to get the Bearer token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('access_token');
};

// Fetch a random destination
export const fetchRandomDestination = async () => {
  const response = await fetch(`${API_BASE_URL}/destination/random`);
  return response.json();
};

// Submit an answer
export const submitAnswer = async (answerData) => {
  const response = await fetch(`${API_BASE_URL}/destination/answer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(answerData),
  });
  return response.json();
};

// Register a new user (updated to handle duplicate user error)
export const registerUser = async (username, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }), // Send both username and password
    });

    if (!response.ok) {
      // If the response is not ok, check for the specific status code
      const errorData = await response.json();
      if (response.status === 400 && errorData.detail === "Username already exists") {
        throw new Error("Username already exists. Please choose a different username.");
      } else {
        throw new Error(errorData.detail || "An unexpected error occurred.");
      }
    }

    // If registration is successful, return the response data
    return await response.json();
  } catch (error) {
    console.error("Error during registration:", error.message);
    throw error;  // Rethrow the error so it can be handled by the calling function
  }
};

// After login, store the token in localStorage or sessionStorage
export const loginUser = async (username, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        username: username,  // Send username as form data
        password: password,  // Send password as form data
      }), 
    });

    if (!response.ok) {
      throw new Error("Invalid username or login failed.");
    }

    const data = await response.json();

    // Save the access token to localStorage (or sessionStorage)
    localStorage.setItem('access_token', data.access_token);
    
    return data;
  } catch (error) {
    console.error("Error logging in:", error);
    return null;
  }
};


// Fetch user score (with Bearer token)
export const fetchUserScore = async (userId) => {
  const token = getAuthToken(); // Get the token from localStorage
  if (!token) {
    throw new Error("No token found, please log in.");
  }

  const response = await fetch(`${API_BASE_URL}/user/${userId}/score`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,  // Attach the Bearer token in the header
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user score.");
  }

  return response.json();
};

// Fetch leaderboard (with Bearer token)
export const fetchLeaderboard = async () => {
  try {
    const token = getAuthToken(); // Get the token from localStorage
    if (!token) {
      throw new Error("No token found, please log in.");
    }

    const response = await fetch(`${API_BASE_URL}/user/leaderboard`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,  // Attach the Bearer token in the header
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch leaderboard.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return [];
  }
};

// Update user score (New: session-based) (with Bearer token)
export const updateUserScore = async (userId, sessionScore) => {
  try {
    const token = getAuthToken(); // Get the token from localStorage
    if (!token) {
      throw new Error("No token found, please log in.");
    }

    const response = await fetch(`${API_BASE_URL}/user/${userId}/score`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,  // Attach Bearer token here
      },
      body: JSON.stringify({ new_score: sessionScore }),  // Send the session score in the body
    });

    if (!response.ok) {
      throw new Error("Failed to update score.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating score:", error);
  }
};

// Generate an invite link (with Bearer token)
// Generate an invite link (with Bearer token)
export const generateInvite = async (userId, score) => {
  const token = getAuthToken(); // Get the token from localStorage
  
  if (!token) {
    throw new Error("No token found, please log in.");
  }

  // Construct the URL with userId and score as query parameters
  const url = `${API_BASE_URL}/invite/?score=${score}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // Attach the Bearer token in the header
      },
    });

    // Check if the response is OK, otherwise throw an error
    if (!response.ok) {
      const errorData = await response.json();  // Get error details
      const errorMessage = errorData.detail || "Failed to generate invite.";
      throw new Error(errorMessage);
    }

    // Return the response JSON
    return await response.json();

  } catch (error) {
    console.error("Error generating invite:", error);
    throw new Error(error.message || "An unknown error occurred.");
  }
};
