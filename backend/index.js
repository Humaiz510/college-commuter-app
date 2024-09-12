const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const admin = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase Admin SDK for notifications
const serviceAccount = require('./serviceAccountkey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Helper function to send notifications
const sendNotification = async (userToken, message) => {
  try {
    const response = await admin.messaging().sendToDevice(userToken, message);
    console.log('Notification sent successfully:', response);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

// Route to update user profile
app.put('/api/users/:email', async (req, res) => {
  const { email } = req.params;
  const { car_availability, commute_time, commute_days, fcm_token } = req.body;

  try {
    const result = await pool.query(
      `UPDATE users 
       SET car_availability = $1, commute_time = $2, commute_days = $3, fcm_token = $4
       WHERE email = $5 RETURNING *`,
      [car_availability, commute_time, commute_days, fcm_token, email]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Route to find carpool matches and send notifications
app.get('/api/match/:email', async (req, res) => {
  const { email } = req.params;

  try {
    // Get the user's preferences
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = userResult.rows[0];

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let matchQuery;
    let queryParams = [email, user.commute_time, user.commute_days];

    // Case 1: User does NOT have a car (Match with users who DO have cars)
    if (!user.car_availability) {
      matchQuery = `
        SELECT * FROM users 
        WHERE email != $1 
        AND commute_time = $2 
        AND commute_days && $3::text[]
        AND car_availability = true
      `;
    } 
    // Case 2: User HAS a car (Match with users who either DO or DO NOT have cars)
    else {
      matchQuery = `
        SELECT * FROM users 
        WHERE email != $1 
        AND commute_time = $2 
        AND commute_days && $3::text[]
      `;
    }

    // Execute the query to find matches
    const matchResult = await pool.query(matchQuery, queryParams);
    const matches = matchResult.rows;

    // If matches are found, send a notification to the user
    if (matches.length > 0) {
      const message = {
        notification: {
          title: 'New Carpool Match!',
          body: `You have ${matches.length} new carpool match(es). Check the app for details.`
        }
      };

      // Send notification to the user
      if (user.fcm_token) {
        await sendNotification(user.fcm_token, message);
      }
    }

    res.json(matches);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Test route for sending a test notification
app.post('/api/test-notification', async (req, res) => {
  const { userToken, title, body } = req.body;
  
  const message = {
    notification: {
      title,
      body,
    }
  };

  try {
    await sendNotification(userToken, message);
    res.status(200).send('Test notification sent.');
  } catch (error) {
    res.status(500).send('Failed to send notification.');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
