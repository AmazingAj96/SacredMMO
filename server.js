import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import admin from "firebase-admin";

// ✅ Initialize Firebase Admin
import serviceAccount from "./serviceAccountKey.json" assert { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// ✅ Initialize Express
const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Root Test Endpoint
app.get("/", (req, res) => {
  res.send("🔥 Sacred MMO Relay Server is LIVE 🔥");
});

// ✅ Relay Endpoint (Logs to Console + Firebase)
app.post("/relay", async (req, res) => {
  const logEntry = req.body;

  // 1️⃣ Log to Render Console
  console.log("📥 Incoming Relay Log:", logEntry);

  // 2️⃣ Respond immediately to ReqBin / client
  res.status(200).json({
    status: "success",
    received: logEntry
  });

  // 3️⃣ Save to Firebase Firestore
  try {
    const docRef = db.collection("sacredLogs").doc();
    await docRef.set({
      ...logEntry,
      timestamp: new Date().toISOString()
    });
    console.log("✅ Saved to Firebase:", docRef.id);
  } catch (error) {
    console.error("❌ Firebase Error:", error);
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Sacred MMO Relay running on port ${PORT}`);
});