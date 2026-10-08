const form = document.getElementById("login-form");
const message = document.getElementById("message");

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  const response = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: username, password: password })
  });

  const result = await response.json();
  message.textContent = result.message;

  if (response.ok) {
    window.location.href = "/dashboard";
  }
});
