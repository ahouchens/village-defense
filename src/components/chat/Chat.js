import React, { Component } from 'react';
import './Chat.css';

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
   
      this.props.connection.send(
        JSON.stringify({
          type: 'chat-message',
          data: chatMessage
        })
      );


      this.setState({
        chatMessage: '',
        // disabled: 'disabled',
      });

      // we know that the first message sent from a user their name  
      if (this.state.chatName === false) {
        console.log('chatMessage!!!', chatMessage);
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

      if (socketMessage.type === 'current-player-character') {

      }

      if (socketMessage.type === 'message') {
        this.setState(prevState => ({
          chatHistory: [...prevState.chatHistory, socketMessage.data]
        }));
        this.scrollToBottom();
      }
    }
  }
  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
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
      <div className="chat">
        <div className="content">
          {this.state.chatHistory.map((chatHistoryItem) =>
            <p className="content-message" key={chatHistoryItem.time} >
              <span 
                style={{
                  color: 'rgb(' + chatHistoryItem.color + ')',
                  marginRight: '5px',
                  background: 'none'
                }}
              >
                {chatHistoryItem.author}
              </span> 
              {chatHistoryItem.text}
            </p>
          )}
          <div style={{ float:"left", clear: "both" }}
            ref={(el) => { this.messagesEnd = el; }}>
          </div>
        </div>
        <div className="chat-status-container">
          <div
            id="status" 
            className="chat-status"
            style={{
              color: 'rgb(' + this.state.authorColor + ')'
          }}>
            {this.statusText()}
          </div>
          <input
            className="chat-input"
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

export default Chat;