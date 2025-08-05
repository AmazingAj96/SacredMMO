// =========================
// SacredMMO Cloud Server.js
// =========================

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');

const app = express();
app.use(cors());
app.use(bodyParser.json());

console.log("🚀 Sacred MMO Server starting...");

// -------------------------
// Firebase Admin Setup
// -------------------------
const serviceAccount = JSON.parse(process.env.FIREBASE_KEY); 
// <-- Stored as secret in Render

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// -------------------------
// Sync Endpoint
// -------------------------
app.post('/sync', async (req, res) => {
  const { player, action, type, timestamp } = req.body;
  console.log("🔥 Sacred MMO Event:", req.body);

  try {
    // Save the event to Firestore
    const event = {
      player,
      action,
      type: type || "event",
      timestamp: timestamp || Date.now(),
      syncedAt: new Date().toISOString()
    };

    await db.collection('sacredEvents').add(event);

    res.json({
      success: true,
      message: 'Sync stored in Firebase 🔥',
      event
    });

  } catch (err) {
    console.error("Firebase Error:", err);
    res.status(500).json({
      success: false,
      error: 'Firebase write failed ❌'
    });
  }
});

// -------------------------
// Server Start
// -------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 Sacred MMO Cloud Server running on port ${PORT}`);
});
