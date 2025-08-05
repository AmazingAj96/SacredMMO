const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://sacredsystemmmo-default-rtdb.firebaseio.com"
});

const db = admin.database();

// Initialize Express
const app = express();
app.use(bodyParser.json());
app.use(cors());

// API endpoint
app.post('/sync', (req, res) => {
  const { player, action, timestamp } = req.body;

  if (!player || !action) {
    return res.status(400).json({ error: 'Missing player or action' });
  }

  // Save to Firebase
  db.ref('syncLogs').push({ player, action, timestamp: timestamp || Date.now() });

  res.status(200).json({ success: true });
});

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
