import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { run } from "./worker.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// 🔥 KATALOG I PLIK NA DANE
const DATA_DIR = "/data";
const USERS_FILE = path.join(DATA_DIR, "users-app.json");

// 🔥 Upewnij się, że katalog /data istnieje
if (!fs.existsSync(DATA_DIR)) {
  console.log("📁 Tworzę katalog /data");
  fs.mkdirSync(DATA_DIR);
}

// 🔥 Upewnij się, że plik users-app.json istnieje
if (!fs.existsSync(USERS_FILE)) {
  console.log("📄 Tworzę plik users-app.json");
  fs.writeFileSync(USERS_FILE, "[]");
}

// 🔥 Wczytaj użytkowników
function loadUsers() {
  try {
    const data = fs.readFileSync(USERS_FILE, "utf8");
    return JSON.parse(data);
  } catch (e) {
    console.log("❌ loadUsers error:", e);
    return [];
  }
}

// 🔥 Zapisz użytkowników
function saveUsers(users) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (e) {
    console.log("❌ saveUsers error:", e);
  }
}

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

// ⭐ TEST FCM
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
