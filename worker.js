import { sendFcm } from "./fcmClient.js";
import { loadUsers } from "./users-app.js";
import fs from "fs";
import path from "path";

// 🔥 Parsowanie daty jako CZAS LOKALNY (PL), nie UTC
function parseLocalDate(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d, 23, 59, 59); // dzień trwa do końca dnia
}

// 🔥 Wczytanie harmonogramu z plików JSON
function loadSchedule(locality) {
  try {
    const filePath = path.join("data", "schedule", `${locality}.json`);
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    console.log("❌ Brak harmonogramu dla:", locality);
    return [];
  }
}

// 🔥 Znajdź najbliższy odbiór (z poprawnym czasem lokalnym)
function findNextPickup(schedule) {
  const now = new Date();

  const upcoming = schedule.filter((item) => {
    const d = parseLocalDate(item.date);
    return d >= now;
  });

  if (upcoming.length === 0) return null;

  upcoming.sort((a, b) => parseLocalDate(a.date) - parseLocalDate(b.date));
  return upcoming[0];
}

export async function run(type) {
  console.log("🔥 Worker start, type:", type);

  const users = loadUsers();
  console.log("🔥 Users loaded:", users);

  if (!users || users.length === 0) {
    console.log("❌ No users found");
    return;
  }

  console.log(`🔥 Sending notifications to ${users.length} users`);

  for (const user of users) {
    console.log("🔥 Processing user:", user);

    const locality = user.locality;
    const schedule = loadSchedule(locality);

    if (!schedule || schedule.length === 0) {
      console.log("⚠ Brak harmonogramu dla:", locality);
      continue;
    }

    const next = findNextPickup(schedule);
    if (!next) {
      console.log("⚠ Brak przyszłych odbiorów dla:", locality);
      continue;
    }

    const nextDate = next.date;
    const nextType = next.type;

    let title = "";
    let body = "";
    let fcmType = "";

    if (type === "Evening") {
      title = "Jutro odbiór odpadów";
      body = `${nextType} — ${nextDate}`;
      fcmType = "Evening";
    }

    if (type === "Morning") {
      title = "Dziś odbiór odpadów";
      body = `${nextType} — ${nextDate}`;
      fcmType = "Morning";
    }

    console.log("📦 Payload:", {
      fcmType,
      nextType,
      nextDate,
      user: user.userId,
    });

    const ok = await sendFcm({
      fcmToken: user.fcmToken,
      title,
      body,
      type: fcmType,
      wasteType: nextType,
      date: nextDate,
    });

    if (!ok) {
      console.log("⚠ Pominięto użytkownika — token nieważny lub błąd FCM");
    }
  }

  console.log("🔥 Worker finished");
}
