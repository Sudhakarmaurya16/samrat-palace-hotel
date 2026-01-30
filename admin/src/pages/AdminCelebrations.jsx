import { useEffect, useState } from "react";
import {
  fetchAdminEvents,
  addAdminEvent,
  deleteAdminEvent,
} from "../services/api";
import "./styles/room.css";

// Cloudinary Config
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    image: "",
    videoUrl: "",
    description: "",
    status: "Upcoming",
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await fetchAdminEvents();
      // Ensure data is array before reversing
      setEvents(Array.isArray(data) ? data.reverse() : []);
    } catch (error) {
      console.error("Error loading events", error);
      setEvents([]);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ 1. CLOUDINARY UPLOAD (Fix for direct play)
  const uploadVideo = async (file) => {
    setUploading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", UPLOAD_PRESET);
    // Force resource_type to video
    data.append("resource_type", "video");

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`,
        { method: "POST", body: data }
      );
      const json = await res.json();

      if (json.secure_url) {
        setFormData({ ...formData, videoUrl: json.secure_url });
        alert("Video Uploaded Successfully!");
      } else {
        alert("Upload Failed: Check Cloudinary Preset");
      }
    } catch (error) {
      console.error("Upload Error:", error);
      alert("Error uploading video");
    } finally {
      setUploading(false);
    }
  };

  // ✅ 2. THE ULTIMATE VIDEO SOURCE DETECTOR
  // Ye function khud pata lagayega ki video kaise play karna hai
  const getVideoSource = (url) => {
    if (!url) return { type: "none" };

    // --- A. YouTube Logic (Advanced) ---
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      let videoId = "";

      try {
        if (url.includes("/shorts/")) {
          videoId = url.split("/shorts/")[1].split("?")[0];
        } else if (url.includes("youtu.be")) {
          videoId = url.split("/").pop().split("?")[0];
        } else if (url.includes("v=")) {
          videoId = url.split("v=")[1].split("&")[0];
        } else if (url.includes("/embed/")) {
          videoId = url.split("/embed/")[1].split("?")[0];
        }
      } catch (e) {
        console.error("YT Parse Error", e);
      }

      return {
        type: "iframe",
        src: `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`, // Autoplay hata diya taaki load ho sake
      };
    }

    // --- B. Facebook / Instagram / Vimeo ---
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

    // --- C. Direct Files (MP4 / Cloudinary) ---
    // Agar link me extension hai YA wo Cloudinary ka link hai
    if (url.match(/\.(mp4|webm|ogg|mov)$/i) || url.includes("cloudinary.com")) {
      return { type: "video", src: url };
    }

    // Default: Try as Iframe
    return { type: "iframe", src: url };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.date)
      return alert("Title and Date are required");

    await addAdminEvent(formData);
    alert("Event Published!");

    setFormData({
      title: "",
      date: "",
      image: "",
      videoUrl: "",
      description: "",
      status: "Upcoming",
    });
    loadEvents();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this event?")) {
      await deleteAdminEvent(id);
      loadEvents();
    }
  };

  return (
    <div className="rooms-container">
      <h2>Manage Hotel Events</h2>

      {/* --- ADD EVENT FORM --- */}
      <div className="room-form-card">
        <h3>Add New Event</h3>
        <form onSubmit={handleSubmit} className="room-form">
          <input
            name="title"
            placeholder="Event Title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
          <input
            name="image"
            placeholder="Image URL (Optional)"
            value={formData.image}
            onChange={handleChange}
          />

          {/* Video Upload & URL */}
          <div
            style={{
              border: "1px dashed #ccc",
              padding: "10px",
              margin: "10px 0",
              borderRadius: "8px",
            }}
          >
            <p style={{ margin: "0 0 5px 0", fontSize: "0.9rem" }}>
              Upload Video or Paste URL:
            </p>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => uploadVideo(e.target.files[0])}
              style={{ marginBottom: "5px" }}
            />
            {uploading && (
              <span style={{ color: "orange" }}>
                {" "}
                Uploading to Cloud... Please wait...
              </span>
            )}

            <input
              name="videoUrl"
              placeholder="Paste YouTube Link or Cloudinary URL here"
              value={formData.videoUrl}
              onChange={handleChange}
              style={{ marginTop: "5px" }}
            />
          </div>

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
          />

          <button type="submit" className="add-room-btn" disabled={uploading}>
            {uploading ? "Wait..." : "PUBLISH EVENT"}
          </button>
        </form>
      </div>

      {/* --- EVENTS LIST --- */}
      <div className="rooms-admin-grid">
        {events.map((evt) => {
          const video = getVideoSource(evt.videoUrl);

          return (
            <div className="room-admin-card" key={evt._id}>
              {/* 1. Show Image if available */}
              {evt.image && (
                <div className="room-image-container">
                  <img
                    src={evt.image}
                    alt={evt.title}
                    className="room-preview-img"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                </div>
              )}

              {/* 2. Show Video Player */}
              {evt.videoUrl && (
                <div
                  style={{
                    marginTop: "15px",
                    background: "#000",
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                >
                  {/* CASE A: MP4 / CLOUDINARY */}
                  {video.type === "video" && (
                    <video
                      src={video.src}
                      controls
                      width="100%"
                      height="200"
                      style={{ display: "block" }}
                    >
                      Your browser does not support the video tag.
                    </video>
                  )}

                  {/* CASE B: YOUTUBE / IFRAME */}
                  {video.type === "iframe" && (
                    <iframe
                      src={video.src}
                      width="100%"
                      height="200"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title="video-player"
                      style={{ display: "block" }}
                    ></iframe>
                  )}

                  {/* CASE C: NONE */}
                  {video.type === "none" && (
                    <p style={{ color: "red", padding: "10px" }}>
                      Invalid Video Link
                    </p>
                  )}
                </div>
              )}

              <h3>{evt.title}</h3>
              <p>📅 {evt.date}</p>
              <p style={{ fontSize: "0.9rem", color: "#666" }}>
                {evt.description}
              </p>

              <button
                className="delete-room-btn"
                onClick={() => handleDelete(evt._id)}
              >
                Delete Event
              </button>
            </div>
          );
        })}

        {events.length === 0 && (
          <p style={{ textAlign: "center", width: "100%" }}>No events found.</p>
        )}
      </div>
    </div>
  );
}

export default AdminEvents;
