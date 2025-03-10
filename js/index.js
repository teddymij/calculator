'use strict';

const screenCurrent = document.querySelector('.screen-current');
const screenPrevious = document.querySelector('.screen-previous');

const ac = document.querySelector('#ac');
const arrBtn = document.querySelectorAll('.buttons .btn');

// On utilise null pour indiquer qu'aucune valeur n'est encore saisie.
let a = null,
  b = null,
  currentOperation = null,
  shouldResetScreen = false;

for (const btn of arrBtn) {
  btn.addEventListener('click', () => printScreen(btn));
}

function printScreen(btn) {
  // Si une opération vient d'être effectuée, on efface l'écran courant pour la prochaine saisie
  if (shouldResetScreen) {
    screenCurrent.textContent = '';
    shouldResetScreen = false;
  }

  // Si le bouton cliqué représente un nombre (on convertit explicitement en nombre)
  if (!isNaN(Number(btn.textContent))) {
    // Si l'écran affiche "0", on le remplace
    if (screenCurrent.textContent === '0') {
      screenCurrent.textContent = '';
    }
    screenCurrent.textContent += btn.textContent;
  } else {
    // Gestion du point décimal
    if (btn.id === 'period' && screenCurrent.textContent.indexOf('.') === -1) {
      screenCurrent.textContent += btn.textContent;
    }
    // Réinitialisation (AC ou delete-all)

    if (btn.id === 'ac' || btn.id === 'delete-all') {
      clearAll();
      return;
    }
    // Si c'est le bouton égal, on effectue le calcul
    if (btn.id === 'equals') {
      if (a !== null && currentOperation !== null) {
        b = screenCurrent.textContent;
        let result = transformer(Number(a), Number(b), currentOperation);
        screenPrevious.textContent += b + ' =';
        screenCurrent.textContent = result;
        a = result;
        currentOperation = null;
        shouldResetScreen = true;
      }
      return;
    }
    // Si c'est un opérateur (plus, minus, multiply, divide, percentage, hat)
    if (
      btn.id === 'plus' ||
      btn.id === 'minus' ||
      btn.id === 'multiply' ||
      btn.id === 'divide' ||
      btn.id === 'percentage' ||
      btn.id === 'hat'
    ) {
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
      currentOperation =
        btn.id === 'plus'
          ? '+'
          : btn.id === 'minus'
          ? '-'
          : btn.id === 'multiply'
          ? '*'
          : btn.id === 'divide'
          ? '/'
          : btn.id === 'percentage'
          ? '%'
          : btn.id === 'hat'
          ? '^'
          : null;
      // Mettre à jour l'écran historique
      screenPrevious.textContent = a + ' ' + currentOperation + ' ';
      shouldResetScreen = true;
    }
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
