const defaultCharacters = require('./defaultCharacters.json'); //import des persos par défaut
const existCharacterFDB = localStorage.getItem('charactersFDB') !== null; // Check si la DB des persos à déjà été créée

/* COMMON FUNCTIONS */

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

// Retourne false si l'objet a est différent de l'objet b
function isObjectsEquals(a, b) {
  let flag = true;
  for (var prop in a)
  {
    if (a[prop] !== b[prop])
    {
      flag = false;
      break;
    }
  }
  return flag;
}

// Update la FDB
function updateFDB(newFDB) {
  typeof newFDB !== 'undefined' ? localStorage.setItem('charactersFDB', JSON.stringify(newFDB)) : null
}

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

// Sauvegarde tous les characters dans la FDB
export function saveAllCharacters(characters) {
  let FDBObject = getAllCharactersFromFDB();

  for(let i = 0; i < characters.length; i++)
  {
    characters[i].stats.health !== FDBObject[i].stats.health ? characters[i].stats.health = FDBObject[i].stats.health : null;

    // On met à jour les levels si lvl up il y a
    if(characters[i].xp.progress !== FDBObject[i].xp.progress)
    {
      var quotient = Math.floor(characters[i].xp.progress / 100);
      var remainder = characters[i].xp.progress % 100;

      console.log(characters[i].xp.lvl + ' + ' + quotient);
      characters[i].xp.lvl += quotient;
      characters[i].xp.progress = remainder;
    }

    !isObjectsEquals(characters[i], FDBObject[i]) ? FDBObject[i] = characters[i] : null;
  }

  updateFDB(FDBObject);
}

// Retourne un character s'il existe
export function getCharacterById(id) {
  let characters = getAllCharactersFromFDB();
  let character;

  for(character of characters)
  {
    if(character.id === id) return character
  }

  return false;
}
