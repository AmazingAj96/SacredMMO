import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import admin from "firebase-admin";

// ✅ Initialize Firebase Admin
import serviceAccount from "./serviceAccountKey.json" assert { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://sacredsystemmmo-default-rtdb.firebaseio.com/"
});

const db = admin.database();

// ✅ Initialize Express
const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Root Test Endpoint
app.get("/", (req, res) => {
  res.send("🔥 Sacred MMO Relay Server (Realtime DB) is LIVE 🔥");
});

// ✅ Relay Endpoint (Logs to Console + Realtime DB)
app.post("/relay", async (req, res) => {
  const logEntry = req.body;

  // 1️⃣ Log to Render Console
  console.log("📥 Incoming Relay Log:", logEntry);

  // 2️⃣ Respond immediately to ReqBin / client
  res.status(200).json({
    status: "success",
    received: logEntry
  });

  // 3️⃣ Save to Realtime Database
  try {
    const ref = db.ref("sacredLogs").push(); // auto-generates unique key
    await ref.set({
      ...logEntry,
      timestamp: new Date().toISOString()
    });
    console.log("✅ Saved to Realtime DB:", ref.key);
  } catch (error) {
    console.error("❌ Firebase RTDB Error:", error);
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Sacred MMO Relay (Realtime DB) running on port ${PORT}`);
});