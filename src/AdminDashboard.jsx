import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import "./theme.css";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [scores, setScores] = useState([]);
  const [draws, setDraws] = useState([]);
  const [drawResult, setDrawResult] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: usersData } = await supabase.from("users").select("*");
    const { data: scoresData } = await supabase.from("scores").select("*");
    const { data: drawsData } = await supabase.from("draws").select("*");

    setUsers(usersData || []);
    setScores(scoresData || []);
    setDraws(drawsData || []);
  };

  // 🎯 RUN DRAW (FIXED)
  const runDraw = async () => {
    const { data: allScores } = await supabase.from("scores").select("*");
    const { data: allUsers } = await supabase.from("users").select("*");

    // 🎯 generate numbers
    const numbers = [];
    while (numbers.length < 5) {
      const n = Math.floor(Math.random() * 45) + 1;
      if (!numbers.includes(n)) numbers.push(n);
    }

    // 💰 Prize Logic
    const totalPool = (allUsers?.length || 0) * 100;
    const charityAmount = Math.floor(totalPool * 0.1);
    const prizePool = totalPool - charityAmount;

    // 🧠 Match logic
    const results = {};
    allScores.forEach((s) => {
      if (!results[s.user_id]) results[s.user_id] = 0;
      if (numbers.includes(s.score)) {
        results[s.user_id]++;
      }
    });

    // 🏆 Winners
    const winnersList = Object.entries(results)
      .filter(([_, matches]) => matches >= 2)
      .map(([user_id, matches]) => ({
        user_id,
        matches,
      }));

    const prizePerWinner =
      winnersList.length > 0
        ? Math.floor(prizePool / winnersList.length)
        : 0;

    // 💾 Store draw
    const { data: drawData } = await supabase
      .from("draws")
      .insert([
        {
          numbers,
          results,
          total_pool: totalPool,
          charity_amount: charityAmount,
          prize_pool: prizePool,
        },
      ])
      .select()
      .single();

    // 💾 Store winners
    if (winnersList.length > 0) {
      await supabase.from("winners").insert(
        winnersList.map((w) => ({
          ...w,
          draw_id: drawData.id,
          payout_status: "pending",
          prize_amount: prizePerWinner,
        }))
      );
    }

    setDrawResult({
      numbers,
      prizePool,
    });

    fetchData();
  };

  return (
    <div className="dashboard">

      {/* ANALYTICS */}
      <div className="grid-4">
        <div className="card glow">
          <h3>Total Users</h3>
          <h1>{users.length}</h1>
        </div>

        <div className="card glow">
          <h3>Total Scores</h3>
          <h1>{scores.length}</h1>
        </div>

        <div className="card glow">
          <h3>Total Draws</h3>
          <h1>{draws.length}</h1>
        </div>

        <div className="card glow">
          <h3>Active Today</h3>
          <h1>--</h1>
        </div>
      </div>

      {/* USERS + SCORES */}
      <div className="grid-2">
        <div className="card">
          <h3>Users</h3>
          {users.map((u) => (
            <div key={u.id} className="list-item">
              {u.email}
            </div>
          ))}
        </div>

        <div className="card">
          <h3>Scores</h3>
          {scores.map((s) => (
            <div key={s.id} className="list-item">
              {s.user_id} → {s.score}
            </div>
          ))}
        </div>
      </div>

      {/* RUN DRAW */}
      <div className="card highlight">
        <h3>Run Draw</h3>

        <button onClick={runDraw}>
          🎯 Run Draw
        </button>

        {drawResult && (
          <div style={{ marginTop: "10px" }}>
            <p>Numbers: {drawResult.numbers.join(", ")}</p>
            <p>Prize Pool: ₹{drawResult.prizePool}</p>
          </div>
        )}
      </div>

      {/* DRAW HISTORY */}
      <div className="card">
        <h3>Draw History</h3>
        {draws.map((d) => (
          <div key={d.id} className="list-item">
            🎯 {d.numbers?.join(", ")}
          </div>
        ))}
      </div>

    </div>
  );
}