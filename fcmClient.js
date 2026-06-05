import fetch from "node-fetch";
import { google } from "googleapis";
import fs from "fs";

const SCOPES = ["https://www.googleapis.com/auth/firebase.messaging"];
const SERVICE_ACCOUNT = JSON.parse(process.env.SERVICE_ACCOUNT_JSON);

async function getAccessToken() {
  const jwtClient = new google.auth.JWT(
    SERVICE_ACCOUNT.client_email,
    null,
    SERVICE_ACCOUNT.private_key,
    SCOPES,
    null
  );

  const tokens = await jwtClient.authorize();
  return tokens.access_token;
}

export async function sendFcm({ fcmToken, title, body, type, wasteType, date }) {
  const accessToken = await getAccessToken();

  const message = {
    message: {
      token: fcmToken,
      notification: {
        title,
        body
      },
      data: {
        type,
        wasteType,
        date
      }
    }
  };

  const url =
    "https://fcm.googleapis.com/v1/projects/harmonogramy-krokowa/messages:send";

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(message)
  });

  const text = await res.text();

  if (!res.ok) {
    console.error("❌ FCM ERROR:", res.status, text);
  } else {
    console.log("📨 FCM OK:", text);
  }
}
