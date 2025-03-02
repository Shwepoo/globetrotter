import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
      <h1 className="text-2xl font-bold">Globetrotter</h1>
      <div className="space-x-6">
        <Link to="/" className="hover:underline text-lg">Home</Link>
        <Link to="/game" className="hover:underline text-lg">Game</Link>
        <Link to="/scoreboard" className="hover:underline text-lg">Scoreboard</Link>
        <Link to="/invite" className="hover:underline text-lg">Invite</Link>
      </div>
    </nav>
  );
};

export default Navbar;
