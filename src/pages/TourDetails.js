import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api";

function TourDetails({ user }) {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/tours")
      .then((data) => {
        const found = data.find((item) => String(item.id) === String(id));
        if (!found) setError("Tour not found.");
        setTour(found);
      })
      .catch(() => setError("Unable to load tour details."));
  }, [id]);

  if (error) return <main className="page"><p className="error">{error}</p></main>;
  if (!tour) return <main className="page"><p className="empty">Loading tour details...</p></main>;

  return (
    <main className="page">
      <section className="detail-layout">
        <img className="detail-image" src={tour.imageUrl} alt={tour.title} />
        <article className="detail-panel">
          <span className="badge">{tour.location}</span>
          <h1>{tour.title}</h1>
          <p>{tour.description}</p>
          {user.role === "USER" && <Link className="button-link" to={`/tours/${tour.id}/guides`}>View Guides</Link>}
        </article>
      </section>
    </main>
  );
}

export default TourDetails;
