import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Game from "./pages/Game";
import Scoreboard from "./pages/Scoreboard";
import Navbar from "./components/Navbar";
import Auth from "./components/auth";
import "./styles/global.css";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:8000/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setUser({ id: data.id, username: data.username }))
        .catch(() => {
          localStorage.removeItem("token");
          setUser(null);
        });
    }
  }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Navbar user={user} setUser={setUser} />
        <main className="flex-grow flex justify-center items-center">
          <div className="container mx-auto p-6 text-center">
            <Routes>
              <Route path="/" element={<Home />} />
              
              {/* Protected Routes */}
              <Route path="/game" element={user ? <Game userId={user.id} /> : <Navigate to="/auth" />} />

              {/* No protection on these routes */}
              <Route path="/scoreboard" element={<Scoreboard />} />

              {/* Auth Route */}
              <Route path="/auth" element={<Auth setUser={setUser} />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
};

export default App;
