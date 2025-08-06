import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json({ limit: "1mb" })); // Safe JSON parsing

// Health check
app.get("/", (req, res) => {
  res.send("🔥 Sacred MMO Server is ALIVE 🔥");
});

// Core MMO Sync
app.post("/sync", (req, res) => {
  try {
    console.log("Incoming raw body:", req.body);

    // Decode if needed
    let data = req.body;
    if (typeof data === "string") {
      try {
        data = JSON.parse(data);
      } catch (err) {
        console.error("JSON parse error:", err.message);
        return res.status(400).json({ 
          status: "error", 
          message: "Invalid JSON format", 
          raw: req.body 
        });
      }
    }

    const { player, action, type, realm } = data;

    if (!player || !action || !type || !realm) {
      console.error("Missing fields:", data);
      return res.status(400).json({ 
        status: "error", 
        message: "Missing required fields", 
        received: data 
      });
    }

    // Sacred MMO log
    console.log("Sacred Log Received:", data);

    // ✅ Always respond to avoid timeout
    return res.status(200).json({
      status: "success",
      message: "Sacred log received",
      received: data
    });

  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({
      status: "error",
      message: "Internal server crash prevented",
      details: err.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🔥 Sacred MMO Server running on ${PORT} 🔥`);
});