import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Root check (to prevent 502 idle issues)
app.get("/", (req, res) => {
  res.send("Sacred MMO server is running! 🌌");
});

// /sync endpoint - sends data to Firebase or your DB
app.post("/sync", async (req, res) => {
  try {
    const data = req.body;
    console.log("Incoming /sync data:", data);

    // Example Firebase forward (replace URL with your real Firebase)
    await fetch("https://your-firebase-url.firebaseio.com/logs.json", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    res.status(200).json({ status: "success", received: data });
  } catch (error) {
    console.error("Error in /sync:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

// /relay endpoint - parses event and forwards to /sync
app.post("/relay", async (req, res) => {
  try {
    const { player, action, type, realm } = req.body;
    if (!player || !action) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const formattedEvent = {
      timestamp: new Date().toISOString(),
      player,
      action,
      type: type || "MagicMoment",
      realm: realm || "Sacred Realm",
    };

    // Forward internally to /sync
    const response = await fetch(`http://localhost:${PORT}/sync`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formattedEvent),
    });

    const result = await response.json();
    res.status(200).json({ status: "relayed", result });
  } catch (error) {
    console.error("Error in /relay:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Sacred MMO server running on port ${PORT}`);
});