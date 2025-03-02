import { registerUser, loginUser } from "../utils/api";
import { useState } from "react";

const Auth = ({ user, setUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

// Handle Register
const handleRegister = async () => {
  try {
    const data = await registerUser(username, password);
    setMessage(data.message); // Show success message
  } catch (error) {
    setMessage(error.message); // Show error message
  }
};

  // Handle Login
const handleLogin = async () => {
  try {
    const data = await loginUser(username, password);
    
    // Check if data is null or doesn't contain the necessary properties
    if (data && data.access_token) {
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify({ id: data.user_id, username }));
      setUser({ id: data.user_id, username });
      setMessage("Login successful!");
    } else {
      setMessage("Login failed: Invalid credentials or no response.");
    }
  } catch (error) {
    setMessage(`Error: ${error.message}`); // Show error message
  }
};


  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <div>
      {user ? (
        // Show Logout if logged in
        <div>
          <p>Welcome, {user.username}!</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        // Show Register & Login if not logged in
        <div>
          <h2>Register / Login</h2>
          <input
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleRegister}>Register</button>
          <button onClick={handleLogin}>Login</button>
          {message && <p>{message}</p>} {/* Display message if available */}
        </div>
      )}
    </div>
  );
};

export default Auth;
