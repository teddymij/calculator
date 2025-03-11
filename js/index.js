'use strict';

// BUG : deux  =
// BUG : exponentiel si chiffre élèvé
const screenCurrent = document.querySelector('.screen-current');
const screenPrevious = document.querySelector('.screen-previous');
const arrBtn = document.querySelectorAll('.buttons .btn');

// On utilise null pour indiquer qu'aucune valeur n'est encore saisie.
let a = null,
  b = null,
  currentOperation = null,
  shouldResetScreen = false;

for (const btn of arrBtn) {
  btn.addEventListener('click', () => handleInput(btn.textContent));
}
// ****************************
// KEYBOARD EVENT LISTENER
// ****************************
document.addEventListener('keydown', event => {
  const key = event.key;
  if (!isNaN(key) && screenCurrent.textContent.length < 10) handleInput(key);
  else if (['+', '-', '*', '/', '%', '^', '.'].includes(key)) handleInput(key);
  else if (key === 'Enter' || key === 'Escape') handleInput('=');
  else if (key === 'Backspace') deleteLastDigit();
});

function handleInput(value) {
  // Si une opération vient d'être effectuée, on efface l'écran courant pour la prochaine saisie
  if (shouldResetScreen) resetScreen();

  // Si le bouton cliqué représente un nombre (on convertit explicitement en nombre)
  if (!isNaN(Number(value)) && screenCurrent.textContent.length < 10) {
    screenCurrent.textContent =
      screenCurrent.textContent === '0'
        ? value
        : screenCurrent.textContent + value;
  } else if (value === '.' && screenCurrent.textContent.includes('.')) {
    screenCurrent.textContent += value;
  } else if (value === 'AC') {
    clearAll();
  } else if (value === 'C') {
    deleteLastDigit();
  } else if (value === '=') {
    computeResult();
  } else if (['+', '-', '*', '/', '%', '^'].includes(value)) {
    setOperation(value);
  }
}
function resetScreen() {
  screenCurrent.textContent = '0';
  shouldResetScreen = false;
}

function setOperation(operator) {
  if (a === null) {
    a = screenCurrent.textContent;
  } else if (currentOperation) {
    a = computeResult();
  }
  currentOperation = operator;
  screenPrevious.textContent = `${a} ${operator}`;
  shouldResetScreen = true;
}

function computeResult() {
  if (a !== null && currentOperation !== null) {
    b = screenCurrent.textContent;
    let result = calculate(Number(a), Number(b), currentOperation);
    screenPrevious.textContent = `${a} ${currentOperation} ${b} =`;
    screenCurrent.textContent = result;
    a = result;
    currentOperation = null;
    shouldResetScreen = true;
    return result;
  }
}
function deleteLastDigit() {
  screenCurrent.textContent = screenCurrent.textContent.slice(0, -1);
  if (screenCurrent.textContent === '') {
    screenCurrent.textContent = '0';
  }
}
function clearAll() {
  screenCurrent.textContent = '0';
  screenPrevious.textContent = '';
  a = b = currentOperation = null;
  shouldResetScreen = false;
}

function calculate(a, b, operation) {
  if (operation === '/' && b === 0) return 'Error';
  const operations = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => a / b,
    '%': (a, b) => a * (b / 100),
    '^': (a, b) => Math.pow(a, b),
  };
  return operations[operation]
    ? operations[operation](a, b).toString().slice(0, 10)
    : 'Error';
}
