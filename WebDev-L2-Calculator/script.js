const display = document.getElementById("display");

let currentInput = "0";
let previousInput = "";
let operator = null;
let shouldResetInput = false;

function updateDisplay() {
  display.textContent = currentInput;
}

function appendNumber(num) {
  if(shouldResetInput === true) {
    currentInput = num;
    shouldResetInput = false;
  } else if (currentInput === "0"){
    currentInput = num;
  } else{
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
  shouldResetInput = false;
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
  if (shouldResetInput === true) {
    currentInput = "0.";
    shouldResetInput = false;
  } else if (!currentInput.includes(".")) {
    currentInput += ".";
  }

  updateDisplay();
}

function calculate(a, b, op) {
  let result;

  switch (op) {
    case "+":
      result = a + b;
      break;

    case "-":
      result = a - b;
      break;

    case "*":
      result = a * b;
      break;

    case "/":
      if (b === 0) {
        return "Error";
      }
      result = a / b;
      break;

    default:
      return NaN;
  }

  return parseFloat(result.toFixed(10));
}

function handleOperator(nextOperator) {
     
  // Error ke baad operator press hua to calculator reset hoga
  if (currentInput === "Error") {
    clear();
    return;
  }

  // Example: 2 + 3 × press karne par pehle 2 + 3 = 5
  if (operator !== null && shouldResetInput === false) {
    const result = calculate(
      parseFloat(previousInput),
      parseFloat(currentInput),
      operator
    );

    if (result === "Error") {
      currentInput = "Error";
      previousInput = "";
      operator = null;
      shouldResetInput = true;
      updateDisplay();
      return;
    }

    currentInput = String(result);
    updateDisplay();
  }

  previousInput = currentInput;
  operator = nextOperator;
  shouldResetInput = true;
}

function handleEquals() {
  // Operator missing hai, ya second number type nahi hua: kuch mat karo
  if (operator === null || shouldResetInput === true) {
    return;
  }

  const result = calculate(
    parseFloat(previousInput),
    parseFloat(currentInput),
    operator
  );

  if (result === "Error") {
    currentInput = "Error";
  } else {
    currentInput = String(result);
  }

  previousInput = "";
  operator = null;
  shouldResetInput = true;
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
    } else if (button.dataset.action === "equals") {
      handleEquals();
    }
  });
});

const operatorButtons = document.querySelectorAll("[data-operator]");

operatorButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    handleOperator(button.dataset.operator);
  });
});