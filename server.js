import express from "express";
import admin from "firebase-admin";

const app = express();
app.use(express.json());

// Decode and fix key before parsing
const rawKey = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY_B64, "base64").toString("utf8");
const fixedRawKey = rawKey.replace(/\\n/g, '\n');
const serviceAccount = JSON.parse(fixedRawKey);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://sacredsystemmmo-default-rtdb.firebaseio.com"
});

const db = admin.database();

// Endpoint to sync data
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🔥 Sacred MMO Cloud running on ${PORT}`)
);