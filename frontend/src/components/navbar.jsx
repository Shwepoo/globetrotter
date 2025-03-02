import { Link } from "react-router-dom";

const Navbar = ({ user, setUser }) => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Globetrotter</h1>
        <div className="flex space-x-8">
          <Link to="/" className="hover:text-gray-300 transition text-lg">Home</Link>
          <Link to="/game" className="hover:text-gray-300 transition text-lg">Game</Link>
          <Link to="/scoreboard" className="hover:text-gray-300 transition text-lg">Scoreboard</Link>
          <Link to="/invite" className="hover:text-gray-300 transition text-lg">Invite</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
