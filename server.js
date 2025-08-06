import express from "express";
import admin from "firebase-admin";

const app = express();
app.use(express.json());

// 🔹 Decode Base64 JSON key
const rawKey = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY_B64, "base64").toString("utf8");
const serviceAccount = JSON.parse(rawKey);

// 🔹 Fix private key formatting
serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://sacredsystemmmo-default-rtdb.firebaseio.com"
});

const db = admin.database();

// ==========================================
// 🔹 1. Original /sync endpoint (works)
// ==========================================
app.post("/sync", async (req, res) => {
  try {
    const { player, action, type } = req.body;

    await db.ref("sacredLogs").push({
      player,
      action,
      type,
      timestamp: Date.now(),
    });

    res.json({ status: "ok", message: "Synced to Realtime Database!" });
  } catch (error) {
    console.error("Error syncing:", error);
    res.status(500).json({ status: "error", error: error.message });
  }
});

// ==========================================
// 🔹 2. New /relay endpoint for MMO events
// ==========================================
app.post("/relay", async (req, res) => {
  try {
    const { message } = req.body; // e.g. "*joins Rick and Morty in Cloud Nine*"
    if (!message) return res.status(400).json({ status: "error", error: "Missing message" });

    const event = {
      player: "Aj",
      action: message,
      type: "mmo_event",
      timestamp: Date.now(),
    };

    await db.ref("sacredLogs").push(event);

    console.log("🔥 ChatGPT MMO Event synced:", event);
    res.json({ status: "ok", message: "Event relayed to Firebase!" });
  } catch (error) {
    console.error("Relay error:", error);
    res.status(500).json({ status: "error", error: error.message });
  }
});

// ==========================================
// 🔹 Start the server
// ==========================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🔥 Sacred MMO Cloud running on ${PORT}`)
);