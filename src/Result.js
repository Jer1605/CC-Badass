import React, { Component } from 'react'
import { saveAllCharacters, getCharacterById } from './Services';

class Result extends Component{

  displayResume = () => {
    try
    {
        let resume = this.props.fight.resume.map((obj, index) => {
          return(
            <p key={index} className="App-resumeItem">
              {obj}
            </p>
          )
        })
        return(resume)
    }
    catch(e)
    {
      return('Aucun match en cours')
    }
  }

  displayPlayerXP = (who) => {
    try
    {
      let character = getCharacterById(who)

      return(
        <div className="App-playerFightResume">
          <div className="App-introduce">
            <h3>{character.name}</h3>
            <p><small>{character.description}</small></p>
          </div>
          <div className="App-wonXP">
            <div className="grid-2">
              <div className="col"><p>Niveau</p></div>
              <div className="col">{character.xp.lvl}</div>
              <div className="col"><p>Expérience</p></div>
              <div className="col">{character.xp.progress}</div>
            </div>
          </div>
        </div>
      )
    }
    catch(e)
    {
      console.log('erreur : '+ e)
    }
  }

  componentDidMount = () => {

  }

  render(){
    // On sauvegare l'xp gagnée en FDB
    saveAllCharacters(this.props.characters)

    return(
      <div className="App">
        <div className="grid-3">
          <div className="App-player"><h2>WINNER</h2>{this.displayPlayerXP(this.props.fight.winnerId)}</div>
          <div className="App-resume">{this.displayResume()}</div>
          <div className="App-player"><h2>LOOSER</h2>{this.displayPlayerXP(this.props.fight.looserId)}</div>
        </div>
      </div>
    )
  }

}

export default Result;
