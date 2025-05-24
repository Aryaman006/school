require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');

const app = express();
app.use(bodyParser.json());

// Create MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Helper function to validate school data
function validateSchool(data) {
  const { name, address, latitude, longitude } = data;
  if (
    typeof name !== 'string' || name.trim() === '' ||
    typeof address !== 'string' || address.trim() === '' ||
    typeof latitude !== 'number' || latitude < -90 || latitude > 90 ||
    typeof longitude !== 'number' || longitude < -180 || longitude > 180
  ) {
    return false;
  }
  return true;
}

// Add School API
app.post('/addSchool', async (req, res) => {
  try {
    const { name, address, latitude, longitude } = req.body;

    // Validate input
    if (!validateSchool({ name, address, latitude, longitude })) {
      return res.status(400).json({ error: 'Invalid input data' });
    }

    // Insert school into DB
    const [result] = await pool.query(
      'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
      [name.trim(), address.trim(), latitude, longitude]
    );

    res.status(201).json({ message: 'School added successfully', schoolId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Haversine formula to calculate distance between two lat/lng points (in kilometers)
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const toRad = deg => deg * (Math.PI / 180);
  const R = 6371; // Radius of Earth in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// List Schools API
app.get('/listSchools', async (req, res) => {
  try {
    const userLat = parseFloat(req.query.latitude);
    const userLon = parseFloat(req.query.longitude);

    if (
      isNaN(userLat) || userLat < -90 || userLat > 90 ||
      isNaN(userLon) || userLon < -180 || userLon > 180
    ) {
      return res.status(400).json({ error: 'Invalid latitude or longitude query parameters' });
    }

    // Fetch all schools
    const [schools] = await pool.query('SELECT * FROM schools');

    // Calculate distance and sort
    const schoolsWithDistance = schools.map(school => ({
      ...school,
      distance: getDistanceFromLatLonInKm(userLat, userLon, school.latitude, school.longitude)
    }));

    schoolsWithDistance.sort((a, b) => a.distance - b.distance);

    res.json(schoolsWithDistance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
