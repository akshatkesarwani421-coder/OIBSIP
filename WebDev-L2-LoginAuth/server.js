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
  secret: process.env.SESSION_SECRET || "dev-only-change-me",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60
  }
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

function requireAuth(req, res, next) {
  if (req.session.username) {
    return next();
  }

  res.redirect("/login.html");
}

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

app.post("/api/login", async function (req, res) {
  const username = String(req.body.username || "").trim();
  const password = String(req.body.password || "");

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required"
    });
  }

  const user = readUsers().find(function (savedUser) {
    return savedUser.username.toLowerCase() === username.toLowerCase();
  });

  const match = user
    ? await bcrypt.compare(password, user.passwordHash)
    : false;

  if (!user || !match) {
    return res.status(401).json({
      message: "Invalid username or password"
    });
  }

  req.session.regenerate(function (err) {
    if (err) {
      return res.status(500).json({
        message: "Could not start session"
      });
    }

    req.session.username = user.username;
    res.json({ message: "Logged in" });
  });
});

app.get("/dashboard", requireAuth, function (req, res) {
  res.set("Cache-Control", "no-store");
  res.sendFile(path.join(__dirname, "views", "dashboard.html"));
});

app.get("/api/me", function (req, res) {
  if (!req.session.username) {
    return res.status(401).json({ message: "Not logged in" });
  }

  res.json({ username: req.session.username });
});

app.post("/api/logout", function (req, res) {
  req.session.destroy(function (err) {
    if (err) {
      return res.status(500).json({ message: "Could not log out" });
    }

    res.clearCookie("connect.sid");
    res.json({ message: "Logged out" });
  });
});

app.get("/", function (req, res) {
  res.redirect("/login.html");
});

app.listen(PORT, function () {
  console.log("Server running at http://localhost:" + PORT);
});
