import React, { Component } from 'react';
import './MapGrid.css';

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
    let newTopPosition = this.state.topPosition;
    let newLeftPosition = this.state.leftPosition;
    let id = this.state.id;
    let newUserName = this.state.userName;
    let newColor = this.state.color; 
    let type = 'update-character';

    if (e.key === 'w' && this.isCurrentPlayerCharacter()) {
      newTopPosition = this.state.topPosition - this.state.speed;
    }

    if (e.key === 's' && this.isCurrentPlayerCharacter()) {
      newTopPosition = this.state.topPosition + this.state.speed;
    }
  
    if (e.key === 'a' && this.isCurrentPlayerCharacter()) {
      newLeftPosition = this.state.leftPosition - this.state.speed;
    }

    if (e.key === 'd' && this.isCurrentPlayerCharacter()) {
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
      type: 'update-character',
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


class GridTile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      
    };
  }
  render() {
    return(
      <div className="grid-tile">

      </div>
    );
  }
}

class MapGrid extends Component {
  constructor(props) {
    super(props);

    
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      playerCharacters: [],
      currentPlayerCharacter: {},
    };
    this.input = React.createRef();
  }


  handleChange(e) {
    this.setState({chatMessage: e.target.value});
  }
  componentDidUpdate(prevProps) {
    if (prevProps.socketMessage !== this.props.socketMessage) {
      let socketMessage = this.socketMessageObject();
      // console.log('socketMessage', socketMessage);

      if (!socketMessage) {
        return;
      }

      if (socketMessage.type === 'current-player-character') {
        console.log('current player character!');
        this.setState(prevState => ({
          currentPlayerCharacter: socketMessage
        }));
      }
      if (socketMessage.type === 'invoke-character') {
        this.setState(prevState => ({
          playerCharacters: [...prevState.playerCharacters, socketMessage],
        }));
      }

      if (socketMessage.type === 'update-character') {
        let index = this.state.playerCharacters.findIndex((character) => {
          return character.id === socketMessage.id;
        });

        let playerCharacters = [...this.state.playerCharacters];

        playerCharacters[index] = Object.assign(this.state.playerCharacters[index], {
          id: socketMessage.id,
          topPosition: socketMessage.topPosition,
          leftPosition: socketMessage.leftPosition,
          color: socketMessage.color
        });

        Object.assign(playerCharacters[index], {
          id: socketMessage.id,
          topPosition: socketMessage.topPosition,
          leftPosition: socketMessage.leftPosition,
          color: socketMessage.color
        });

       this.setState({ playerCharacters: playerCharacters });

      }

      if (socketMessage.type === 'remove-character') {
        let playerCharacterIndex = this.state.playerCharacters.findIndex((character) => {
          return character.id === socketMessage.id;
        });
        let playerCharacters = [...this.state.playerCharacters];
        playerCharacters.splice(playerCharacterIndex, 1);
        this.setState({ playerCharacters: playerCharacters });
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
  render() {
    return (
      <div className="grid"> 
        {this.state.playerCharacters.map((playerCharacter) =>
          <PlayerCharacter 
            id={playerCharacter.id}
            key={playerCharacter.id}
            topPosition={playerCharacter.topPosition}
            leftPosition={playerCharacter.leftPosition}
            color={playerCharacter.color}
            userName={playerCharacter.userName}

            connection={this.props.connection}
            currentPlayerCharacter={this.state.currentPlayerCharacter}
          /> 

        )}
        <div className="grid-tile-row">
          <GridTile />
          <GridTile />
          <GridTile />
          <GridTile />
          <GridTile />
          <GridTile />
          <GridTile />
          <GridTile />
          <GridTile />
          <GridTile />
        </div>
        <div className="grid-tile-row">
          <GridTile />
          <GridTile />
          <GridTile />
          <GridTile />
          <GridTile />
          <GridTile />
          <GridTile />
          <GridTile />
          <GridTile />
          <GridTile />
        </div>
        <div className="grid-tile-row">
          <GridTile />
          <GridTile />
          <GridTile />
          <GridTile />
          <GridTile />
          <GridTile />
          <GridTile />
          <GridTile />
          <GridTile />
          <GridTile />
        </div>
        <div className="grid-tile-row">
          <GridTile />
          <GridTile />
          <GridTile />
          <GridTile />
          <GridTile />
          <GridTile />
          <GridTile />
          <GridTile />
          <GridTile />
          <GridTile />
        </div>
      </div>
    );
  }
}

export default MapGrid;