import express from "express";
import admin from "firebase-admin";

const app = express();
app.use(express.json()); // ✅ This ensures req.body is an object

// Load JSON key from environment variable
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://sacredsystemmmo-default-rtdb.firebaseio.com",
});

const db = admin.database(); // ✅ Realtime Database

// ✅ Cloud Sync Endpoint
app.post("/sync", async (req, res) => {
  try {
    const { player, action, type } = req.body;

    // ✅ Check for missing values to avoid push errors
    if (!player || !action || !type) {
      return res.status(400).json({
        status: "error",
        error: "Missing player, action, or type in request body",
      });
    }

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