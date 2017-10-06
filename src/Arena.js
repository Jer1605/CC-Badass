import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { isElementPresent } from './Services';
import Character from './App';
import './css/App.css';

class Arena extends Component {

  //Constructeur
  constructor(props){
      super(props);
      this.state = {
          readyToFight: false, // Perso selectionnés ou non
          firstPlayerCharacter: null,
          secndPlayerCharacter: null,
      }
  }

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
    this.removeClass('div[data-player="' + playerId + '"] .App-character img.active', 'active')
    event.target.className += ' active'

    playerId === 0 ? this.setState({firstPlayerCharacter: index}, () => this.checkFightReady()) : this.setState({secndPlayerCharacter: index}, () => this.checkFightReady())
  }

  // Supprime toutes les classes actives des persos d'un player
  removeClass = (selector, className) => {
    let els = Array.prototype.slice.call(document.querySelectorAll(selector));
    for (var i = 0, l = els.length; i < l; i++) {
      let el = els[i]
      el.className = el.className.replace(
        new RegExp('(^|\\s+)' + className + '(\\s+|$)', 'g'),
        '$1'
      )
    }
  }

  setFight = () => {
    let firstFighter = this.props.characters[this.state.firstPlayerCharacter]
    let secndFighter = this.props.characters[this.state.secndPlayerCharacter]

    this.props.initiateFight(firstFighter, secndFighter);
  }

  getCharactersId = () => {
    let characterIds = new Array();
    characterIds.push()
  }

  //Affiche la liste de tous les persos dans l'Arene
  displayCharacters = (playerId) => {
    let characterToDisplay = this.props.characters.map(
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

  render = () => {
    return(
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
  }

}

export default Arena;
