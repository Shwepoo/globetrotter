import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Game from "./pages/Game";
import Scoreboard from "./pages/Scoreboard";
import Invite from "./pages/Invite";
import Navbar from "./components/Navbar";
import "./styles/global.css"; // Import global styles

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/game" element={<Game />} />
            <Route path="/scoreboard" element={<Scoreboard />} />
            <Route path="/invite" element={<Invite />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
