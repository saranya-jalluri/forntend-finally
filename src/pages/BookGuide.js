import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api";

function BookGuide({ user }) {
  const { tourId, guideId } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [guide, setGuide] = useState(null);
  const [form, setForm] = useState({ date: "", message: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([api("/tours"), api("/guides")])
      .then(([tours, guides]) => {
        setTour(tours.find((item) => String(item.id) === String(tourId)));
        setGuide(guides.find((item) => String(item.id) === String(guideId)));
      })
      .catch(() => setError("Unable to prepare booking."));
  }, [tourId, guideId]);

  const submit = async (event) => {
    event.preventDefault();
    if (!tour || !guide) return;
    setLoading(true);
    setError("");
    try {
      await api("/bookings", {
        method: "POST",
        body: JSON.stringify({
          userName: user.name,
          userEmail: user.email,
          guideId: guide.id,
          guideName: guide.name,
          tourTitle: tour.title,
          monument: tour.title,
          date: form.date,
          message: form.message,
          status: "Pending",
        }),
      });
      navigate("/user-dashboard");
    } catch {
      setError("Booking request failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page narrow">
      <section className="page-title">
        <span className="eyebrow">Booking System</span>
        <h1>Request a guided session</h1>
        <p>{tour?.title || "Monument"} with {guide?.name || "selected guide"}</p>
      </section>
      <form className="form-card" onSubmit={submit}>
        {error && <p className="error">{error}</p>}
        <input required type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} />
        <textarea required placeholder="Message for guide" value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} />
        <button className="primary" disabled={loading}>{loading ? "Sending..." : "Send booking request"}</button>
      </form>
    </main>
  );
}

export default BookGuide;
