import { google } from "googleapis";

// 🔥 Najpierw pobieramy RAW
const raw = process.env.SERVICE_ACCOUNT_JSON;
console.log("🔥 RAW LENGTH:", raw?.length);
console.log("🔥 RAW START:", raw?.substring(0, 200));

// 🔥 Dopiero teraz parsujemy
let SERVICE_ACCOUNT;
try {
  SERVICE_ACCOUNT = JSON.parse(raw);
  console.log("🔥 PARSED KEYS:", Object.keys(SERVICE_ACCOUNT));
  console.log("🔥 private_key length:", SERVICE_ACCOUNT.private_key?.length);
} catch (e) {
  console.error("❌ JSON PARSE ERROR:", e);
  throw e;
}

const SCOPES = ["https://www.googleapis.com/auth/firebase.messaging"];

async function getAccessToken() {
  console.log("🔥 getAccessToken() start");
  console.log("🔥 client_email:", SERVICE_ACCOUNT.client_email);
  console.log("🔥 private_key exists:", !!SERVICE_ACCOUNT.private_key);

  const jwtClient = new google.auth.JWT(
    SERVICE_ACCOUNT.client_email,
    null,
    SERVICE_ACCOUNT.private_key,
    SCOPES,
    null
  );

  const tokens = await jwtClient.authorize();
  console.log("🔥 Access token OK");
  return tokens.access_token;
}

export async function sendFcm({ fcmToken, title, body, type, wasteType, date }) {
  console.log("🔥 sendFcm() called");

  const message = {
    message: {
      token: fcmToken,
      notification: { title, body },
      data: { type, wasteType, date },
    },
  };

  console.log("🔥 Payload:", JSON.stringify(message, null, 2));

  const accessToken = await getAccessToken();

  const response = await fetch(
    `https://fcm.googleapis.com/v1/projects/${SERVICE_ACCOUNT.project_id}/messages:send`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    }
  );

  const result = await response.text();
  console.log("🔥 Firebase response:", result);

  return result;
}
