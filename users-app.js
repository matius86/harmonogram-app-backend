import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ZAWSZE zapisuje obok users-app.js
const FILE = path.join(__dirname, "users-app.json");

export function loadUsers() {
  if (!fs.existsSync(FILE)) {
    fs.writeFileSync(FILE, "[]");
  }
  return JSON.parse(fs.readFileSync(FILE, "utf8"));
}

export function saveUsers(users) {
  fs.writeFileSync(FILE, JSON.stringify(users, null, 2));
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
