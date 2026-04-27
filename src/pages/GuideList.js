import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api";

function GuideList() {
  const { id } = useParams();
  const [guides, setGuides] = useState([]);
  const [tour, setTour] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api("/guides"), api("/tours")])
      .then(([guideData, tourData]) => {
        setGuides(guideData);
        setTour(tourData.find((item) => String(item.id) === String(id)));
      })
      .catch(() => setError("Unable to load guides."));
  }, [id]);

  return (
    <main className="page">
      <section className="page-title">
        <span className="eyebrow">Guide Interaction</span>
        <h1>Guides for {tour?.title || "selected monument"}</h1>
        <p>Choose a guide, review their experience, and send a booking request.</p>
      </section>
      {error && <p className="error">{error}</p>}
      {!error && guides.length === 0 && <p className="empty">No guides available.</p>}
      <section className="card-grid guide-grid">
        {guides.map((guide) => (
          <article className="guide-card" key={guide.id}>
            <h2>{guide.name}</h2>
            <p>{guide.expertise}</p>
            <span>{guide.experience || "Experienced guide"}</span>
            <span>{guide.city} | {guide.languages}</span>
            <strong>{guide.rating} / 5 rating</strong>
            <Link className="button-link" to={`/book/${id}/${guide.id}`}>Book Guide</Link>
          </article>
        ))}
      </section>
    </main>
  );
}

export default GuideList;
