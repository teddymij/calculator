'use strict';

// TODO:1/ change the SCREEN CURRENT
//  A : delete with AC 🆗
//  A : power with ^
//  A : pourcentage with %
//  A : divide with /
//  A : multiply with X
//  A : sustract with -
//  A : add with +
//  A : equal with =
//  A : delete all with
//  A : float all with . 🆗

const screenCurrent = document.querySelector('.screen-current');
const screenPrevious = document.querySelector('.screen-previous');

const ac = document.querySelector('#ac');
const arrBtn = document.querySelectorAll('.buttons .btn');

// null = aucune valeur saisi
let a = null;
let b = null;
let currentOperation = null;
let shouldResetScreen = false;

for (const btn of arrBtn) {
  btn.addEventListener('click', () => printScreen(btn));
}
function printScreen(btn) {
  if (shouldResetScreen) {
    screenCurrent.textContent = '';
    shouldResetScreen = false;
  }

  if (!isNaN(Number(btn.textContent))) {
    if (screenCurrent.textContent === '0') {
      screenCurrent.textContent = '';
    }
    screenCurrent.textContent += btn.textContent;
  } else {
    if (btn.id === 'period' && screenCurrent.textContent.indexOf('.') === -1)
      screenCurrent.textContent += btn.textContent;
    if (btn.id === 'ac') {
      screenCurrent.textContent = '0';
    }
    if (btn.id === 'delete-all') {
      screenCurrent.textContent = '0';
      screenPrevious.textContent = '0';
      a = 0;
      b = 0;
    }
    if (btn.id === 'equals') {
      printPrevious('=');
    }
    // operation
    if (btn.id === 'plus') {
      printPrevious('+');
    }
    if (btn.id === 'minus') {
      printPrevious('-');
    }
    if (btn.id === 'multiply') {
      printPrevious('*');
    }
    if (btn.id === 'divide') {
      printPrevious('/');
    }
    if (btn.id === 'percentage') {
      printPrevious('%');
    }
    if (btn.id === 'hat') {
      printPrevious('^');
    }
  }
}
function printPrevious(operation) {
  screenPrevious.textContent += screenCurrent.textContent;
  let result = 0;

  if (a === 0 && b === 0 && operation !== '=') {
    a = screenCurrent.textContent;
    screenCurrent.textContent = '';
  } else if (a !== 0 && b === 0) {
    b = screenCurrent.textContent;
    result = transformer(Number(a), Number(b), operation);
    a = result;
    b = 0;
    screenCurrent.textContent = result;
  }
  if (operation !== '=') {
    screenPrevious.textContent += operation;
  }
  console.log(`a = ${a} + b = ${b} = ${result}`);
}
function transformer(a, b, operation) {
  let result = 0;
  switch (operation) {
    case '+':
      result = addition(a, b);
      break;
    case '-':
      result = substract(a, b);
      break;
    case '/':
      if (b === 0) {
        result = 'Error';
      } else {
        result = divide(a, b);
      }
      break;
    case '*':
      result = multiply(a, b);
      break;
    case '=':
      result = a;
      break;
    case '%':
      result = a * (b / 100);
      break;
    case '^':
      result = Math.pow(a, b);
      break;
    default:
      result = 'Unknown operation';
  }
  return result;
}
