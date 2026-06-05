import { sendFcm } from "./fcmClient.js";
import { loadUsers } from "./users-app.js";

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
    console.log("🔥 Sending to user:", user);

    const ok = await sendFcm({
      fcmToken: user.fcmToken,
      title: "Test powiadomienia",
      body: "To jest test FCM",
      type: "test",
      wasteType: "",
      date: "",
    });

    if (!ok) {
      console.log("⚠ Pominięto użytkownika — token nieważny lub błąd FCM");
    }
  }

  console.log("🔥 Worker finished");
}
