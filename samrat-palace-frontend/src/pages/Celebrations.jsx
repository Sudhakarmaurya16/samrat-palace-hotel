import { useState, useEffect } from "react";
import { createCelebrationBooking, fetchAdminEvents } from "../services/api";
import "../styles/celebrations.css";

function Celebrations() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    type: "birthday",
    date: "",
    guests: "",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await fetchAdminEvents();
      // Reverse array to show newest first
      setUpcomingEvents(Array.isArray(data) ? data.reverse() : []);
    } catch (error) {
      console.error("Error loading events");
    }
  };

  // ✅ HELPER: Video Source Detector (Same as Admin Page)
  const getVideoSource = (url) => {
    if (!url) return { type: "none" };

    // YouTube Logic
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      let videoId = "";
      try {
        if (url.includes("/shorts/"))
          videoId = url.split("/shorts/")[1].split("?")[0];
        else if (url.includes("youtu.be"))
          videoId = url.split("/").pop().split("?")[0];
        else if (url.includes("v=")) videoId = url.split("v=")[1].split("&")[0];
        else if (url.includes("/embed/"))
          videoId = url.split("/embed/")[1].split("?")[0];
      } catch (e) {
        console.error("YT Parse Error", e);
      }

      return {
        type: "iframe",
        src: `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`,
      };
    }

    // Facebook / Vimeo
    if (url.includes("facebook.com") || url.includes("fb.watch")) {
      return {
        type: "iframe",
        src: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
          url
        )}&show_text=false&width=560`,
      };
    }
    if (url.includes("vimeo.com")) {
      const id = url.split("/").pop();
      return { type: "iframe", src: `https://player.vimeo.com/video/${id}` };
    }

    // Direct Files (MP4 / Cloudinary)
    if (url.match(/\.(mp4|webm|ogg|mov)$/i) || url.includes("cloudinary.com")) {
      return { type: "video", src: url };
    }

    return { type: "iframe", src: url };
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.date)
      return alert("Fill required details!");

    setIsSubmitting(true);
    try {
      await createCelebrationBooking(formData);
      alert(`🎉 Request Sent! We will contact you shortly.`);
      setFormData({
        name: "",
        phone: "",
        type: "birthday",
        date: "",
        guests: "",
        notes: "",
      });
    } catch (error) {
      alert("Booking Failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="celebration-page">
      {/* 1. HERO SECTION */}
      <div className="hero-section">
        <div className="bg-video-container">
          <iframe
            className="bg-video-iframe"
            src="https://www.youtube.com/embed/modj33Yg1b0?autoplay=1&mute=1&controls=0&loop=1&playlist=modj33Yg1b0&showinfo=0&rel=0"
            title="Background"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          ></iframe>
        </div>
        <div className="video-overlay"></div>

        <div className="form-container-3d">
          <div className="glass-form">
            <div className="form-header">
              <h4>Plan Your Event</h4>
              <h1>Make It Unforgettable</h1>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="glow-input"
                />
                <input
                  type="number"
                  name="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="glow-input"
                />
              </div>
              <div className="input-group">
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="glow-input"
                >
                  <option value="birthday">🎂 Birthday</option>
                  <option value="engagement">💍 Engagement</option>
                  <option value="anniversary">🥂 Anniversary</option>
                  <option value="corporate">🤝 Corporate</option>
                </select>
                <input
                  type="date"
                  name="date"
                  min={today}
                  value={formData.date}
                  onChange={handleChange}
                  className="glow-input"
                />
              </div>
              <input
                type="number"
                name="guests"
                placeholder="No. of Guests"
                value={formData.guests}
                onChange={handleChange}
                className="glow-input"
                style={{ marginBottom: "15px" }}
              />
              <textarea
                name="notes"
                placeholder="Any special requests?"
                value={formData.notes}
                onChange={handleChange}
                className="glow-input"
                rows="2"
              />
              <button
                type="submit"
                className="gold-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Book Now"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* 2. ✅ UPCOMING EVENTS SECTION (With Video Support) */}
      {upcomingEvents.length > 0 && (
        <section className="gallery-section dark-bg">
          <h2 className="section-title">✨ Upcoming Events</h2>
          <div className="media-grid">
            {upcomingEvents.map((evt) => {
              const video = getVideoSource(evt.videoUrl); // Identify Video Type

              return (
                <div
                  className="media-card"
                  key={evt._id}
                  style={{
                    position: "relative",
                    height: "auto",
                    minHeight: "350px",
                  }}
                >
                  {/* Coming Soon Badge */}
                  {evt.status === "Coming Soon" && (
                    <div className="coming-soon-badge">COMING SOON ⏳</div>
                  )}

                  {/* A. Show Video if available */}
                  {evt.videoUrl ? (
                    <div
                      style={{
                        width: "100%",
                        height: "220px",
                        background: "#000",
                      }}
                    >
                      {video.type === "video" && (
                        <video
                          src={video.src}
                          controls
                          width="100%"
                          height="100%"
                          style={{ objectFit: "cover" }}
                        >
                          Browser not supported
                        </video>
                      )}
                      {video.type === "iframe" && (
                        <iframe
                          src={video.src}
                          width="100%"
                          height="100%"
                          frameBorder="0"
                          allowFullScreen
                          title={evt.title}
                        ></iframe>
                      )}
                    </div>
                  ) : (
                    // B. Else Show Image
                    <img
                      src={
                        evt.image || "https://placehold.co/600x400?text=Event"
                      }
                      alt={evt.title}
                      className="gallery-media"
                      style={{ height: "220px" }}
                    />
                  )}

                  <div className="media-info-text">
                    <h3>{evt.title}</h3>
                    <p
                      style={{
                        color: "#ffd700",
                        fontWeight: "bold",
                        marginBottom: "5px",
                      }}
                    >
                      📅 {evt.date}
                    </p>
                    <p>{evt.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 3. STATIC VENUES */}
      <section className="gallery-section gradient-bg">
        <h2 className="section-title">🏰 Our Grand Venues</h2>
        <div className="media-grid">
          <div className="media-card image-3d">
            <img
              src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=600"
              className="gallery-media"
            />
            <div className="overlay-text">
              <h3>Grand Ballroom</h3>
            </div>
          </div>
          <div className="media-card image-3d">
            <img
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600"
              className="gallery-media"
            />
            <div className="overlay-text">
              <h3>Poolside View</h3>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Celebrations;
