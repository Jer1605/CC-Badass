import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { createFDBIfNecessary, getAllCharactersFromFDB, removeClass, randomDice } from './Services';
import Header from './Header';
import Result from './Result';
import './css/App.css';


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      characters: [],
      readyToFight: false, // Perso selectionnés ou non
      firstPlayerCharacter: null,
      secndPlayerCharacter: null,
      resume: 'RESUME WILL BE HERE',
      fightEnd: false,
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
  getDamages = (attacker, defender, cc = false) => {
    let defenderArmour = defender.stats.armour
    let attackerStrength = attacker.stats.strength

    if(cc) attackerStrength *= 2
    let damages = Math.ceil(attackerStrength / 10) - Math.ceil(defenderArmour / 100)

    return damages;
  }

  //Démarre le combat
  setFight = () => {
    let firstFighter = this.state.characters[this.state.firstPlayerCharacter]
    let secndFighter = this.state.characters[this.state.secndPlayerCharacter]

    this.initiateFight(firstFighter, secndFighter)
  }

  //Initialise le combat
  initiateFight = (firstFighter, secndFighter) => {
    let whoseRound =  randomDice(1, 2)

    while(firstFighter.stats.health > 0 && secndFighter.stats.health > 0){
      1 === whoseRound ? whoseRound = this.runRound(firstFighter, secndFighter, whoseRound) : whoseRound = this.runRound(secndFighter, firstFighter, whoseRound)
    }
  }

  // Lance les actions définies pour un round
  runRound = (attacker, defender, whoseRound) => {
    let hit = false
    let cc = false
    let damages

    hit = randomDice(0, 100) <= this.getHitChances(attacker, defender)
    cc = randomDice(0, 100) <= this.getCriticalChances(attacker, defender)
    damages = this.getDamages(attacker, defender, cc)

    if(hit) defender.stats.health -= damages

    //console.log(defender.name + ' : ' + defender.stats.health)

    if(0 >= defender.stats.health)
    {
      console.log(attacker.name + ' A GAGNE !!!!!')
      this.setState({fightEnd: true}, () => {console.log('TEST: ' + this.state.fightEnd)})
    }

    //on passe la main à l'autre fighter
    return 1 === whoseRound ? 2 : 1
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

  displayFightResult = () => {
    if(this.state.fightEnd){
      console.log('AAA')
      return <Redirect push to="/result" />
    }
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
          <Route exact path="/result" render = {() => (
            <Result
              resume = {this.state.resume}
            />
          )}>
          </Route>
          {this.displayFightResult()}
        </div>
      </Router>
    )
  }
}

export default App;
