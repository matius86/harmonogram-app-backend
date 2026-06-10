import express from "express";
import { loadUsers, saveUsers } from "./users-app.js";
import { run } from "./worker.js";

const app = express();
app.use(express.json());

// ⭐ REJESTRACJA FCM
app.post("/register-fcm", (req, res) => {
  console.log("🔥 /register-fcm hit");
  console.log("📥 Body:", req.body);

  const { userId, fcmToken, locality } = req.body;

  if (!userId || !fcmToken || !locality) {
    console.log("❌ Missing fields");
    return res.status(400).json({ error: "Missing userId, fcmToken or locality" });
  }

  let users = loadUsers();

  // Usuń stare wpisy tego userId
  users = users.filter(u => u.userId !== userId);

  // Dodaj nowy wpis
  users.push({
    userId,
    fcmToken,
    locality,
    updatedAt: new Date().toISOString()
  });

  saveUsers(users);

  console.log("🔥 User saved:", { userId, locality });
  res.json({ ok: true });
});

// ⭐ DEBUG USERS
app.get("/debug-users", (req, res) => {
  console.log("🔥 /debug-users hit");

  const users = loadUsers();

  res.json({
    count: users.length,
    users,
  });
});

// ⭐ CRON /run-worker
app.get("/run-worker", async (req, res) => {
  const type = req.query.type;

  console.log("🔥 /run-worker hit, type:", type);

  if (!type || !["Evening", "Morning"].includes(type)) {
    console.log("❌ Invalid type");
    return res.status(400).json({ error: "Invalid type. Use Evening or Morning." });
  }

  try {
    await run(type);
    console.log(`🔥 Worker finished for type: ${type}`);
    res.json({ ok: true });
  } catch (e) {
    console.error("❌ Worker error:", e);
    res.status(500).json({ error: "Worker failed" });
  }
});

// ⭐ TEST FCM
app.get("/test-fcm", async (req, res) => {
  console.log("🔥 /test-fcm endpoint hit");

  try {
    await run("Morning");
    console.log("🔥 run('Morning') finished");
    res.send("OK");
  } catch (e) {
    console.error("❌ test-fcm error:", e);
    res.status(500).send("ERROR");
  }
});

app.listen(10000, () => {
  console.log("🔥 Backend listening on 10000");
});
