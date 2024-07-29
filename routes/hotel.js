const express = require("express");
const router = express.Router();
const { Pool } = require("pg");
const config = require("../config.json");
const pool = new Pool(config.database);

router.get("/:slug", async (req, res) => {
    try {
        const { slug } = req.params;
        console.log("Fetching hotel with slug:", slug);

        const hotelQuery = "SELECT * FROM hotel_details WHERE slug = $1";
        const hotelResult = await pool.query(hotelQuery, [slug]);
        console.log("Hotel query result:", hotelResult.rows);

        if (hotelResult.rows.length === 0) {
            return res.status(404).json({ message: "Hotel not found" });
        }

        const roomsQuery =
            "SELECT * FROM room_information WHERE hotel_slug = $1";
        const roomsResult = await pool.query(roomsQuery, [slug]);
        console.log("Rooms query result:", roomsResult.rows);

        const hotel = hotelResult.rows[0];
        hotel.rooms = roomsResult.rows;

        res.status(200).json(hotel);
    } catch (error) {
        console.error("Error fetching hotel details:", error);
        if (error.code === "42P01") {
            res.status(500).json({
                message: "Database error: Table not found",
            });
        } else if (error.code === "28P01") {
            res.status(500).json({
                message: "Database error: Authentication failed",
            });
        } else {
            res.status(500).json({
                message: "Internal server error",
                error: error.message,
            });
        }
    }
});

router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM hotel_details");
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching hotels:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
});

router.post("/", async (req, res) => {
    try {
        const {
            slug,
            images,
            title,
            description,
            guest_count,
            bedroom_count,
            bathroom_count,
            amenities,
            host_information,
            address,
            latitude,
            longitude,
        } = req.body;

        const insertQuery = `
      INSERT INTO hotel_details 
      (slug, images, title, description, guest_count, bedroom_count, bathroom_count, amenities, host_information, address, latitude, longitude)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;

        const values = [
            slug,
            images,
            title,
            description,
            guest_count,
            bedroom_count,
            bathroom_count,
            amenities,
            JSON.stringify(host_information),
            address,
            latitude,
            longitude,
        ];

        const result = await pool.query(insertQuery, values);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error creating hotel:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
});

router.put("/:slug", async (req, res) => {
    try {
        const { slug } = req.params;
        const {
            images,
            title,
            description,
            guest_count,
            bedroom_count,
            bathroom_count,
            amenities,
            host_information,
            address,
            latitude,
            longitude,
        } = req.body;

        const updateQuery = `
    UPDATE hotel_details 
    SET images = $1, title = $2, description = $3, guest_count = $4, 
        bedroom_count = $5, bathroom_count = $6, amenities = $7, 
        host_information = $8, address = $9, latitude = $10, longitude = $11
    WHERE slug = $12
    RETURNING *
  `;

        const values = [
            images,
            title,
            description,
            guest_count,
            bedroom_count,
            bathroom_count,
            amenities,
            JSON.stringify(host_information),
            address,
            latitude,
            longitude,
            slug,
        ];

        const result = await pool.query(updateQuery, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Hotel not found" });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Error updating hotel:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
});

router.delete("/:slug", async (req, res) => {
    try {
        const { slug } = req.params;

        const deleteQuery =
            "DELETE FROM hotel_details WHERE slug = $1 RETURNING *";
        const result = await pool.query(deleteQuery, [slug]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Hotel not found" });
        }

        res.status(200).json({ message: "Hotel deleted successfully" });
    } catch (error) {
        console.error("Error deleting hotel:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
});

module.exports = router;
