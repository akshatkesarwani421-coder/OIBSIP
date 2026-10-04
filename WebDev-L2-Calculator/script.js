const display = document.getElementById("display");

let currentInput = "0";
let previousInput = "";
let operator = null;

function updateDisplay() {
  display.textContent = currentInput;
}

function appendNumber(num) {
  if (currentInput === "0") {
    currentInput = num;
  } else {
    currentInput += num;
  }
  updateDisplay();
}

const numberButtons = document.querySelectorAll("[data-number]");

numberButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    appendNumber(button.dataset.number);
  });
});
function clear() {
  currentInput = "0";
  previousInput = "";
  operator = null;
  updateDisplay();
}

function backspace() {
  currentInput = currentInput.slice(0, -1);

  if (currentInput === "") {
    currentInput = "0";
  }

  updateDisplay();
}

function addDecimal() {
  if (!currentInput.includes(".")) {
    currentInput += ".";
  }

  updateDisplay();
}

const actionButtons = document.querySelectorAll("[data-action]");

actionButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    if (button.dataset.action === "clear") {
      clear();
    } else if (button.dataset.action === "backspace") {
      backspace();
    } else if (button.dataset.action === "decimal") {
      addDecimal();
    }
  });
});