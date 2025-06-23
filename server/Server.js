// server.js
import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 5001;
const PYTHON_SERVER = "http://localhost:8000";

app.use(cors());

// Proxy image analysis request to Python Flask server
app.get("/photos/analyze/:filename", async (req, res) => {
  const { filename } = req.params;
  console.log(`[REQUEST] Analyze photo: ${filename}`);

  try {
    const response = await fetch(`${PYTHON_SERVER}/analyze-image/${filename}`);
    const data = await response.json();
    console.log(`[RESPONSE] Analysis result for ${filename}:`, data);
    res.json(data);
  } catch (err) {
    console.error("[ERROR] Analysis failed:", err.message);
    res.status(500).json({ error: "Python server failed to analyze image" });
  }
});

// Stream image content from Python server
app.get("/photos/*", async (req, res) => {
  const filename = req.params[0];
  console.log(`[REQUEST] Fetch photo image: ${filename}`);

  try {
    const response = await fetch(`${PYTHON_SERVER}/process-image/${filename}`);
    if (!response.ok) {
      console.error(`[ERROR] Python server response error (${response.status}) for ${filename}`);
      return res.status(response.status).send("Failed to fetch image");
    }

    res.set("Content-Type", response.headers.get("content-type"));
    console.log(`[RESPONSE] Streaming image: ${filename}`);
    response.body.pipe(res);
  } catch (err) {
    console.error("[ERROR] Image fetch failed:", err.message);
    res.status(500).json({ error: "Python server failed to process image" });
  }
});

// Get entire photo index
app.get("/photo-index", async (req, res) => {
  console.log("[REQUEST] Fetch photo index");

  try {
    const response = await fetch(`${PYTHON_SERVER}/photo-index`);
    const data = await response.json();
    console.log("[RESPONSE] Photo index fetched. Count:", data.length);
    res.json(data);
  } catch (err) {
    console.error("[ERROR] Failed to fetch photo index:", err.message);
    res.status(500).json({ error: "Failed to get photo index" });
  }
});

// Rebuild index on demand
app.post("/photo-index/rebuild", async (req, res) => {
  console.log("[REQUEST] Rebuild photo index");

  try {
    const response = await fetch(`${PYTHON_SERVER}/photo-index/rebuild`, { method: "POST" });
    const data = await response.json();
    console.log("[RESPONSE] Photo index rebuilt. Count:", data.count);
    res.json(data);
  } catch (err) {
    console.error("[ERROR] Failed to rebuild photo index:", err.message);
    res.status(500).json({ error: "Failed to rebuild photo index" });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
