import React, { Component } from 'react';
import './App.css';

class WebSocketConnection extends Component {
  constructor(props) {
    super(props);

    this.connection = new WebSocket('ws://127.0.0.1:1337');
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
      <div>
        <Chat 
          connection={this.connection}
          socketMessage={this.state.socketMessage.data}
        />
      </div>
    );
   }
}

class Chat extends Component {
  constructor(props) {
    super(props);

    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      chatMessage: '',
      disabled: '',
      chatName: false,
      authorColor: false,
      chatHistory: [],
    };
    this.input = React.createRef();
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      let chatMessage = this.state.chatMessage;
      if (!chatMessage) {
        return;
      }
   
      this.props.connection.send(chatMessage);
      this.setState({
        chatMessage: '',
        // disabled: 'disabled',
      });

      // we know that the first message sent from a user their name  
      if (this.state.chatName === false) {
        this.setState({ chatName: chatMessage });
      }
    }
  }
  handleChange(e) {
    this.setState({chatMessage: e.target.value});
  }
  componentDidUpdate(prevProps) {
    if (prevProps.socketMessage !== this.props.socketMessage) {
      let socketMessage = this.socketMessageObject();

      if (!socketMessage) {
        return;
      }

      if (socketMessage.type === 'color') {
        this.setState({
          chatName: socketMessage.userName,
          authorColor: socketMessage.data
        });
      }

      if (socketMessage.type === 'history') {
        this.setState({
          chatHistory: socketMessage.data
        });
      }

      if (socketMessage.type === 'message') {
        this.setState(prevState => ({
          chatHistory: [...prevState.chatHistory, socketMessage.data]
        }));
      }
    }
  }
  socketMessageObject() {
    try {
      return JSON.parse(this.props.socketMessage);
    } catch (e) {
      console.log('Invalid JSON: ', this.props.socketMessage);
      return false;
    }
  }
  isUserConnected() {
    return !!this.socketMessageObject();
  }
  statusText() {
    if (this.state.chatName.length > 0) {
      return this.state.chatName;
    }
  
    return 'Enter name:';
  }
  render() {
    return (
      <div>
        <div id="content">
            {this.state.chatHistory.map((chatHistoryItem) =>
              <p key={chatHistoryItem.time} style={{color: chatHistoryItem.color}}>{chatHistoryItem.author}: {chatHistoryItem.text}</p>
            )}
        </div>
        <div>
          <span
            id="status" 
            style={{
              color: this.state.authorColor
          }}>
            {this.statusText()}
          </span>
          <input 
            type="text" 
            id="input" 
            value={this.state.chatMessage}
            disabled={this.state.disabled}
            onKeyPress={this.handleKeyPress}
            onChange={this.handleChange}
          />
        </div>
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
