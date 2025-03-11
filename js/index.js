'use strict';

const screenCurrent = document.querySelector('.screen-current');
const screenPrevious = document.querySelector('.screen-previous');

const arrBtn = document.querySelectorAll('.buttons .btn');

// On utilise null pour indiquer qu'aucune valeur n'est encore saisie.
let a = null,
  b = null,
  currentOperation = null,
  shouldResetScreen = false;

for (const btn of arrBtn) {
  btn.addEventListener('click', () => printScreen(btn.textContent));
}
// ****************************
// KEYBOARD EVENT LISTENER
// ****************************
document.addEventListener('keydown', function (event) {
  let key = event.key;
  if (!isNaN(Number(key)) && screenCurrent.textContent.length < 10) {
    printScreen(key);
  } else if (key === 'Enter') {
    printScreen('=');
  } else if (key === 'Backspace') {
    deleteLastDigit();
  } else if (key === 'Escape') {
    printScreen('=');
  } else if (['+', '-', '*', '/', '%', '^', '.'].includes(key)) {
    printScreen(key);
  }
});

function printScreen(value) {
  console.log(value);

  // Si une opération vient d'être effectuée, on efface l'écran courant pour la prochaine saisie
  if (shouldResetScreen) {
    screenCurrent.textContent = '0';
    shouldResetScreen = false;
  }

  // Si le bouton cliqué représente un nombre (on convertit explicitement en nombre)
  if (!isNaN(Number(value)) && screenCurrent.textContent.length < 16) {
    // Si l'écran affiche "0", on le remplace
    if (screenCurrent.textContent === '0') {
      screenCurrent.textContent = '';
    }
    screenCurrent.textContent += value;
  } else {
    // Gestion du point décimal
    if (value === '.' && screenCurrent.textContent.includes('.')) {
      screenCurrent.textContent += value;
    }
    // Réinitialisation (AC ou delete-all)

    if (value === 'AC') {
      clearAll();
      return;
    }
    if (value === 'C') {
      deleteLastDigit();
    }
    if (value === '=') {
      // Si c'est le bouton égal, on effectue le calcul
      if (a !== null && currentOperation !== null) {
        b = screenCurrent.textContent;
        let result = transformer(Number(a), Number(b), currentOperation);
        screenPrevious.textContent = `${a} ${currentOperation} ${b} =`;
        screenCurrent.textContent = result;
        a = result;
        currentOperation = null;
        shouldResetScreen = true;
      }
      return;
    }
    // Si c'est un opérateur (plus, minus, multiply, divide, percentage, hat)
    if (['+', '-', '*', '/', '%', '^'].includes(value)) {
      // Si c'est la première opération, on stocke le premier nombre
      if (a === null) {
        a = screenCurrent.textContent;
      } else if (currentOperation !== null) {
        // Si une opération est déjà en cours, on effectue le calcul partiel
        b = screenCurrent.textContent;
        let result = transformer(Number(a), Number(b), currentOperation);
        a = result;
        screenCurrent.textContent = result;
      }
      // Définir l'opérateur courant en fonction du bouton cliqué
      currentOperation = value;
      // Mettre à jour l'écran historique
      screenPrevious.textContent = `${a} ${currentOperation}`;
      shouldResetScreen = true;
    }
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
  a = null;
  b = null;
  currentOperation = null;
  shouldResetScreen = false;
}

function transformer(a, b, operation) {
  let result = 0;
  switch (operation) {
    case '+':
      result = a + b;
      break;
    case '-':
      result = a - b;
      break;
    case '/':
      if (b === 0) {
        result = 'Error';
      } else {
        result = a / b;
      }
      break;
    case '*':
      result = a * b;
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
