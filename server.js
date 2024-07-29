const express = require("express");
const cors = require("cors");
const config = require("./config.json");
const app = express();
const port = config.server.port || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const hotelRoutes = require("./routes/hotel");
const roomRoutes = require("./routes/rooms");

// Use /hotel as the base path for both hotel and room routes
app.use("/hotel", hotelRoutes);
app.use("/hotel", roomRoutes);

// Serve static files
app.use("/images", express.static("public/images"));

// Simple test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Test endpoint working" });
});

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "production" ? {} : err.message,
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
