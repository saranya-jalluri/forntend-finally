import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, roleHome } from "../api";

function Register({ onRegister }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
    phone: "",
    city: "",
    languages: "",
    experience: "",
    expertise: "",
    specialization: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const register = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await api("/auth/register", {
        method: "POST",
        body: JSON.stringify(form),
      });
      onRegister(user);
      navigate(roleHome(user.role));
    } catch {
      setError("Registration failed. Try a different email and confirm the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="hero-copy">
        <span className="eyebrow">Join Heritage Explorer</span>
        <h1>Choose a role and start contributing to cultural discovery.</h1>
        <p>Creators add monuments, users book guides, and guides respond to real booking requests.</p>
      </section>
      <form className="auth-card" onSubmit={register} autoComplete="off">
        <h2>Register</h2>
        {error && <p className="error">{error}</p>}
        <input className="hidden-field" type="text" autoComplete="username" tabIndex="-1" aria-hidden="true" />
        <input className="hidden-field" type="password" autoComplete="new-password" tabIndex="-1" aria-hidden="true" />
        <input required placeholder="Name" autoComplete="off" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
        <input required type="email" placeholder="Email" autoComplete="off" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        <input required type="password" placeholder="Password" autoComplete="new-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
        <input required placeholder="Phone number" autoComplete="off" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
        <select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
          <option value="USER">USER - Cultural Enthusiast</option>
          <option value="GUIDE">GUIDE - Tour Guide</option>
          <option value="CREATOR">CONTENT CREATOR</option>
        </select>
        {form.role === "USER" && (
          <input placeholder="City or state" value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} />
        )}
        {form.role === "CREATOR" && (
          <>
            <input required placeholder="Specialization, e.g. Temple history" value={form.specialization} onChange={(event) => setForm({ ...form, specialization: event.target.value })} />
            <input placeholder="Experience, e.g. 2 years" value={form.experience} onChange={(event) => setForm({ ...form, experience: event.target.value })} />
          </>
        )}
        {form.role === "GUIDE" && (
          <>
            <input required placeholder="Guide city" value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} />
            <input required placeholder="Languages, e.g. Tamil, English" value={form.languages} onChange={(event) => setForm({ ...form, languages: event.target.value })} />
            <input required placeholder="Experience, e.g. 5 years" value={form.experience} onChange={(event) => setForm({ ...form, experience: event.target.value })} />
            <input required placeholder="Expertise, e.g. Chola temples" value={form.expertise} onChange={(event) => setForm({ ...form, expertise: event.target.value })} />
          </>
        )}
        <button className="primary" disabled={loading}>{loading ? "Creating..." : "Create account"}</button>
        <p className="helper">Already registered? <Link to="/">Login</Link></p>
      </form>
    </main>
  );
}

export default Register;
