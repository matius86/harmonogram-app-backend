import { getAllUsers } from "./users-app.js";
import { getPickupForDate, getNextAfter } from "./schedule.js";
import { sendFcm } from "./fcmClient.js";

export async function run(time) {
  const users = getAllUsers();

  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  for (const user of users) {
    if (!user.fcmToken || !user.locality) continue;

    const targetDate = time === "morning" ? today : tomorrow;

    const entry = getPickupForDate(user.locality, targetDate);
    if (!entry) continue;

    const next = getNextAfter(user.locality, targetDate);

    const title =
      time === "evening"
        ? "Jutro odbiór odpadów"
        : "Dzisiejszy odbiór odpadów";

    let body =
      time === "evening"
        ? `Jutro odbiór: ${entry.morning} (${entry.date})`
        : `Dziś odbiór: ${entry.morning} (${entry.date})`;

    if (next && time === "morning") {
      body += `\nNastępny: ${next.morning} (${next.date})`;
    }

    await sendFcm({
      fcmToken: user.fcmToken,
      title,
      body,
      type: time,
      wasteType: entry.morning,
      date: entry.date
    });
  }
}
