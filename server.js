const express = require('express');
const admin = require('firebase-admin');
const app = express();

app.use(express.json()); // ✅ Enable JSON parsing for POST requests

// Initialize Firebase Admin with the correct key filename
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://sacredsystemmmo.firebaseio.com" // ✅ Update if needed
});

const db = admin.database();

// POST route for syncing Sacred Logs
app.post('/sync', (req, res) => {
  const { player, action, timestamp } = req.body;

  if (!player || !action) {
    return res.status(400).json({ error: 'Missing player or action' });
  }

  // Save to Firebase
  db.ref('syncLogs').push({ player, action, timestamp });

  console.log('Incoming Sync:', req.body);

  res.status(200).json({ 
    success: true, 
    message: 'Sync received 🔮',
    timestamp: new Date().toISOString()
  });
});

// Start server
const PORT = process.env.PORT || 10000;

// ✅ Fix for "Cannot GET /"
app.get('/', (req, res) => {
  res.send('🔥 Sacred MMO Server is LIVE 🔥');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
