const defaultCharacters = require('./defaultCharacters.json'); //import des persos par défaut
const existCharacterFDB = localStorage.getItem('charactersFDB') !== null; // Check si la DB des persos à déjà été créée

// Crée une database fictive en localStorage contenant les persos par défaut
export function createFDBIfNecessary() {
  if(!existCharacterFDB)
  {
    localStorage.setItem('charactersFDB', JSON.stringify(defaultCharacters));
  }
}

// Retourne tous les characters
export function getAllCharactersFromFDB() {
  if(!existCharacterFDB)
    createFDBIfNecessary();

  return JSON.parse(localStorage.getItem('charactersFDB'));
}

// Retourne true si l'élément est présent
export function isElementPresent(selector) {
  return document.querySelectorAll(selector).length > 0
}

// Supprime toutes les classes actives d'un element
export function removeClass(selector, className) {
  let els = Array.prototype.slice.call(document.querySelectorAll(selector));
  for (var i = 0, l = els.length; i < l; i++) {
    let el = els[i]
    el.className = el.className.replace(
      new RegExp('(^|\\s+)' + className + '(\\s+|$)', 'g'),
      '$1'
    )
  }
}

// Retourne un nombre aléatoire entre min et max
export function randomDice(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}
