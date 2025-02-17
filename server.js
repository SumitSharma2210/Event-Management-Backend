const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
require("dotenv").config();

const { socketHandler } = require("./sockets");
const app = express();
const server = http.createServer(app);
const cors = require("cors");

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "https://event-management-frontend-delta.vercel.app",
  "https://event-management-fro-git-37c370-sumit-sharmas-projects-a83a6a98.vercel.app",
  "https://event-management-frontend-7xel5q27o.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/events", require("./routes/events"));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

socketHandler(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
