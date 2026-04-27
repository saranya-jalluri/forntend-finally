import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, roleHome } from "../api";

function Login({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify(form),
      });
      onLogin(user);
      navigate(roleHome(user.role));
    } catch {
      setError("Invalid login details or backend is not running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="hero-copy">
        <span className="eyebrow">Heritage Explorer</span>
        <h1>Explore India&apos;s monuments with trusted guides.</h1>
        <p>Login to browse heritage sites, book guide sessions, and manage your cultural journey.</p>
      </section>
      <form className="auth-card" onSubmit={login} autoComplete="off">
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        <input className="hidden-field" type="text" autoComplete="username" tabIndex="-1" aria-hidden="true" />
        <input className="hidden-field" type="password" autoComplete="current-password" tabIndex="-1" aria-hidden="true" />
        <input required type="email" placeholder="Email" autoComplete="off" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        <input required type="password" placeholder="Password" autoComplete="current-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
        <button className="primary" disabled={loading}>{loading ? "Checking..." : "Login"}</button>
        <p className="helper">New here? <Link to="/register">Create an account</Link></p>
      </form>
    </main>
  );
}

export default Login;
