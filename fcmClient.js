import admin from "firebase-admin";

const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_JSON);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export async function sendFcm({ fcmToken, title, body, type, wasteType, date }) {
  console.log("🔥 sendFcm() using firebase-admin");

  const message = {
    token: fcmToken,
    notification: { title, body },
    data: {
      type: type || "",
      wasteType: wasteType || "",
      date: date || "",
    },
  };

  const response = await admin.messaging().send(message);
  console.log("🔥 Firebase response:", response);

  return response;
}
