import { useState, useEffect } from "react";
import { request } from "./api";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [scores, setScores] = useState({});
  const [drawResult, setDrawResult] = useState(null);

  const token = localStorage.getItem("token");

  // fake fetch (since no admin API yet)
  useEffect(() => {
    // simulate data
    setUsers([
      { id: "1", email: "user1@test.com" },
      { id: "2", email: "user2@test.com" },
    ]);

    setScores({
      "1": [10, 20, 30],
      "2": [15, 25],
    });
  }, []);

  const runDraw = async () => {
    try {
      const res = await request("/draw/run", "POST", {}, token);
      setDrawResult(res);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>

      {/* Analytics */}
      <div className="card">
        <h3>Analytics</h3>
        <p>Total Users: {users.length}</p>
        <p>Total Scores: {Object.values(scores).flat().length}</p>
      </div>

      {/* Users */}
      <div className="card">
        <h3>User Management</h3>
        {users.map((u) => (
          <div key={u.id} style={{ marginBottom: "10px" }}>
            <strong>{u.email}</strong>
            <p>Scores: {scores[u.id]?.join(", ") || "None"}</p>
          </div>
        ))}
      </div>

      {/* Draw Control */}
      <div className="card">
        <h3>Draw Management</h3>
        <button onClick={runDraw}>Run Draw</button>

        {drawResult && (
          <div>
            <p>Draw: {drawResult.draw.join(", ")}</p>
            {drawResult.results.map((r, i) => (
              <p key={i}>
                User {r.userId}: {r.matches} matches
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Charity */}
      <div className="card">
        <h3>Charity Management</h3>
        <p>Education Fund</p>
        <p>Health Care</p>
        <button>Add Charity</button>
      </div>

      {/* Winners */}
      <div className="card">
        <h3>Winners</h3>
        <p>No winners yet</p>
      </div>
    </div>
  );
}