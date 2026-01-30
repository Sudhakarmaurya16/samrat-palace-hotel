import { useEffect, useState } from "react";
import { fetchTables, addTable, deleteTable } from "../services/api";
import "./styles/adminTable.css"; // Ensure CSS is imported

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

function AdminTableBookings() {
  const [tables, setTables] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    tableNo: "",
    seats: "",
    category: "General",
    status: "Available",
    image: "", // Stores either uploaded URL or pasted URL
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await fetchTables();
      setTables(Array.isArray(data) ? data.reverse() : []);
    } catch (error) {
      console.error("Error loading tables", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    setUploading(true);

    // Check Config
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      alert("Cloudinary Configuration Missing!");
      setUploading(false);
      return;
    }

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", UPLOAD_PRESET);
    data.append("cloud_name", CLOUD_NAME);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body: data }
      );

      const json = await res.json();
      if (json.secure_url) {
        setFormData((prev) => ({ ...prev, image: json.secure_url }));
      } else {
        alert(`Upload Failed: ${json.error?.message}`);
      }
    } catch (error) {
      console.error("Upload Error:", error);
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (uploading) return alert("Please wait! Image is still uploading...");

    if (!formData.tableNo || !formData.seats) {
      return alert("Table Number and Seats are required!");
    }

    try {
      await addTable(formData);
      alert("Table Added Successfully!");
      setFormData({
        tableNo: "",
        seats: "",
        category: "General",
        status: "Available",
        image: "",
      });
      const fileInput = document.getElementById("fileInput");
      if (fileInput) fileInput.value = "";
      loadData();
    } catch (error) {
      alert("Failed to add table");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this table?")) {
      await deleteTable(id);
      loadData();
    }
  };

  // Helper for Status Class
  const getStatusClass = (status) => {
    switch (status) {
      case "Booked":
        return "status-booked";
      case "Maintenance":
        return "status-maintenance";
      default:
        return "status-available";
    }
  };

  return (
    <div className="rooms-container">
      <h2>Manage Restaurant Tables</h2>

      {/* --- FORM SECTION --- */}
      <div className="room-form-card">
        <h3>Add New Table</h3>
        <form onSubmit={handleSubmit} className="room-form">
          <div style={{ gap: "15px", marginBottom: "15px" }}>
            <div style={{ flex: 1 }}>
              <label>Table No</label>
              <input
                name="tableNo"
                placeholder="e.g. T-1"
                value={formData.tableNo}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
            <div style={{ flex: 1 }}>
              <label>Seats</label>
              <input
                type="number"
                name="seats"
                placeholder="4"
                value={formData.seats}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
          </div>

          {/* --- IMAGE SECTION (URL + UPLOAD) --- */}
          <div style={{ marginBottom: "15px" }}>
            <label>Table Image</label>

            {/* 1. Paste URL Input */}
            <input
              type="text"
              name="image"
              placeholder="Paste Image URL here..."
              value={formData.image}
              onChange={handleChange}
              className="form-input"
              style={{ marginBottom: "10px" }}
            />

            <div
              style={{
                textAlign: "center",
                fontSize: "0.8rem",
                color: "#888",
                margin: "5px 0",
              }}
            >
              OR
            </div>

            {/* 2. Upload File Input */}
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files[0])}
              className="form-input"
            />
            {uploading && <span className="uploading-text">Uploading...</span>}

            {/* Preview */}
            {formData.image && !uploading && (
              <div style={{ marginTop: "10px" }}>
                <img
                  src={formData.image}
                  alt="Preview"
                  height="80"
                  style={{ borderRadius: "4px", border: "1px solid #444" }}
                />
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
            <div style={{ flex: 1 }}>
              <label>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-input"
              >
                {/* --- ADDED MORE CATEGORIES --- */}
                <option value="General">General</option>
                <option value="Couple">Couple (2 Seater)</option>
                <option value="Family">Family (Large)</option>
                <option value="VIP">VIP (Private)</option>
                <option value="Outdoor">Outdoor / Garden</option>
                <option value="Rooftop">Rooftop</option>
                <option value="Booth">Booth</option>
                <option value="Bar">Bar Seating</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-input"
              >
                <option value="Available">Available</option>
                <option value="Booked">Booked</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          <button type="submit" className="add-room-btn" disabled={uploading}>
            {uploading ? "Wait..." : "ADD TABLE"}
          </button>
        </form>
      </div>

      <hr style={{ opacity: 0.1, margin: "30px 0" }} />

      {/* --- CARDS GRID SECTION --- */}
      <div className="rooms-admin-grid">
        {tables.map((t) => (
          <div className="room-admin-card" key={t._id}>
            {/* Image Area */}
            <div className="card-image-container">
              {t.image ? (
                <img src={t.image} alt="table" className="card-img" />
              ) : (
                <div className="no-image-placeholder">No Image</div>
              )}
            </div>

            {/* Content Area */}
            <div className="card-info">
              <h3 className="table-number">{t.tableNo}</h3>

              <div className="info-row">
                <span>🪑 Seats:</span>
                <strong>{t.seats}</strong>
              </div>

              <div className="info-row">
                <span>📍 Category:</span>
                <span>{t.category}</span>
              </div>

              <div style={{ marginTop: "10px" }}>
                <span className={`status-badge ${getStatusClass(t.status)}`}>
                  {t.status}
                </span>
              </div>
            </div>

            {/* Footer Button */}
            <button
              className="delete-room-btn"
              onClick={() => handleDelete(t._id)}
            >
              DELETE
            </button>
          </div>
        ))}

        {tables.length === 0 && (
          <p style={{ textAlign: "center", width: "100%", color: "#888" }}>
            No tables added yet.
          </p>
        )}
      </div>
    </div>
  );
}

export default AdminTableBookings;
