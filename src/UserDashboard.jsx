import { useState, useEffect } from "react";
import { supabase } from "./supabase";

export default function UserDashboard() {
  const [score, setScore] = useState("");
  const [scores, setScores] = useState([]);
  const [drawResult, setDrawResult] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [charities, setCharities] = useState([]);
  const [selectedCharity, setSelectedCharity] = useState("");

  const getUser = async () => {
    const { data } = await supabase.auth.getUser();
    return data.user;
  };

  // 🔹 Fetch scores
  const fetchScores = async () => {
    const user = await getUser();

    const { data } = await supabase
      .from("scores")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5);

    setScores(data || []);
  };

  // 🔹 Add score
  const addScore = async () => {
    const user = await getUser();

    await supabase.from("scores").insert([
      {
        user_id: user.id,
        score: Number(score),
      },
    ]);

    setScore("");
    fetchScores();
  };

  // 🔹 Fetch subscription
  const fetchSubscription = async () => {
    const user = await getUser();

    const { data } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .single();

    setSubscription(data);
  };

  // 🔹 Activate subscription
  const activateSubscription = async () => {
    const user = await getUser();

    const renewal = new Date();
    renewal.setMonth(renewal.getMonth() + 1);

    await supabase.from("subscriptions").insert([
      {
        user_id: user.id,
        status: "active",
        renewal_date: renewal,
      },
    ]);

    fetchSubscription();
  };

  // 🔹 Fetch charities
  const fetchCharities = async () => {
    const { data } = await supabase.from("charities").select("*");
    setCharities(data || []);
  };

  useEffect(() => {
    fetchScores();
    fetchSubscription();
    fetchCharities();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>User Dashboard</h2>

      {/* Subscription */}
      <div>
        <h3>Subscription</h3>
        {subscription ? (
          <>
            <p>Status: {subscription.status}</p>
            <p>Renewal: {subscription.renewal_date}</p>
          </>
        ) : (
          <button onClick={activateSubscription}>
            Activate Subscription
          </button>
        )}
      </div>

      {/* Charity */}
      <div>
        <h3>Charity</h3>
        <select onChange={(e) => setSelectedCharity(e.target.value)}>
          <option>Select Charity</option>
          {charities.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <p>Contribution: 10%</p>
      </div>

      {/* Score */}
      <div>
        <h3>Add Score</h3>
        <input
          value={score}
          onChange={(e) => setScore(e.target.value)}
        />
        <button onClick={addScore}>Add</button>
      </div>

      {/* Scores */}
      <div>
        <h3>Last 5 Scores</h3>
        <ul>
          {scores.map((s) => (
            <li key={s.id}>{s.score}</li>
          ))}
        </ul>
      </div>

      {/* Participation */}
      <div>
        <h3>Participation</h3>
        <p>Draws Entered: {scores.length}</p>
        <p>Next Draw: Sunday 6PM</p>
      </div>
    </div>
  );
}