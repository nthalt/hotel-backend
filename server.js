const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const hotelRoutes = require("./routes/hotel");
app.use("/api", hotelRoutes);

// Serve static files
app.use("/images", express.static("public/images"));

// Simple test route
app.get("/api/test", (req, res) => {
    res.json({ message: "Test endpoint working" });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
app.use((req, res) => {
    res.status(404).json({ message: "Not Found" });
});
