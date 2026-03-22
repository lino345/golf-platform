import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import UserDashboard from "./UserDashboard";
import AdminDashboard from "./AdminDashboard";
import LandingPage from "./LandingPage";
import CharityPage from "./CharityPage";
import HowItWorks from "./HowItWorks";
import "./theme.css";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate
} from "react-router-dom";

function App() {
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🔹 Session + Role
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) fetchRole();
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session) fetchRole();
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  // 🔹 Get Role
  const fetchRole = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) return;

    const { data, error } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      console.error(error);
      return;
    }

    setRole(data?.role || "user");
  };

  // 🔐 LOGOUT
  const logout = async () => {
    await supabase.auth.signOut();
    setRole(null);
  };

  // 🔄 DEV ROLE SWITCH
  const switchRole = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    await supabase
      .from("users")
      .update({ role: role === "admin" ? "user" : "admin" })
      .eq("id", user.id);

    fetchRole();
  };

  // 🔐 Login Page (FIXED)
  const LoginPage = () => {
    const navigate = useNavigate(); // ✅ IMPORTANT

    const signup = async () => {
      if (!email || !password) {
        alert("Email and password required");
        return;
      }

      if (password.length < 6) {
        alert("Password must be at least 6 characters");
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        alert(error.message);
        return;
      }

      if (!data.user) {
        alert("Check your email to confirm signup");
        return;
      }

      await supabase.from("users").insert([
        {
          id: data.user.id,
          email: data.user.email,
          role: "user",
        },
      ]);

      alert("Signup successful ⚡");

      navigate("/app"); // ✅ REDIRECT
    };

    const login = async () => {
      if (!email || !password) {
        alert("Enter email and password");
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert(error.message);
        return;
      }

      navigate("/app"); // ✅ REDIRECT
    };

    return (
      <div className="login-page">
        <div className="login-overlay">
          <div className="login-box">
            <h1>⚡ Golf Impact</h1>

            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              placeholder="Password"
              type="password"
              value={password}
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
  };

  // 🔐 Protected Route
  const ProtectedApp = () => {
    if (!session) return <Navigate to="/" />;
    if (!role) return <p>Loading...</p>;

    return (
      <div className="dashboard-bg">
      <div className="container">
        <h1 style={{ textAlign: "center" }}>
          ⚡ Golf Impact Platform
        </h1>

        <button onClick={logout}>Logout</button>
        <button onClick={switchRole}>Switch Role (Dev)</button>

        {role === "admin" ? <AdminDashboard /> : <UserDashboard />}
      </div>
      </div>
    );
  };

  // 🌍 ROUTER
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/charities" element={<CharityPage />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/app" element={<ProtectedApp />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;