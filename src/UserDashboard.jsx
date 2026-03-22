import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import "./theme.css";

export default function UserDashboard() {
  const [score, setScore] = useState("");
  const [scores, setScores] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [charities, setCharities] = useState([]);
  const [selectedCharity, setSelectedCharity] = useState("");
  const [userCharity, setUserCharity] = useState(null);

  // 🔹 Get logged in user
  const getUser = async () => {
    const { data } = await supabase.auth.getUser();
    return data.user;
  };

  // 🔹 Load ALL data
  useEffect(() => {
    const loadData = async () => {
      const user = await getUser();
      if (!user) return;

      // Scores
      const { data: scoresData } = await supabase
        .from("scores")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);

      setScores(scoresData || []);

      // Subscription
      const { data: subData } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      setSubscription(subData);

      // Charities
      const { data: charityData } = await supabase
        .from("charities")
        .select("*");

      setCharities(charityData || []);

      // User Charity
      const { data: userCharityData } = await supabase
        .from("user_charity")
        .select("*, charities(name)")
        .eq("user_id", user.id)
        .maybeSingle();

      setUserCharity(userCharityData);
    };

    loadData();
  }, []);

  // 🔹 Add score (max 5 logic)
  const addScore = async () => {
    if (!score) return alert("Enter a score");

    const user = await getUser();
    if (!user) return;

    const { data: existing } = await supabase
      .from("scores")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (existing?.length >= 5) {
      await supabase.from("scores").delete().eq("id", existing[0].id);
    }

    await supabase.from("scores").insert([
      {
        user_id: user.id,
        score: Number(score),
      },
    ]);

    setScore("");

    // refresh scores
    const { data } = await supabase
      .from("scores")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5);

    setScores(data || []);
  };

  // 🔹 Activate subscription
  const activateSubscription = async () => {
    const user = await getUser();
    if (!user) return;

    const renewal = new Date();
    renewal.setMonth(renewal.getMonth() + 1);

    await supabase.from("subscriptions").upsert([
      {
        user_id: user.id,
        status: "active",
        renewal_date: renewal,
      },
    ]);

    setSubscription({ status: "active" });
  };

  // 🔹 Save charity
  const saveCharity = async () => {
    if (!selectedCharity) return alert("Select a charity");

    const user = await getUser();
    if (!user) return;

    await supabase.from("user_charity").upsert([
      {
        user_id: user.id,
        charity_id: selectedCharity,
        percentage: 10,
      },
    ]);

    alert("Charity saved");

    const { data } = await supabase
      .from("user_charity")
      .select("*, charities(name)")
      .eq("user_id", user.id)
      .maybeSingle();

    setUserCharity(data);
  };

  return (
    <div className="dashboard">

      {/* HEADER */}
      <div className="topbar">
        <h1>⚡ Golf Impact</h1>
      </div>

      {/* GRID */}
      <div className="dashboard-grid">

        {/* HERO */}
        <div className="card hero">
          <p className="live">🔴 Live</p>
          <h2>Welcome Back</h2>
          <p>Track scores & win rewards</p>
        </div>

        {/* SUBSCRIPTION */}
        <div className="card gradient">
          <h3>Subscription</h3>
          <p>
            {subscription?.status === "active"
              ? "Active ✅"
              : "Inactive ❌"}
          </p>

          {subscription?.status !== "active" && (
            <button onClick={activateSubscription}>
              Activate
            </button>
          )}
        </div>

        {/* STATS */}
        <div className="card">
          <h3>Your Stats</h3>
          <p>Scores: {scores.length}</p>
        </div>

        {/* ADD SCORE */}
        <div className="card half">
          <h3>Add Score</h3>

          <input
            type="number"   // ✅ mobile keyboard fix
            placeholder="Enter score"
            value={score}
            onChange={(e) => setScore(e.target.value)}
          />

          <button onClick={addScore}>Add Score</button>
        </div>

        {/* RECENT SCORES */}
        <div className="card half">
          <h3>Recent Scores</h3>

          {scores.length === 0 ? (
            <p>No scores yet</p>
          ) : (
            scores.map((s) => (
              <div key={s.id} className="list-item">
                Score: {s.score}
              </div>
            ))
          )}
        </div>

        {/* CHARITY (BOTTOM FULL WIDTH) */}
        <div className="card full">
          <h3>❤️ Charity</h3>

          <p className="selected-charity">
            Selected:{" "}
            <strong>
              {userCharity?.charities?.name || "Not selected"}
            </strong>
          </p>

          <div className="charity-actions">
            <select
              value={selectedCharity}
              onChange={(e) => setSelectedCharity(e.target.value)}
            >
              <option value="">Select charity</option>
              {charities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <button onClick={saveCharity}>Save</button>
          </div>
        </div>

      </div>
    </div>
  );
}