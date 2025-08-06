import express from "express";
import admin from "firebase-admin";

const app = express();
app.use(express.json()); // ✅ Required for JSON POST

// Load JSON key from environment variable
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://sacredsystemmmo-default-rtdb.firebaseio.com"
});

const db = admin.database();

// ✅ TEST endpoint
app.post("/sync", async (req, res) => {
  try {
    // Log the request to check it arrives correctly
    console.log("Incoming JSON:", req.body);

    const { player, action, sacredLogs } = req.body;

    // 🔹 Validate required fields
    if (!player || !action || !sacredLogs || !sacredLogs.type) {
      return res.status(400).json({ 
        status: "error", 
        error: "Missing required fields in body"
      });
    }

    // ✅ Push to Realtime DB
    await db.ref("sacredLogs").push({
      player,
      action,
      ...sacredLogs,
      timestamp: Date.now()
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