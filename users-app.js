import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔥 TRWAŁY PLIK — MUSI BYĆ W REPO: /data/users-app.json
const DATA_DIR = path.join(__dirname, "data");
const FILE = path.join(DATA_DIR, "users-app.json");

// 🔥 Upewnij się, że katalog data istnieje
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

// 🔥 Upewnij się, że plik istnieje
if (!fs.existsSync(FILE)) {
  fs.writeFileSync(FILE, "[]");
}

export function loadUsers() {
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf8"));
  } catch (e) {
    console.log("❌ loadUsers error:", e);
    return [];
  }
}

export function saveUsers(users) {
  try {
    fs.writeFileSync(FILE, JSON.stringify(users, null, 2));
  } catch (e) {
    console.log("❌ saveUsers error:", e);
  }
}

export function registerUserFcm(userId, fcmToken, locality) {
  const users = loadUsers();
  let user = users.find((u) => u.userId === userId);

  if (!user) {
    user = { userId, fcmToken, locality };
    users.push(user);
  } else {
    user.fcmToken = fcmToken;
    if (locality) user.locality = locality;
  }

  saveUsers(users);
}

export function getAllUsers() {
  return loadUsers();
}
