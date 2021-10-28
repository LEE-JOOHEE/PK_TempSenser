"use strict";

let currentOp = "",
  currentVal = 0;

function digitBtnHandler() {
  const digits = document.querySelectorAll(".digit");
  digits.forEach((digit) => {
    digit.addEventListener("click", (evt) => {
      const display = document.querySelector(".display");
      let targetDigit = evt.target.innerText;
      display.value += targetDigit;
      // displayFormat(targetDigit);
    });
  });
}

function clearBtnHandler() {
  const clearBtn = document.querySelector(".clear");
  clearBtn.addEventListener("click", () => {
    const display = document.querySelector(".display");
    currentOp = "";
    currentVal = 0;
    display.value = "";
  });
}

function decimalBtnHandler() {
  const decimalBtn = document.querySelector(".decimal");
  decimalBtn.addEventListener("click", () => {
    const display = document.querySelector(".display");
    let displayVal = display.value;
    if (!displayVal.includes(".")) {
      let addDecimal = display.value + ".";
      display.value = addDecimal;
    }
  });
}

function init() {
  digitBtnHandler();
  clearBtnHandler();
  decimalBtnHandler();
}

init();
