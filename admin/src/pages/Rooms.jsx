import { useEffect, useState } from "react";
import {
  fetchAllRooms,
  updateRoom,
  createRoom,
  deleteRoom,
} from "../services/api";
import "./styles/room.css";

function Rooms() {
  const [rooms, setRooms] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    roomNumber: "",
    title: "",
    pricePerNight: "",
    description: "",
    imageStr: "", // Single string for input
  });

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const data = await fetchAllRooms();
      setRooms(data);
    } catch (error) {
      console.error("Error loading rooms", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ HANDLE ADD ROOM
  const handleAddRoom = async (e) => {
    e.preventDefault();

    // 1. Validation
    if (!formData.roomNumber || !formData.title || !formData.pricePerNight) {
      return alert("Please fill: Room Number, Title, and Price");
    }

    // 2. Prepare Payload (Convert Image String to Array)
    const payload = {
      roomNumber: formData.roomNumber,
      title: formData.title,
      pricePerNight: Number(formData.pricePerNight),
      description: formData.description,
      // ✨ Important: Backend expects an Array [String]
      images: formData.imageStr ? [formData.imageStr] : [],
      fastFoodAvailable: false,
      isAvailable: true,
    };

    try {
      await createRoom(payload);
      alert("Room Added Successfully!");

      // 3. Reset Form
      setFormData({
        roomNumber: "",
        title: "",
        pricePerNight: "",
        description: "",
        imageStr: "",
      });

      loadRooms(); // Refresh List
    } catch (error) {
      console.error("Add Room Error:", error);
      // Backend error message show karein
      alert(error.message || "Failed to add room");
    }
  };

  // ✅ HANDLE DELETE ROOM
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      try {
        await deleteRoom(id);
        loadRooms();
      } catch (error) {
        alert("Failed to delete room");
      }
    }
  };

  // Helper for Image Error
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "https://placehold.co/600x400?text=No+Image";
  };

  return (
    <div className="rooms-container">
      <h2>Manage Hotel Rooms</h2>

      {/* --- ADD ROOM FORM --- */}
      <div className="room-form-card">
        <h3>Add New Room</h3>
        <form onSubmit={handleAddRoom} className="room-form">
          {/* 1. ROOM NUMBER */}
          <div className="form-group">
            <input
              type="text"
              name="roomNumber"
              placeholder="Room Number (e.g. 102)"
              value={formData.roomNumber}
              onChange={handleChange}
              required
            />
          </div>

          {/* 2. TITLE */}
          <div className="form-group">
            <input
              type="text"
              name="title"
              placeholder="Room Title (e.g. Deluxe Suite)"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* 3. PRICE */}
          <div className="form-group">
            <input
              type="number"
              name="pricePerNight"
              placeholder="Price per Night (₹)"
              value={formData.pricePerNight}
              onChange={handleChange}
              required
            />
          </div>

          {/* 4. IMAGE URL */}
          <div className="form-group full-width">
            <input
              type="text"
              name="imageStr"
              placeholder="Image URL"
              value={formData.imageStr}
              onChange={handleChange}
            />
          </div>

          {/* 5. DESCRIPTION */}
          <div className="form-group full-width">
            <textarea
              name="description"
              placeholder="Room Description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <button type="submit" className="add-room-btn">
            ADD TO ROOMS
          </button>
        </form>
      </div>

      {/* --- ROOMS LIST --- */}
      <div className="rooms-admin-grid">
        {rooms.map((room) => (
          <div className="room-admin-card" key={room._id}>
            <div className="room-image-container">
              {/* Show first image or placeholder */}
              <img
                src={
                  room.images && room.images.length > 0
                    ? room.images[0]
                    : "https://placehold.co/600x400?text=Room"
                }
                alt={room.title}
                className="room-preview-img"
                onError={handleImageError}
              />
            </div>

            <h3 style={{ color: "#ffc107" }}>
              #{room.roomNumber} - {room.title}
            </h3>

            {/* Price Edit */}
            <label>Price (₹)</label>
            <input
              type="number"
              value={room.pricePerNight}
              className="room-input"
              onChange={async (e) => {
                const newPrice = Number(e.target.value);
                // Optimistic UI Update
                setRooms((prev) =>
                  prev.map((r) =>
                    r._id === room._id ? { ...r, pricePerNight: newPrice } : r
                  )
                );
                await updateRoom(room._id, { pricePerNight: newPrice });
              }}
            />

            {/* Toggles Group */}
            <div className="toggle-group">
              {/* Fast Food Toggle */}
              <div className="toggle-row">
                <span>Fast Food</span>
                <button
                  className={
                    room.fastFoodAvailable ? "toggle-btn on" : "toggle-btn off"
                  }
                  onClick={async () => {
                    const newVal = !room.fastFoodAvailable;
                    setRooms((prev) =>
                      prev.map((r) =>
                        r._id === room._id
                          ? { ...r, fastFoodAvailable: newVal }
                          : r
                      )
                    );
                    await updateRoom(room._id, { fastFoodAvailable: newVal });
                  }}
                >
                  {room.fastFoodAvailable ? "YES" : "NO"}
                </button>
              </div>

              {/* Status Toggle */}
              <div className="toggle-row">
                <span>Status</span>
                <button
                  className={
                    room.isAvailable ? "toggle-btn on" : "toggle-btn off"
                  }
                  onClick={async () => {
                    const newVal = !room.isAvailable;
                    setRooms((prev) =>
                      prev.map((r) =>
                        r._id === room._id ? { ...r, isAvailable: newVal } : r
                      )
                    );
                    await updateRoom(room._id, { isAvailable: newVal });
                  }}
                >
                  {room.isAvailable ? "OPEN" : "BOOKED"}
                </button>
              </div>
            </div>

            {/* Delete Button */}
            <button
              className="delete-room-btn"
              onClick={() => handleDelete(room._id)}
            >
              Delete Room
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Rooms;
