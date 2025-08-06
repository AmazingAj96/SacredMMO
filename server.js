import express from "express";
import admin from "firebase-admin";

const app = express();
app.use(express.json());

// Load the Base64 environment variable and decode it
if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY_B64) {
  console.error("❌ Missing FIREBASE_SERVICE_ACCOUNT_KEY_B64 environment variable");
}
const serviceAccount = JSON.parse(
  Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY_B64, "base64").toString("utf8")
);

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://sacredsystemmmo-default-rtdb.firebaseio.com"
});

const db = admin.database();

// 🔹 Sync endpoint
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

// 🔹 Debug route to confirm environment variable is working
app.get("/debug-env", (req, res) => {
  const key = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_B64;
  if (!key) return res.status(500).send("❌ Env variable not found!");
  res.send(`✅ Env variable loaded! Length: ${key.length} characters`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🔥 Sacred MMO Cloud running on ${PORT}`)
);
