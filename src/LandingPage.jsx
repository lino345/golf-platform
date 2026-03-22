import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing">

      {/* 🔝 NAVBAR */}
      <div className="landing-nav">
        <div className="landing-logo">⚡ Golf Impact</div>

        <button
          className="landing-login"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      </div>

      {/* 🌟 HERO */}
      <h1>⚡ Golf Impact</h1>
      <p>Play. Win. Give Back.</p>

      <button onClick={() => navigate("/dashboard")}>
        Enter Platform
      </button>

    </div>
  );
}