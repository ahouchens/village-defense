import React, { Component } from 'react';
import './PlayerCharacter.css';


class PlayerCharacter extends Component {
  constructor(props) {
    super(props);
    this.onKeyPress = this.onKeyPress.bind(this);

    this.state = {
      speed: 5,
      id: this.props.id,
      topPosition: this.props.topPosition,
      leftPosition: this.props.leftPosition,
      color: this.props.color,
      userName: this.props.userName,
      currentPlayerCharacter: this.props.currentPlayerCharacter
    };
  }
  componentWillReceiveProps(nextProps) {
    if(this.props !== nextProps) {
      this.setState({
        id: nextProps.id,
        topPosition: nextProps.topPosition,
        leftPosition: nextProps.leftPosition,
        color: nextProps.color,
        currentPlayerCharacter: nextProps.currentPlayerCharacter
      });
    }
  }
  isCurrentPlayerCharacter() {
    return this.state.currentPlayerCharacter.id === this.props.id;
  }
  onKeyPress(e) {
    if (!this.isCurrentPlayerCharacter()) {
      return;
    }

    let newTopPosition = this.state.topPosition;
    let newLeftPosition = this.state.leftPosition;
    let id = this.state.id;
    let newUserName = this.state.userName;
    let newColor = this.state.color; 
    let type = 'update-character';

    if (e.key === 'w') {
      newTopPosition = this.state.topPosition - this.state.speed;
    }

    if (e.key === 's') {
      newTopPosition = this.state.topPosition + this.state.speed;
    }
  
    if (e.key === 'a') {
      newLeftPosition = this.state.leftPosition - this.state.speed;
    }

    if (e.key === 'd') {
      newLeftPosition = this.state.leftPosition + this.state.speed;
    }

    this.setState({
      color: newColor,
      topPosition: newTopPosition,
      leftPosition: newLeftPosition,
      userName: newUserName,
      id: id,
      type: type,
    });

    this.props.connection.send(JSON.stringify({
      type: type,
      id: this.state.id,
      userName: this.state.userName,
      color: this.state.color,
      leftPosition: newLeftPosition,
      topPosition: newTopPosition,
    }));

  }
  render() {
    return(
      <div
        className="player-character"
        key={this.state.id}
        onKeyDown={this.onKeyPress}
        tabIndex="0"
        style={{
          backgroundColor: this.state.color,
          top: this.state.topPosition + 'px',
          left: this.state.leftPosition + 'px',
          WebkitTransition: 'all 0.7s ease-out'
        }}
        >
      </div>
    );
  }
}

export default PlayerCharacter;