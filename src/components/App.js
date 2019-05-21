import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import '../css/App.css';

class LoginLayout extends Component {
  constuctor() {
    this.routeChange = this.routeChange.bind(this);
  }
  routeChange() {
    let path = `newPath`;
    this.props.history.push(path);
  }
  render(){
    return (
      <div className="App">
        <header className="App-header">
          <p>Give your name to have access to the chat</p>
          <form>
            <input id = "name" class="form-control" placeholder="Name"/>
            <button id="send" class="btn btn-success" onClick={this.routeChange}>Login</button>
          </form>
        </header>
      </div>
    );
  }
}

export default withRouter(LoginLayout);
