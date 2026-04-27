import { useEffect, useState } from "react";
import { api } from "../api";

function GuideDashboard({ user }) {
  const [bookings, setBookings] = useState([]);
  const [replies, setReplies] = useState({});
  const [error, setError] = useState("");

  const loadBookings = () => {
    api(`/bookings?guideName=${encodeURIComponent(user.name)}`)
      .then(setBookings)
      .catch(() => setError("Unable to load guide bookings."));
  };

  useEffect(loadBookings, [user.name]);

  const update = async (booking, status) => {
    try {
      await api(`/bookings/${booking.id}`, {
        method: "PUT",
        body: JSON.stringify({
          status,
          reply: replies[booking.id] || booking.reply || `Your request has been ${status.toLowerCase()}.`,
        }),
      });
      loadBookings();
    } catch {
      setError("Unable to update booking.");
    }
  };

  return (
    <main className="page">
      <section className="page-title">
        <span className="eyebrow">Guide Dashboard</span>
        <h1>Booking requests for {user.name}</h1>
        <p>Review user messages, approve or reject requests, and send a reply.</p>
      </section>
      {error && <p className="error">{error}</p>}
      {bookings.length === 0 && !error && <p className="empty">No booking requests assigned yet.</p>}
      <section className="table-card">
        {bookings.map((booking) => (
          <article className="booking-row guide-row" key={booking.id}>
            <div>
              <h3>{booking.tourTitle || booking.monument}</h3>
              <p>User: {booking.userName}</p>
              <p>Date: {booking.date}</p>
              <p>Message: {booking.message}</p>
              <textarea placeholder="Reply message" value={replies[booking.id] || booking.reply || ""} onChange={(event) => setReplies({ ...replies, [booking.id]: event.target.value })} />
            </div>
            <div className="actions">
              <span className={`status ${String(booking.status).toLowerCase()}`}>{booking.status}</span>
              <button onClick={() => update(booking, "Approved")}>Approve</button>
              <button onClick={() => update(booking, "Rejected")}>Reject</button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

export default GuideDashboard;
