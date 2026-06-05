import admin from "firebase-admin";

// 🔥 Wczytujemy JSON z Rendera
const raw = process.env.SERVICE_ACCOUNT_JSON;
console.log("🔥 RAW LENGTH:", raw?.length);
console.log("🔥 RAW START:", raw?.substring(0, 200));

let serviceAccount;
try {
  serviceAccount = JSON.parse(raw);
  console.log("🔥 PARSED KEYS:", Object.keys(serviceAccount));
  console.log("🔥 private_key length:", serviceAccount.private_key?.length);
} catch (e) {
  console.error("❌ JSON PARSE ERROR:", e);
  throw e;
}

// 🔥 Inicjalizacja firebase-admin
if (!admin.apps.length) {
  console.log("🔥 Initializing firebase-admin…");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("🔥 firebase-admin initialized");
}

export async function sendFcm({ fcmToken, title, body, type, wasteType, date }) {
  console.log("🔥 sendFcm() using firebase-admin");
  console.log("🔥 Token:", fcmToken);
  console.log("🔥 Title:", title);
  console.log("🔥 Body:", body);

  const message = {
    token: fcmToken,
    notification: {
      title,
      body,
    },
    data: {
      type: type || "",
      wasteType: wasteType || "",
      date: date || "",
    },
  };

  console.log("🔥 Payload:", JSON.stringify(message, null, 2));

  try {
    const response = await admin.messaging().send(message);
    console.log("🔥 Firebase response:", response);
    return response;
  } catch (err) {
    console.error("❌ Firebase error:", err);
    throw err;
  }
}
