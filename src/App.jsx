import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import UserDashboard from "./UserDashboard";
import AdminDashboard from "./AdminDashboard";
import "./theme.css";
import bg from "./assets/bg.jpg"; // 👈 IMPORTANT

function App() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  // 🔐 SIGNUP
  const signup = async () => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      const user = data.user;

      await supabase.from("users").insert([
        {
          id: user.id,
          email: user.email,
          role: "user",
        },
      ]);

      alert("Signup successful ⚡");
    } catch (err) {
      alert(err.message);
    }
  };

  // 🔐 LOGIN
  const login = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return alert(error.message);
  };

  // 🔐 LOGOUT
  const logout = async () => {
    await supabase.auth.signOut();
  };

  // ❌ LOGIN PAGE (WITH BACKGROUND IMAGE)
  if (!session) {
    return (
      <div
        className="login-page"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="login-overlay">
          <div className="login-box">
            <h1>⚡ Golf Impact</h1>

            <input
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              placeholder="Password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />

            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={signup}>Sign Up</button>
              <button onClick={login}>Login</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ DASHBOARD
  return (
    <div className="container">
      <h1 style={{ textAlign: "center" }}>⚡ Golf Impact Platform</h1>

      <button onClick={logout} style={{ float: "right", marginBottom: 20 }}>
        Logout
      </button>

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <button onClick={() => setIsAdmin(false)}>User</button>
        <button onClick={() => setIsAdmin(true)}>Admin</button>
      </div>

      <h2 style={{ textShadow: "0 0 15px #00F5D4" }}>
        {isAdmin ? "Admin Dashboard" : "User Dashboard"}
      </h2>

      {isAdmin ? <AdminDashboard /> : <UserDashboard />}
    </div>
  );
}

export default App;