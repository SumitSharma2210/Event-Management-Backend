const socketIO = require("socket.io");

let io;
const eventAttendees = {};

const socketHandler = (server) => {
  io = socketIO(server);

  io.on("connection", (socket) => {
    console.log("New WebSocket connection:", socket.id);

    socket.on("joinEvent", (eventId) => {
      console.log(`User ${socket.id} joined event ${eventId}`);

      socket.join(eventId);

      if (!eventAttendees[eventId]) eventAttendees[eventId] = 0;
      eventAttendees[eventId] += 1;

      io.to(eventId).emit("attendeeCountUpdate", {
        eventId,
        count: eventAttendees[eventId],
      });
    });

    socket.on("leaveEvent", (eventId) => {
      console.log(`User ${socket.id} left event ${eventId}`);

      socket.leave(eventId);

      if (eventAttendees[eventId]) {
        eventAttendees[eventId] -= 1;
        if (eventAttendees[eventId] < 0) eventAttendees[eventId] = 0;

        io.to(eventId).emit("attendeeCountUpdate", {
          eventId,
          count: eventAttendees[eventId],
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("WebSocket disconnected:", socket.id);
    });
  });
};

const emitEvent = (eventName, data) => {
  if (io) {
    io.emit(eventName, data);
  }
};

module.exports = { socketHandler, emitEvent };
