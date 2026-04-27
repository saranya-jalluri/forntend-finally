import { useState } from "react";
import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import AdminDashboard from "./pages/AdminDashboard";
import BookGuide from "./pages/BookGuide";
import CreatorDashboard from "./pages/CreatorDashboard";
import GuideDashboard from "./pages/GuideDashboard";
import GuideList from "./pages/GuideList";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TourDetails from "./pages/TourDetails";
import UserDashboard from "./pages/UserDashboard";
import { roleHome } from "./api";

const roleLabels = {
  ADMIN: "Admin",
  USER: "Cultural Enthusiast",
  GUIDE: "Tour Guide",
  CREATOR: "Content Creator",
};

function Guard({ user, allow, children }) {
  if (!user) return <Navigate to="/" replace />;
  if (allow && !allow.includes(user.role)) return <Navigate to={roleHome(user.role)} replace />;
  return children;
}

function AppRoutes({ user, setUser }) {
  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to={roleHome(user.role)} replace /> : <Login onLogin={setUser} />} />
      <Route path="/register" element={user ? <Navigate to={roleHome(user.role)} replace /> : <Register onRegister={setUser} />} />
      <Route path="/home" element={<Guard user={user} allow={["USER", "ADMIN", "CREATOR"]}><Home user={user} /></Guard>} />
      <Route path="/tours/:id" element={<Guard user={user}><TourDetails user={user} /></Guard>} />
      <Route path="/tours/:id/guides" element={<Guard user={user} allow={["USER"]}><GuideList /></Guard>} />
      <Route path="/book/:tourId/:guideId" element={<Guard user={user} allow={["USER"]}><BookGuide user={user} /></Guard>} />
      <Route path="/user-dashboard" element={<Guard user={user} allow={["USER"]}><UserDashboard user={user} /></Guard>} />
      <Route path="/guide-dashboard" element={<Guard user={user} allow={["GUIDE"]}><GuideDashboard user={user} /></Guard>} />
      <Route path="/creator-dashboard" element={<Guard user={user} allow={["CREATOR"]}><CreatorDashboard user={user} /></Guard>} />
      <Route path="/admin" element={<Guard user={user} allow={["ADMIN"]}><AdminDashboard /></Guard>} />
      <Route path="*" element={<Navigate to={user ? roleHome(user.role) : "/"} replace />} />
    </Routes>
  );
}

function App() {
  const [user, setUser] = useState(null);

  return (
    <BrowserRouter>
      {user && (
        <nav className="navbar">
          <Link className="brand" to={roleHome(user.role)}>Heritage Explorer</Link>
          <div className="navlinks">
            {(user.role === "USER" || user.role === "ADMIN" || user.role === "CREATOR") && <Link to="/home">Tours</Link>}
            {user.role === "USER" && <Link to="/user-dashboard">My Bookings</Link>}
            {user.role === "CREATOR" && <Link to="/creator-dashboard">Creator Dashboard</Link>}
            {user.role === "GUIDE" && <Link to="/guide-dashboard">Guide Dashboard</Link>}
            {user.role === "ADMIN" && <Link to="/admin">Admin Dashboard</Link>}
          </div>
          <div className="user-chip">
            <span>{user.name}</span>
            <small>{roleLabels[user.role]}</small>
            <button onClick={() => setUser(null)}>Logout</button>
          </div>
        </nav>
      )}
      <AppRoutes user={user} setUser={setUser} />
    </BrowserRouter>
  );
}

export default App;
