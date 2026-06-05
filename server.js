import express from "express";
import { run } from "./worker.js";

const app = express();

app.get("/test-fcm", async (req, res) => {
  console.log("🔥 /test-fcm endpoint hit");

  try {
    await run("morning");
    console.log("🔥 run('morning') finished");
    res.send("OK");
  } catch (e) {
    console.error("❌ test-fcm error:", e);
    res.status(500).send("ERROR");
  }
});

app.listen(10000, () => {
  console.log("🔥 Backend listening on 10000");
});
