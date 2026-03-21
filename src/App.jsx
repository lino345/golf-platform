import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import UserDashboard from "./UserDashboard";
import AdminDashboard from "./AdminDashboard";

function App() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // get current session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    // listen for changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const signup = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) return alert(error.message);
    alert("Signup successful");
  };

  const login = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return alert(error.message);
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  // 🔐 Not logged in
  if (!session) {
    return (
      <div style={{ padding: 40 }}>
        <h1>Golf Platform</h1>

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <br /><br />

        <input
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <br /><br />

        <button onClick={signup}>Sign Up</button>
        <button onClick={login}>Login</button>
      </div>
    );
  }

  // ✅ Logged in
  return (
    <div>
      <button onClick={logout} style={{ float: "right", margin: 10 }}>
        Logout
      </button>

      <div style={{ display: "flex", gap: "10px", margin: 10 }}>
        <button onClick={() => setIsAdmin(false)}>User</button>
        <button onClick={() => setIsAdmin(true)}>Admin</button>
      </div>

      {isAdmin ? <AdminDashboard /> : <UserDashboard />}
    </div>
  );
}

export default App;