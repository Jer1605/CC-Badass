import React, { Component } from 'react'

class Result extends Component{

    render(){
        return(
            <div className="App">
              {this.props.resume}
            </div>
        )
    }

}

export default Result;
