import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { createFDBIfNecessary, getAllCharactersFromFDB, isElementPresent, removeClass, randomDice } from './Services';
import Header from './Header';
import logo from './logo.svg';
import './css/App.css';


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      characters: [],
      readyToFight: false, // Perso selectionnés ou non
      firstPlayerCharacter: null,
      secndPlayerCharacter: null,
    }
  }

  // Initialise le state Characters qui contient la liste de tous les characters dispos
  setAllCharacters = () => {
    try {
      this.setState({characters: getAllCharactersFromFDB()})
    } catch(e) {
      console.log(e)
      this.setState({characters: getAllCharactersFromFDB()})
    }
  }

  // check si un perso a été sélectionné pour chauque player
  checkFightReady = () => {
    if(this.state.firstPlayerCharacter !== null
    && this.state.secndPlayerCharacter !== null)
    {
      this.setState({readyToFight: true})
    }
  }

  // Ajoute la classe active au perso et passe le state readyToFight a true, ce qui activera le bouton VS
  selectCharacter = (event, index, playerId) => {
    event.preventDefault()

    removeClass('div[data-player="' + playerId + '"] .App-character img.active', 'active')
    event.target.className += ' active'

    playerId === 0 ? this.setState({firstPlayerCharacter: index}, () => this.checkFightReady()) : this.setState({secndPlayerCharacter: index}, () => this.checkFightReady())
  }

  // Retourne la chance de toucher l'adversaire
  getHitChances = (attacker, defender) =>
  {
    let hitChances = Math.floor(attacker.stats.skills / (defender.stats.skills + defender.stats.agility) * 100)

    return hitChances
  }
  // Retourne la chance de coup critique
  getCriticalChances = (attacker, defender) => {
    let attackerChance = attacker.stats.luck
    let defenderChance = defender.stats.luck
    let criticalChances = attackerChance > defenderChance ? attackerChance - defenderChance : defenderChance - attackerChance

    return criticalChances
  }

  // Retourne les dégats pour le tour
  getDamages = (attacker, defender) => {
    let defenderArmour = defender.stats.armour
    let attackerStrength = attacker.stats.strength
    let damages = Math.ceil(attackerStrength / 10) - Math.ceil(defenderArmour / 100)

    return damages;
  }

  //Démarre le combat
  initiateFight = (firstFighter, secndFighter) => {
    console.log('Chances de toucher : ' + this.getHitChances(firstFighter, secndFighter))
    console.log('Chances de CC : ' + this.getCriticalChances(firstFighter, secndFighter))
    console.log('Dégats : ' + this.getDamages(firstFighter, secndFighter))

    // initiate who is giving the first hit
    randomDice(0, 1) = 0 ? firstFighter.startFight = true : secndFighter.startFight = true

    // initiate firstplayer
    while(firstFighter.stats.health > 0 || secndFighter.stats.healthh > 0){
      health--;
    }
  }

  //Démarre le combat
  setFight = () => {
    let firstFighter = this.state.characters[this.state.firstPlayerCharacter]
    let secndFighter = this.state.characters[this.state.secndPlayerCharacter]

    this.initiateFight(firstFighter, secndFighter);
  }

  //Affiche la liste de tous les persos dans l'Arene
  displayCharacters = (playerId) => {
    let characterToDisplay = this.state.characters.map(
      (obj, index) => {
        return(
          <div key={index} className="App-character">
            <img
              src={process.env.PUBLIC_URL + obj.image}
              alt="thumb"
              onClick={(e) => this.selectCharacter(e, index, playerId)}
            />
          </div>
        )
      })
    return(characterToDisplay)
  }

  componentDidMount = () => {
    createFDBIfNecessary();
    this.setAllCharacters();
  }

  // Render Arene
  render = () => {
    return (
      <Router>
        <div className="App">
          <Header />
          <Route exact path="/" render = {() =>
            (
              <section className="App-section">
                <div className="App-content">
                  <div className="grid-3">
                    <div className="App-characters grid-2" data-player={0}>{this.displayCharacters(0)}</div>
                    <div className="App-refery">
                      <button onClick={(e) => this.setFight()} className={(this.state.readyToFight ? 'App-btn enabled' : 'App-btn')}>VS</button>
                    </div>
                    <div className="App-characters grid-2" data-player={1}>{this.displayCharacters(1)}</div>
                  </div>
                </div>
              </section>
            )
          }></Route>
        </div>
      </Router>
    )
  }
}

export default App;
