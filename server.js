import express from "express";
import admin from "firebase-admin";

const app = express();
app.use(express.json());

// Decode Base64 JSON key
const rawKey = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY_B64, "base64").toString("utf8");
const serviceAccount = JSON.parse(rawKey);

// FIX the private key formatting
serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://sacredsystemmmo-default-rtdb.firebaseio.com"
});

const db = admin.database();

// ===============================
// 🔹 /sync endpoint
// ===============================
app.post("/sync", async (req, res) => {
  try {
    const { player, action, type } = req.body;

    // Push to Firebase
    const ref = await db.ref("sacredLogs").push({
      player,
      action,
      type,
      timestamp: Date.now(),
    });

    console.log(`✅ Synced log from ${player}: ${action} (${type})`);

    res.json({ status: "ok", message: "Synced to Realtime Database!", key: ref.key });
  } catch (error) {
    console.error("❌ Error syncing:", error);
    res.status(500).json({ status: "error", error: error.message });
  }
});

// ===============================
// 🔹 Auto Relay Listener
// ===============================
// Whenever a new sacred log is added, echo it to the console (can later relay to MMO grid)
db.ref("sacredLogs").limitToLast(1).on("child_added", (snapshot) => {
  const newLog = snapshot.val();
  console.log(`🔔 Auto Relay: New Sacred Log ->`, newLog);
});

// ===============================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🔥 Sacred MMO Cloud running on port ${PORT}`);
});