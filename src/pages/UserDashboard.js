import { useEffect, useState } from "react";
import { api } from "../api";

function UserDashboard({ user }) {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api(`/bookings?userEmail=${encodeURIComponent(user.email)}`)
      .then(setBookings)
      .catch(() => setError("Unable to load your bookings."));
  }, [user.email]);

  return (
    <main className="page">
      <section className="page-title">
        <span className="eyebrow">User Response System</span>
        <h1>My Bookings</h1>
        <p>Track guide decisions and read reply messages.</p>
      </section>
      {error && <p className="error">{error}</p>}
      {!error && bookings.length === 0 && <p className="empty">No booking requests yet.</p>}
      <section className="table-card">
        {bookings.map((booking) => (
          <article className="booking-row" key={booking.id}>
            <div>
              <h3>{booking.tourTitle || booking.monument}</h3>
              <p>Guide: {booking.guideName}</p>
              <p>Date: {booking.date}</p>
              <p>Message: {booking.message}</p>
              <p>Reply: {booking.reply || "No reply yet"}</p>
            </div>
            <span className={`status ${String(booking.status).toLowerCase()}`}>{booking.status}</span>
          </article>
        ))}
      </section>
    </main>
  );
}

export default UserDashboard;
