import { useEffect, useState } from "react";
import { api } from "../api";

const emptyTour = {
  title: "",
  description: "",
  imageUrl: "",
  location: "",
};

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [tours, setTours] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [tour, setTour] = useState(emptyTour);
  const [error, setError] = useState("");

  const loadAll = () => {
    Promise.all([api("/users"), api("/tours"), api("/bookings")])
      .then(([userData, tourData, bookingData]) => {
        setUsers(userData);
        setTours(tourData);
        setBookings(bookingData);
      })
      .catch(() => setError("Unable to load admin data."));
  };

  useEffect(loadAll, []);

  const addTour = async (event) => {
    event.preventDefault();
    try {
      await api("/tours", { method: "POST", body: JSON.stringify({ ...tour, verified: true }) });
      setTour(emptyTour);
      loadAll();
    } catch {
      setError("Unable to add tour.");
    }
  };

  const deleteTour = async (id) => {
    try {
      await api(`/tours/${id}`, { method: "DELETE" });
      loadAll();
    } catch {
      setError("Unable to delete tour.");
    }
  };

  const toggleUser = async (id) => {
    try {
      await api(`/users/${id}/toggle-status`, { method: "PATCH" });
      loadAll();
    } catch {
      setError("Unable to update user status.");
    }
  };

  const updateBooking = async (booking, status) => {
    try {
      await api(`/bookings/${booking.id}`, {
        method: "PUT",
        body: JSON.stringify({ status, reply: booking.reply || `Admin marked this booking ${status.toLowerCase()}.` }),
      });
      loadAll();
    } catch {
      setError("Unable to update booking.");
    }
  };

  const approveTour = async (tourToApprove) => {
    try {
      await api(`/tours/${tourToApprove.id}`, {
        method: "PUT",
        body: JSON.stringify({ ...tourToApprove, verified: true }),
      });
      loadAll();
    } catch {
      setError("Unable to approve tour.");
    }
  };

  return (
    <main className="page">
      <section className="page-title">
        <span className="eyebrow">Admin Dashboard</span>
        <h1>Manage users, tours, and bookings</h1>
        <p>Administrative control for content accuracy and system operations.</p>
      </section>
      {error && <p className="error">{error}</p>}
      <section className="dashboard-grid">
        <form className="form-card" onSubmit={addTour}>
          <h2>Add Tour</h2>
          <input required placeholder="Title" value={tour.title} onChange={(event) => setTour({ ...tour, title: event.target.value })} />
          <input required placeholder="Location" value={tour.location} onChange={(event) => setTour({ ...tour, location: event.target.value })} />
          <input required placeholder="Image URL" value={tour.imageUrl} onChange={(event) => setTour({ ...tour, imageUrl: event.target.value })} />
          <textarea required placeholder="Description" value={tour.description} onChange={(event) => setTour({ ...tour, description: event.target.value })} />
          <button className="primary">Add Tour</button>
        </form>

        <section className="table-card">
          <h2>Users</h2>
          {users.map((user) => (
            <article className="compact-row" key={user.id}>
              <span>{user.name}</span>
              <small>
                {user.email} | {user.phone || "No phone"} | {user.role} | {user.status}
                {user.role === "GUIDE" && ` | ${user.city || "No city"} | ${user.experience || "No experience"} | ${user.expertise || "No expertise"}`}
                {user.role === "CREATOR" && ` | ${user.specialization || "No specialization"} | ${user.experience || "No experience"}`}
                {user.role === "USER" && user.city && ` | ${user.city}`}
              </small>
              {user.role === "ADMIN" ? (
                <span className="status approved">Protected</span>
              ) : (
                <button onClick={() => toggleUser(user.id)}>{user.status === "Active" ? "Suspend" : "Activate"}</button>
              )}
            </article>
          ))}
        </section>
      </section>

      <section className="dashboard-grid lower">
        <section className="table-card">
          <h2>Tours</h2>
          {tours.map((item) => (
            <article className="compact-row" key={item.id}>
              <span>{item.title}</span>
              <small>{item.location} | {item.verified ? "Approved" : "Pending approval"}</small>
              <div className="actions-inline">
                {!item.verified && <button onClick={() => approveTour(item)}>Approve</button>}
                <button onClick={() => deleteTour(item.id)}>Delete</button>
              </div>
            </article>
          ))}
        </section>

        <section className="table-card">
          <h2>Bookings</h2>
          {bookings.map((booking) => (
            <article className="booking-row" key={booking.id}>
              <div>
                <h3>{booking.tourTitle || booking.monument}</h3>
                <p>{booking.userName} requested {booking.guideName}</p>
                <p>{booking.message}</p>
              </div>
              <div className="actions">
                <span className={`status ${String(booking.status).toLowerCase()}`}>{booking.status}</span>
                <button onClick={() => updateBooking(booking, "Approved")}>Approve</button>
                <button onClick={() => updateBooking(booking, "Rejected")}>Reject</button>
              </div>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}

export default AdminDashboard;
