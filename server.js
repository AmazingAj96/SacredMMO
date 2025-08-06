import express from "express";
import admin from "firebase-admin";

const app = express();
app.use(express.json());

// 1️⃣ Load JSON key from environment variable
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

// 2️⃣ Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://sacredsystemmmo.firebaseio.com" // replace if needed
});

const db = admin.firestore();

// 3️⃣ Sync route for MMO events
app.post("/sync", async (req, res) => {
  try {
    const { player, action, type } = req.body;

    // Save to Firestore
    await db.collection("events").add({
      player,
      action,
      type,
      timestamp: Date.now(),
    });

    res.json({ status: "ok", message: "Synced to Firestore!" });
  } catch (error) {
    console.error("Error syncing:", error);
    res.status(500).json({ status: "error", error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🔥 Sacred MMO Cloud running on ${PORT}`));
