import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <h2 className="logo">⚡ Golf Impact</h2>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/charities">Charities</Link>
        <Link to="/how-it-works">How It Works</Link>
        <button onClick={() => navigate("/login")}>
          Login
        </button>
      </div>
    </nav>
  );
}