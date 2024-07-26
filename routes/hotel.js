const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

router.get('/hotel/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const hotelQuery = 'SELECT * FROM hotel_details WHERE slug = $1';
    const hotelResult = await pool.query(hotelQuery, [slug]);

    if (hotelResult.rows.length === 0) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    const roomsQuery = 'SELECT * FROM room_information WHERE hotel_slug = $1';
    const roomsResult = await pool.query(roomsQuery, [slug]);

    const hotel = hotelResult.rows[0];
    hotel.rooms = roomsResult.rows;

    res.status(200).json(hotel);
  } catch (error) {
    console.error('Error fetching hotel details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;