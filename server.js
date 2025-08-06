import express from "express";
import fetch from "node-fetch";
import admin from "firebase-admin";

const app = express();
app.use(express.json());

// 1️⃣ Decode Base64 Firebase Service Account Key from environment variable
const rawKey = Buffer.from(
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY_B64,
  "base64"
).toString("utf8");
const serviceAccount = JSON.parse(rawKey);

// Fix private key formatting
serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://sacredsystemmmo-default-rtdb.firebaseio.com"
});

const db = admin.database();

// Optional: Auto Relay URL for MMO events
const RELAY_URL = process.env.RELAY_URL || "https://sacredmmo.onrender.com/echo"; 

// 2️⃣ Sync endpoint
app.post("/sync", async (req, res) => {
  try {
    const { player, action, type } = req.body;

    // 3️⃣ Log to Firebase Realtime DB
    const logEntry = {
      player: player || "Unknown",
      action: action || "No Action",
      type: type || "General",
      timestamp: Date.now(),
    };

    await db.ref("sacredLogs").push(logEntry);

    // 4️⃣ Optional: Auto relay to MMO endpoint
    try {
      await fetch(RELAY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(logEntry),
      });
    } catch (relayError) {
      console.warn("Relay failed (but Firebase logged successfully):", relayError.message);
    }

    res.json({ status: "ok", message: "Synced to Firebase & relayed!" });
  } catch (error) {
    console.error("Error syncing:", error);
    res.status(500).json({ status: "error", error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🔥 Sacred MMO Cloud running on ${PORT}`)
);