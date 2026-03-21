import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [scores, setScores] = useState([]);
  const [winners, setWinners] = useState([]);
  const [drawResult, setDrawResult] = useState(null);
  const [drawHistory, setDrawHistory] = useState([]);

  // 🔹 Fetch Users
  const fetchUsers = async () => {
    const { data } = await supabase
      .from("users")
      .select(`
        id,
        email,
        subscriptions(status, renewal_date),
        user_charity(percentage, charities(name))
      `);

    setUsers(data || []);
  };

  // 🔹 Fetch Scores
  const fetchScores = async () => {
    const { data } = await supabase
      .from("scores")
      .select("*")
      .order("created_at", { ascending: false });

    setScores(data || []);
  };

  // 🔹 Fetch Winners
  const fetchWinners = async () => {
    const { data } = await supabase
      .from("winners")
      .select("*")
      .order("created_at", { ascending: false });

    setWinners(data || []);
  };

  // 🔹 Fetch Draw History
  const fetchDrawHistory = async () => {
    const { data } = await supabase
      .from("draws")
      .select("*")
      .order("created_at", { ascending: false });

    setDrawHistory(data || []);
  };

  const fetchData = async () => {
    await fetchUsers();
    await fetchScores();
    await fetchWinners();
    await fetchDrawHistory();
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🎯 Run Draw
  const runDraw = async () => {
    const { data: allScores } = await supabase.from("scores").select("*");
    const { data: users } = await supabase.from("users").select("*");

    const numbers = [];
    while (numbers.length < 5) {
      const n = Math.floor(Math.random() * 45) + 1;
      if (!numbers.includes(n)) numbers.push(n);
    }

    // 💰 Prize Logic
    const totalPool = users.length * 100;
    const charityAmount = Math.floor(totalPool * 0.1);
    const prizePool = totalPool - charityAmount;

    const results = {};
    const winnersList = [];

    allScores.forEach((s) => {
      if (!results[s.user_id]) results[s.user_id] = 0;
      if (numbers.includes(s.score)) results[s.user_id]++;
    });

    Object.entries(results).forEach(([userId, matches]) => {
      if (matches >= 2) {
        winnersList.push({ user_id: userId, matches });
      }
    });

    let prizePerWinner = 0;
    if (winnersList.length > 0) {
      prizePerWinner = Math.floor(prizePool / winnersList.length);
    }

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
      totalPool,
      charityAmount,
      prizePool,
      winners: winnersList,
      prizePerWinner,
    });

    fetchData();
  };

  // 💰 Mark Paid
  const markPaid = async (id) => {
    await supabase
      .from("winners")
      .update({ payout_status: "paid" })
      .eq("id", id);

    fetchWinners();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Dashboard</h2>

      {/* 📊 Analytics */}
      <div className="card">
        <h3>Analytics</h3>
        <p>Total Users: {users.length}</p>
        <p>Total Scores: {scores.length}</p>
        <p>Total Winners: {winners.length}</p>
      </div>

      {/* 👥 Users */}
      <div className="card">
        <h3>User Management</h3>
        {users.map((u) => (
          <div key={u.id}>
            <strong>{u.email}</strong>
            <p>Subscription: {u.subscriptions?.[0]?.status || "inactive"}</p>
            <p>Charity: {u.user_charity?.[0]?.charities?.name || "None"}</p>
          </div>
        ))}
      </div>

      {/* 🎯 Draw */}
      <div className="card">
        <h3>Draw Management</h3>
        <button onClick={runDraw}>Run Draw</button>

        {drawResult && (
          <div>
            <p>Numbers: {drawResult.numbers.join(", ")}</p>
            <p>Total Pool: ₹{drawResult.totalPool}</p>
            <p>Charity: ₹{drawResult.charityAmount}</p>
            <p>Prize Pool: ₹{drawResult.prizePool}</p>

            {drawResult.winners.length > 0 && (
              <p>Prize per Winner: ₹{drawResult.prizePerWinner}</p>
            )}
          </div>
        )}
      </div>

      {/* 🏆 Winners */}
      <div className="card">
        <h3>Winners</h3>
        {winners.map((w) => (
          <div key={w.id}>
            <p>User: {w.user_id}</p>
            <p>Matches: {w.matches}</p>
            <p>Status: {w.payout_status}</p>
            <p>Prize: ₹{w.prize_amount}</p>

            {w.payout_status !== "paid" && (
              <button onClick={() => markPaid(w.id)}>
                Mark Paid
              </button>
            )}
          </div>
        ))}
      </div>

      {/* 📜 Draw History */}
      <div className="card">
        <h3>Draw History</h3>
        {drawHistory.map((d) => (
          <div key={d.id}>
            <p>Numbers: {d.numbers?.join(", ")}</p>
            <p>Date: {new Date(d.created_at).toLocaleString()}</p>
            <p>Pool: ₹{d.prize_pool}</p>
          </div>
        ))}
      </div>

      {/* 📊 All Scores */}
      <div className="card">
        <h3>All Scores</h3>
        {scores.map((s) => (
          <div key={s.id}>
            User: {s.user_id} → {s.score}
          </div>
        ))}
      </div>
    </div>
  );
}