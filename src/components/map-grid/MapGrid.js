import React, { Component } from 'react';
import './MapGrid.css';

class MapGrid extends Component {
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
      <div className="map-container"> 
        <div>
          Village Defense
        </div>
      </div>
    );
  }
}

export default MapGrid;