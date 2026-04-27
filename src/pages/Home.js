import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

function Home({ user }) {
  const [tours, setTours] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api("/tours")
      .then((data) => setTours(user?.role === "USER" ? data.filter((tour) => tour.verified) : data))
      .catch(() => setError("Unable to load tours. Please start the Spring Boot backend."))
      .finally(() => setLoading(false));
  }, [user?.role]);

  return (
    <main className="page">
      <section className="page-title">
        <span className="eyebrow">Monument Module</span>
        <h1>Explore verified Indian heritage sites</h1>
        <p>Select a monument to view details, images, guide options, and booking flow.</p>
      </section>

      {loading && <p className="empty">Loading tours...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && tours.length === 0 && <p className="empty">No tours available yet.</p>}

      <section className="card-grid">
        {tours.map((tour) => (
          <article className="tour-card" key={tour.id}>
            <img src={tour.imageUrl} alt={tour.title} />
            <div>
              <span className="badge">{tour.location}</span>
              <h2>{tour.title}</h2>
              <p>{tour.description}</p>
              <Link className="button-link" to={`/tours/${tour.id}`}>View details</Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

export default Home;
