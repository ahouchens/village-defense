import React, { Component } from 'react';
import './App.css';
import Chat from './components/chat/Chat.js';
import MapGrid from './components/map-grid/MapGrid.js';

class WebSocketConnection extends Component {
  constructor(props) {
    super(props);

    let socketUrl = (window.location.protocol === "https:") ? "ws://" : "ws://" + window.location.host;
    // socketUrl = 'ws://localhost:5000';
  
    this.connection = new WebSocket(socketUrl);

    this.connection.onopen = this.onOpen;
    this.connection.onerror = this.onError;
    this.connection.onmessage = this.onMessage.bind(this);

    this.state = {
      socketMessage: { data: '' }
    };
  
  }
  onOpen() {
    console.log('Connection is opened...');
  }
  onError(error) {
    console.log('Connection error occured!', error);
  }

  onMessage(message) {
    this.setState({socketMessage: message});
  }
  render() {
    return (
      <div className="app-container"> 
        <MapGrid />
        <Chat 
          connection={this.connection}
          socketMessage={this.state.socketMessage.data}
        />
      </div>
    );
   }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { counter: 0 };
  }

  render() {
    return (
      <div>
        <WebSocketConnection socketMessage={this.state.socketMessage}/>
      </div>
    );
  }
}

export default App;
