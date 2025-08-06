import express from "express";
import admin from "firebase-admin";

const app = express();
app.use(express.json());

// 1️⃣ Check environment variable first
if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY_B64) {
  console.error("❌ ERROR: FIREBASE_SERVICE_ACCOUNT_KEY_B64 is missing!");
  process.exit(1); // Stop the server if the key is missing
}

// 2️⃣ Decode Base64 JSON key
let serviceAccount;
try {
  const rawKey = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY_B64, "base64").toString("utf8");
  serviceAccount = JSON.parse(rawKey);

  // 3️⃣ Fix private key formatting
  if (serviceAccount.private_key) {
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
  } else {
    console.error("❌ ERROR: private_key is missing in the service account JSON!");
    process.exit(1);
  }
} catch (error) {
  console.error("❌ Failed to parse Firebase key from Base64:", error);
  process.exit(1);
}

// 4️⃣ Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://sacredsystemmmo-default-rtdb.firebaseio.com"
});

const db = admin.database();

// 5️⃣ Endpoint to sync data
app.post("/sync", async (req, res) => {
  try {
    const { player, action, type } = req.body;

    if (!player || !action || !type) {
      return res.status(400).json({ status: "error", error: "Missing required fields" });
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