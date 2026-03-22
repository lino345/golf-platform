import Navbar from "./Navbar";

export default function HowItWorks() {
  return (
    <>
      <Navbar />

      <div className="page">
        <h1>⚡ How Golf Impact Works</h1>

        <div className="steps">
          <div className="step-card">
            <h2>🏌️ 1. Enter Scores</h2>
            <p>Track your latest golf scores.</p>
          </div>

          <div className="step-card">
            <h2>🎯 2. Join Draw</h2>
            <p>Participate in monthly draws.</p>
          </div>

          <div className="step-card">
            <h2>🏆 3. Win + Give Back</h2>
            <p>Winners earn rewards while supporting charities.</p>
          </div>
        </div>
      </div>
    </>
  );
}