import fs from "fs";

const FILE = "users-app.json";

export function loadUsers() {
  return JSON.parse(fs.readFileSync(FILE, "utf8"));
}

export function saveUsers(users) {
  fs.writeFileSync(FILE, JSON.stringify(users, null, 2));
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
