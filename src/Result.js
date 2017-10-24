import React, { Component } from 'react'
import { saveAllCharacters } from './Services';

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
    }
    catch(e)
    {
      console.log('erreur : '+ e)
    }
  }

  componentDidMount = () => {
    // On sauvegare l'xp gagnée en FDB
    saveAllCharacters(this.props.characters)
  }

  render(){
    return(
      <div className="App">
        <div className="grid-3">
          <div className="App-playerXP">{this.displayPlayerXP('attacker')}</div>
          <div className="App-resume">{this.displayResume()}</div>
          <div className="App-playerXP">{this.displayPlayerXP('defender')}</div>
        </div>
      </div>
    )
  }

}

export default Result;
