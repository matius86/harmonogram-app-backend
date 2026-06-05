import fs from "fs";

export const ICONS = {
  Plastik: "🧴",
  Bio: "🌱",
  Zmieszane: "🗑️",
  Papier: "📄",
  Szkło: "🍾",
  Tekstylia: "🧵",
  Odzież: "👕",
  "Odpady wielkogabarytowe i elektroodpady": "🔌"
};

export function loadSchedule(locality) {
  const path = `harmonogramy/${locality}.json`;
  if (!fs.existsSync(path)) return null;
  return JSON.parse(fs.readFileSync(path, "utf8"));
}

export function getPickupForDate(locality, dateStr) {
  const schedule = loadSchedule(locality);
  if (!schedule) return null;
  return schedule.find((e) => e.date === dateStr) || null;
}

export function getNextAfter(locality, dateStr) {
  const schedule = loadSchedule(locality);
  if (!schedule) return null;
  return schedule.find((e) => e.date > dateStr) || null;
}

export function getNextPickup(locality) {
  const schedule = loadSchedule(locality);
  if (!schedule) return null;
  const today = new Date().toISOString().split("T")[0];
  return schedule.find((e) => e.date >= today) || null;
}