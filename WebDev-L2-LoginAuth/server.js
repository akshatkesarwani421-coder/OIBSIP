const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const USERS_FILE = path.join(__dirname, "data", "users.json");

app.use(express.json());
app.use(session({
  secret: "change-this-secret-in-real-life",
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 }
}));
app.use(express.static(path.join(__dirname, "public")));

function readUsers() {
  try {
    const data = JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}
function writeUsers(users) {
  fs.mkdirSync(path.join(__dirname, "data"), { recursive: true });
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}
// ROUTES WILL GO HERE (steps 4 and 6)

app.post("/api/register", async function (req, res) {
  const username = String(req.body.username || "").trim();
  const password = String(req.body.password || "");

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required"
    });
  }

  if (password.length < 8 || !/\d/.test(password)) {
    return res.status(400).json({
      message: "Password needs 8+ characters and 1 number"
    });
  }

  const users = readUsers();

  const userExists = users.some(function (user) {
    return user.username.toLowerCase() === username.toLowerCase();
  });

  if (userExists) {
    return res.status(409).json({
      message: "Username already exists"
    });
  }

  const hash = await bcrypt.hash(password, 10);

  users.push({
    username: username,
    passwordHash: hash
  });

  writeUsers(users);

  return res.status(201).json({
    message: "Registered successfully"
  });
});


app.listen(PORT, function () {
  console.log("Server running at http://localhost:" + PORT);
});