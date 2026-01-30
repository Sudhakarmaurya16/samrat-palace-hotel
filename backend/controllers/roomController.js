import Room from "../models/Room.js";

// =======================
// CREATE NEW ROOM
// =======================
export const createRoom = async (req, res) => {
  try {
    console.log("Creating Room with Data:", req.body);

    const newRoom = new Room(req.body);
    const savedRoom = await newRoom.save();

    res.status(201).json(savedRoom);
  } catch (error) {
    console.error("Error creating room:", error);

    // Handle Duplicate Room Number
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Error: Room Number already exists!" });
    }

    res.status(400).json({ message: error.message });
  }
};

// =======================
// GET ALL ROOMS
// =======================
export const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find().sort({ createdAt: -1 }); // Newest first
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// GET SINGLE ROOM
// =======================
export const getRoomById = async (req, res) => {
  const { id } = req.params;
  try {
    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.json(room);
  } catch (error) {
    res.status(400).json({ message: "Invalid room ID" });
  }
};

// =======================
// UPDATE ROOM
// =======================
export const updateRoom = async (req, res) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(updatedRoom);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// =======================
// DELETE ROOM
// =======================
export const deleteRoom = async (req, res) => {
  try {
    const deletedRoom = await Room.findByIdAndDelete(req.params.id);
    if (!deletedRoom) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.status(200).json({ message: "Room deleted successfully" });
  } catch (error) {
    console.error("Error deleting room:", error);
    res.status(500).json({ message: "Server error while deleting room" });
  }
};

// ⚠️ Note: Compatibility ke liye aliases add kar rahe hain
export const fetchAllRooms = getRooms;
