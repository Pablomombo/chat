import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import 'bootstrap';
import '../css/App.css';
import Chat from './Chat';

class App extends React.Component {

  constuctor() {
    this.routeChange = this.routeChange.bind(this);
  }
  nextPath(path) {
    this.props.history.push(path);    
  }
  render(){
    return (
      <React.Fragment>
        <div className="App">
          <header className="App-header">
            <p>Give your name to have access to the chat</p>
            <form>
              <input id = "name" class="form-control" placeholder="Name"/>
              <button id="send" class="btn btn-primary" onClick= {() => this.nextPath ('/chat') }>Login</button>
            </form>
            <Chat/>
          </header>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(App);
