import fetch from "node-fetch";

const FCM_SERVER_KEY = process.env.FCM_SERVER_KEY;

export async function sendFcm({ fcmToken, title, body, type, wasteType, date }) {
  if (!FCM_SERVER_KEY) {
    console.error("Brak FCM_SERVER_KEY w env");
    return;
  }

  const payload = {
    to: fcmToken,
    priority: "high",
    data: {
      title,
      body,
      type,
      wasteType,
      date
    }
  };

  const res = await fetch("https://fcm.googleapis.com/fcm/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `key=${FCM_SERVER_KEY}`
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    console.error("FCM error:", res.status, await res.text());
  }
}
