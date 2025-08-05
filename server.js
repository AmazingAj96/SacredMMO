const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');
const firebaseConfig = require('./firebaseConfig');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Initialize Firebase Admin
try {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: firebaseConfig.databaseURL
  });
} catch (e) {
  console.log('Firebase Admin already initialized');
}

const db = admin.database();

app.post('/sync', (req, res) => {
  const { player, action, timestamp } = req.body;
  if (!player || !action) {
    return res.status(400).json({ error: 'Missing player or action' });
  }

  const logRef = db.ref('gameLogs').push();
  logRef.set({ player, action, timestamp: timestamp || new Date().toISOString() });

  console.log(`Synced: ${player} -> ${action}`);
  res.json({ status: 'success' });
});

app.get('/', (req, res) => {
  res.send('Sacred MMO Live Sync Server Running!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));