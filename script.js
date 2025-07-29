const calculator = document.querySelector(".calculator");
const keys = calculator.querySelector(".calculator__keys");
const display = document.querySelector(".calculator__display");

function calculate(n1, operator, n2) {
  n1 = parseFloat(n1);
  n2 = parseFloat(n2);

  if (operator === "add") return n1 + n2;
  if (operator === "subtract") return n1 - n2;
  if (operator === "multiply") return n1 * n2;
  if (operator === "divide") return n1 / n2;
}

function getKeyType(key) {
  const action = key.dataset.action;
  if (!action) return "number";
  if (
    action === "add" ||
    action === "subtract" ||
    action === "multiply" ||
    action === "divide"
  )
    return "operator";
  return action;
}

function createResultString(key, displayedNum, state) {
  const keyType = getKeyType(key);
  const keyContent = key.textContent;
  const { firstValue, modValue, operator, previousKeyType } = state;

  if (keyType === "number") {
    return displayedNum === "0" ||
      previousKeyType === "operator" ||
      previousKeyType === "calculate"
      ? keyContent
      : displayedNum + keyContent;
  }

  if (keyType === "decimal") {
    if (!displayedNum.includes(".")) {
      return displayedNum + ".";
    }
    if (previousKeyType === "operator" || previousKeyType === "calculate") {
      return "0.";
    }
    return displayedNum;
  }

  if (keyType === "operator") {
    return firstValue &&
      operator &&
      previousKeyType !== "operator" &&
      previousKeyType !== "calculate"
      ? calculate(firstValue, operator, displayedNum)
      : displayedNum;
  }

  if (keyType === "clear") return "0";

  if (keyType === "calculate") {
    return firstValue
      ? previousKeyType === "calculate"
        ? calculate(displayedNum, operator, modValue)
        : calculate(firstValue, operator, displayedNum)
      : displayedNum;
  }
}

function updateCalculatorState(key, calculator, calculatedValue, displayedNum) {
  const keyType = getKeyType(key);
  const { firstValue, operator, previousKeyType } = calculator.dataset;
  calculator.dataset.previousKeyType = keyType;


  if (keyType === "number") {
    calculator.dataset.previousKeyType = "number";
  }
  if (keyType === "decimal") {
    calculator.dataset.previousKeyType = "decimal";
  }
  if (keyType === "operator") {
    calculator.dataset.previousKeyType = "operator";
  }
  if (keyType === "clear") {
    calculator.dataset.previousKeyType = "clear";
  }
  if (keyType === "calculate") {
    const modValue = calculator.dataset.modValue;
    calculator.dataset.modValue = firstValue && previousKeyType === "calculate" ? modValue : displayedNum;
    calculator.dataset.previousKeyType = "calculate";
  }

  if (keyType === "operator") {
    calculator.dataset.operator = key.dataset.action;
    calculator.dataset.firstValue =
      firstValue &&
      operator &&
      previousKeyType !== "operator" &&
      previousKeyType !== "calculate"
        ? calculatedValue
        : displayedNum;
  }

  if (keyType === "clear") {
    if (key.textContent === "AC") {
      calculator.dataset.firstValue = "";
      calculator.dataset.modValue = "";
      calculator.dataset.operator = "";
      calculator.dataset.previousKeyType = "";
    } else {
      key.textContent = "AC";
    }
  }

  if (keyType === "calculate") {
    calculator.dataset.modValue =
      firstValue && previousKeyType === "calculate" ? modValue : displayedNum;
  }
}

function updateVisualState(key, calculator) {

  const keyType = getKeyType(key);
  
  Array.from(keys.children).forEach((k) =>
    k.classList.remove("is-depressed")
  );

  if (keyType === "operator") {
    key.classList.add("is-depressed");
  }

  if (keyType === "clear" && key.textContent !== "AC") {
    key.textContent = "AC";
  }

  if (keyType !== "clear") {
    const clearButton = calculator.querySelector("[data-action=clear]");
    clearButton.textContent = "CE";
  }
}

keys.addEventListener("click", (e) => {
  if (!e.target.matches("button")) return;

  const key = e.target;
  const displayedNum = display.textContent;
  const resultString = createResultString(
    e.target,
    displayedNum,
    calculator.dataset
  );

  display.textContent = resultString;
  updateCalculatorState(key, calculator, resultString, display);
  updateVisualState(key, calculator);
});
