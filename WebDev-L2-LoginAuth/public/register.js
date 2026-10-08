const form = document.getElementById("register-form");
const message = document.getElementById("message");

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  const response = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: username, password: password })
  });
  const result = await response.json();

  message.textContent = result.message;
  if (response.ok) {
  setTimeout(function () {
    window.location.href = "login.html";
  }, 1000);
}

  // YOUR JOB: if response.ok is true, wait 1 second then go to login:
  // setTimeout(function () { window.location.href = "login.html"; }, 1000);
});
