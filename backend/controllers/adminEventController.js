import AdminEvent from "../models/AdminEvent.js";

// 1. Get All Events (For Admin & User)
export const getAdminEvents = async (req, res) => {
  try {
    const events = await AdminEvent.find().sort({ date: 1 }); // Date wise sort
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events", error });
  }
};

// 2. Create Event (Admin Only)
export const createAdminEvent = async (req, res) => {
  try {
    const newEvent = new AdminEvent(req.body);
    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(500).json({ message: "Error adding event", error });
  }
};

// 3. Delete Event (Admin Only)
export const deleteAdminEvent = async (req, res) => {
  try {
    await AdminEvent.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting event", error });
  }
};
