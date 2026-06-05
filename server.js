// server.js
import express from "express";
import { registerUserFcm } from "./users-app.js";
import "./worker.js"; // uruchamia crony 06:00 i 18:00

const app = express();
app.use(express.json());

// test endpoint
app.get("/", (req, res) => {
  res.send("App backend OK");
});

// główny endpoint dla aplikacji
app.post("/register-fcm", (req, res) => {
  const { userId, fcmToken, locality } = req.body;

  if (!userId || !fcmToken || !locality) {
    return res.status(400).json({ error: "Missing userId, fcmToken or locality" });
  }

  registerUserFcm(userId, fcmToken, locality);

  res.json({ ok: true });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`App backend listening on ${PORT}`));
