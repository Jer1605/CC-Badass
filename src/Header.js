import React, { Component } from 'react';
import logo from './logo.svg';
import './css/App.css';

class Header extends Component {

  render() {
    return(
      <div className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>BADASS</h2>
      </div>
    )
  }

}

export default Header;
