const express = require("express");
const router = express.Router();
const { Pool } = require("pg");
const config = require("../config.json");
const pool = new Pool(config.database);

// GET /hotel/:hotelSlug/rooms
router.get("/:hotelSlug/rooms", async (req, res) => {
    try {
        const { hotelSlug } = req.params;

        // First, check if the hotel exists
        const hotelQuery = "SELECT * FROM hotel_details WHERE slug = $1";
        const hotelResult = await pool.query(hotelQuery, [hotelSlug]);

        if (hotelResult.rows.length === 0) {
            return res.status(404).json({ message: "Hotel not found" });
        }

        // If hotel exists, fetch its rooms
        const roomsQuery =
            "SELECT * FROM room_information WHERE hotel_slug = $1";
        const roomsResult = await pool.query(roomsQuery, [hotelSlug]);

        res.status(200).json(roomsResult.rows);
    } catch (error) {
        console.error("Error fetching rooms:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
});

// GET /hotel/:hotelSlug/room/:roomSlug
router.get("/:hotelSlug/room/:roomSlug", async (req, res) => {
    try {
        const { hotelSlug, roomSlug } = req.params;

        const roomQuery =
            "SELECT * FROM room_information WHERE hotel_slug = $1 AND room_slug = $2";
        const roomResult = await pool.query(roomQuery, [hotelSlug, roomSlug]);

        if (roomResult.rows.length === 0) {
            return res.status(404).json({ message: "Room not found" });
        }

        res.status(200).json(roomResult.rows[0]);
    } catch (error) {
        console.error("Error fetching room:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
});

// POST /hotel/:hotelSlug/room
router.post("/:hotelSlug/room", async (req, res) => {
    try {
        const { hotelSlug } = req.params;
        const { room_slug, room_image, room_title, bedroom_count } = req.body;

        // First, check if the hotel exists
        const hotelQuery = "SELECT * FROM hotel_details WHERE slug = $1";
        const hotelResult = await pool.query(hotelQuery, [hotelSlug]);

        if (hotelResult.rows.length === 0) {
            return res.status(404).json({ message: "Hotel not found" });
        }

        const insertQuery = `
      INSERT INTO room_information 
      (hotel_slug, room_slug, room_image, room_title, bedroom_count)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

        const values = [
            hotelSlug,
            room_slug,
            room_image,
            room_title,
            bedroom_count,
        ];
        const result = await pool.query(insertQuery, values);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error creating room:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
});

// PUT /hotel/:hotelSlug/room/:roomSlug
router.put("/:hotelSlug/room/:roomSlug", async (req, res) => {
    try {
        const { hotelSlug, roomSlug } = req.params;
        const { room_image, room_title, bedroom_count } = req.body;

        const updateQuery = `
      UPDATE room_information 
      SET room_image = $1, room_title = $2, bedroom_count = $3
      WHERE hotel_slug = $4 AND room_slug = $5
      RETURNING *
    `;

        const values = [
            room_image,
            room_title,
            bedroom_count,
            hotelSlug,
            roomSlug,
        ];
        const result = await pool.query(updateQuery, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Room not found" });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Error updating room:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
});

// DELETE /hotel/:hotelSlug/room/:roomSlug
router.delete("/:hotelSlug/room/:roomSlug", async (req, res) => {
    try {
        const { hotelSlug, roomSlug } = req.params;

        const deleteQuery =
            "DELETE FROM room_information WHERE hotel_slug = $1 AND room_slug = $2 RETURNING *";
        const result = await pool.query(deleteQuery, [hotelSlug, roomSlug]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Room not found" });
        }

        res.status(200).json({ message: "Room deleted successfully" });
    } catch (error) {
        console.error("Error deleting room:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
});

module.exports = router;
