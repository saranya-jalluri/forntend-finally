import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

const emptyTour = {
  title: "",
  description: "",
  imageUrl: "",
  location: "",
};

function CreatorDashboard() {
  const [tour, setTour] = useState(emptyTour);
  const [tours, setTours] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadTours = () => {
    api("/tours")
      .then(setTours)
      .catch(() => setError("Unable to load tours."));
  };

  useEffect(loadTours, []);

  const addTour = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    try {
      await api("/tours", {
        method: "POST",
        body: JSON.stringify({ ...tour, verified: false }),
      });
      setTour(emptyTour);
      setMessage("Tour submitted successfully. It will be visible to users after admin approval.");
      loadTours();
    } catch {
      setError("Unable to add tour.");
    }
  };

  return (
    <main className="page">
      <section className="page-title">
        <span className="eyebrow">Content Dashboard</span>
        <h1>Add educational monument content</h1>
        <p>Creators can add titles, descriptions, images, and locations for users to explore.</p>
      </section>
      <section className="dashboard-grid">
        <form className="form-card" onSubmit={addTour}>
          <h2>Add Tour</h2>
          {message && <p className="success">{message}</p>}
          {error && <p className="error">{error}</p>}
          <input required placeholder="Title" value={tour.title} onChange={(event) => setTour({ ...tour, title: event.target.value })} />
          <input required placeholder="Location" value={tour.location} onChange={(event) => setTour({ ...tour, location: event.target.value })} />
          <input required placeholder="Image URL" value={tour.imageUrl} onChange={(event) => setTour({ ...tour, imageUrl: event.target.value })} />
          <textarea required placeholder="Description" value={tour.description} onChange={(event) => setTour({ ...tour, description: event.target.value })} />
          <button className="primary">Add Tour</button>
        </form>
        <section className="table-card">
          <h2>Submitted Tours</h2>
          {tours.length === 0 && <p className="empty">No tours added yet.</p>}
          {tours.map((item) => (
            <article className="compact-row" key={item.id}>
              <span>{item.title}</span>
              <small>{item.location} | {item.verified ? "Approved" : "Pending admin approval"}</small>
              <Link to={`/tours/${item.id}`}>View</Link>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}

export default CreatorDashboard;
