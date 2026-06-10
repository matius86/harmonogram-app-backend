import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔥 Stała ścieżka do pliku w repo
const DATA_DIR = path.join(__dirname, "data");
const FILE = path.join(DATA_DIR, "users-app.json");

// 🔥 NIE TWORZYMY katalogu ani pliku automatycznie
// Render przy starcie może jeszcze nie mieć finalnej struktury
// Jeśli plik nie istnieje → zwracamy pustą tablicę

export function loadUsers() {
  try {
    if (!fs.existsSync(FILE)) {
      console.log("⚠ users-app.json nie istnieje — zwracam []");
      return [];
    }
    return JSON.parse(fs.readFileSync(FILE, "utf8"));
  } catch (e) {
    console.log("❌ loadUsers error:", e);
    return [];
  }
}

export function saveUsers(users) {
  try {
    // zapisujemy TYLKO jeśli katalog istnieje
    if (fs.existsSync(DATA_DIR)) {
      fs.writeFileSync(FILE, JSON.stringify(users, null, 2));
    } else {
      console.log("⚠ DATA_DIR nie istnieje — pomijam zapis");
    }
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
