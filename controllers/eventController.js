const Event = require("../models/Event");

const getEvents = async (req, res) => {
  try {
    const events = await Event.find({});
    res.status(200).json(events);
  } catch (err) {
    console.error("Error fetching events:", err.message);
    res.status(500).json({ error: "Failed to fetch events" });
  }
};

const createEvent = async (req, res) => {
  const { name, description, date } = req.body;

  try {
    const event = new Event({
      name,
      description,
      date,
      createdBy: req.user.id,
    });

    await event.save();
    res.status(201).json(event);
  } catch (err) {
    console.error("Error creating event:", err.message);
    res.status(500).json({ error: "Failed to create event" });
  }
};

const updateEvent = async (req, res) => {
  if (req.user.role === "guest")
    return res.status(403).json({ error: "Guests cannot update events" });

  const { id } = req.params;

  try {
    const event = await Event.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(event);
  } catch (err) {
    console.error("Error updating event:", err.message);
    res.status(500).json({ error: "Failed to update event" });
  }
};

const deleteEvent = async (req, res) => {
  if (req.user.role === "guest")
    return res.status(403).json({ error: "Guests cannot delete events" });

  const { id } = req.params;

  try {
    await Event.findByIdAndDelete(id);
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error("Error deleting event:", err.message);
    res.status(500).json({ error: "Failed to delete event" });
  }
};

module.exports = { createEvent, getEvents, updateEvent, deleteEvent };
