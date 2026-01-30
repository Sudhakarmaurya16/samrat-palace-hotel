import { useState } from "react";
import "../styles/catering.css"; // Ultra 3D CSS

function Catering() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    eventType: "wedding",
    guests: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- DUMMY DATA ---
  const services = [
    {
      id: 1,
      title: "Royal Weddings",
      desc: "Exquisite menus for your special day.",
      img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=600",
    },
    {
      id: 2,
      title: "Corporate Events",
      desc: "Professional catering for business meets.",
      img: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=600",
    },
    {
      id: 3,
      title: "Outdoor Parties",
      desc: "Live counters and BBQ setups.",
      img: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?q=80&w=600",
    },
  ];

  const menuShowcase = [
    {
      id: 1,
      img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600",
      name: "Starters",
    },
    {
      id: 2,
      img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600",
      name: "Main Course",
    },
    {
      id: 3,
      img: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=600",
      name: "Desserts",
    },
    {
      id: 4,
      img: "https://images.unsplash.com/photo-1544510807-6f0a3520113c?q=80&w=600",
      name: "Drinks",
    },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      alert(
        `Thank you, ${formData.name}. Our Catering Manager will call you shortly.`
      );
      setIsSubmitting(false);
      setFormData({
        name: "",
        phone: "",
        eventType: "wedding",
        guests: "",
        message: "",
      });
    }, 1500);
  };

  return (
    <div className="catering-page">
      {/* ================= HERO SECTION (Video BG) ================= */}
      <div className="cat-hero">
        <video autoPlay loop muted playsInline className="cat-bg-video">
          {/* Cooking / Serving Video */}
          <source
            src="https://cdn.pixabay.com/video/2017/01/04/7032-198160275_large.mp4"
            type="video/mp4"
          />
        </video>
        <div className="cat-overlay"></div>

        <div className="cat-hero-content">
          <h4>Samrat Palace Presents</h4>
          <h1>Premium Catering Services</h1>
          <p>Bringing the Royal Taste to Your Doorstep</p>
          <button
            className="cta-btn"
            onClick={() =>
              document
                .getElementById("inquiry")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            Request A Menu
          </button>
        </div>
      </div>

      {/* ================= SERVICES SECTION (3D Cards) ================= */}
      <section className="cat-section dark-pattern">
        <div className="section-header">
          <h2>Events We Serve</h2>
          <div className="divider-gold"></div>
        </div>

        <div className="cat-grid">
          {services.map((srv) => (
            <div className="service-card-3d" key={srv.id}>
              <div className="img-box">
                <img src={srv.img} alt={srv.title} />
              </div>
              <div className="content-box">
                <h3>{srv.title}</h3>
                <p>{srv.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= MENU SHOWCASE (Gallery) ================= */}
      <section className="cat-section gradient-bg">
        <div className="section-header">
          <h2>Culinary Masterpieces</h2>
          <p>From Desi Flavors to Global Cuisines</p>
          <div className="divider-gold"></div>
        </div>

        <div className="menu-grid">
          {menuShowcase.map((item) => (
            <div className="menu-item-3d" key={item.id}>
              <img src={item.img} alt={item.name} />
              <div className="menu-overlay">
                <h3>{item.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= INQUIRY FORM (Glassmorphism) ================= */}
      <section className="cat-section form-bg" id="inquiry">
        <div className="glass-form-container">
          <div className="form-head">
            <h2>Book Catering</h2>
            <p>Tell us about your event</p>
          </div>

          <form onSubmit={handleSubmit} className="cat-form">
            <div className="input-row">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="number"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-row">
              <select
                name="eventType"
                value={formData.eventType}
                onChange={handleChange}
              >
                <option value="wedding">Wedding</option>
                <option value="corporate">Corporate</option>
                <option value="birthday">Birthday</option>
                <option value="other">Other</option>
              </select>
              <input
                type="number"
                name="guests"
                placeholder="Guest Count"
                value={formData.guests}
                onChange={handleChange}
                required
              />
            </div>

            <textarea
              name="message"
              rows="3"
              placeholder="Food preferences or specific requirements..."
              value={formData.message}
              onChange={handleChange}
            ></textarea>

            <button
              type="submit"
              className="submit-btn-gold"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Get A Quote"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Catering;
