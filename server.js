require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Import routes
const hotelRoutes = require("./routes/hotel");

// Use routes
app.use("/api", hotelRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
