import React, { Component } from 'react';
import PlayerCharacter from '../player-character/PlayerCharacter.js';
import GridTile from '../grid-tile/GridTile.js';
import './MapGrid.css';

class MapGrid extends Component {
  constructor(props) {
    super(props);

    this.state = {
      playerCharacters: [],
      currentPlayerCharacter: {},
    };
    this.input = React.createRef();
  }

  socketMessageObject() {
    try {
      return JSON.parse(this.props.socketMessage);
    } catch (e) {
      console.log('Invalid JSON: ', this.props.socketMessage);
      return false;
    }
  }
  update(socketMessage) {
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
  invoke(socketMessage) {
    this.setState(prevState => ({
      playerCharacters: [...prevState.playerCharacters, socketMessage],
    }));
  }
  remove(socketMessage) {
    let playerCharacterIndex = this.state.playerCharacters.findIndex((character) => {
      return character.id === socketMessage.id;
    });
    let playerCharacters = [...this.state.playerCharacters];
    playerCharacters.splice(playerCharacterIndex, 1);
    this.setState({ playerCharacters });
  }
  componentDidUpdate(prevProps) {
    if (prevProps.socketMessage !== this.props.socketMessage) {
      let socketMessage = this.socketMessageObject();
  
      if (!socketMessage) {
        return;
      }

      if (socketMessage.type === 'current-player-character') {
        this.setState(prevState => ({
          currentPlayerCharacter: socketMessage
        }));
      }
      if (socketMessage.type === 'invoke-character') {
        this.invoke(socketMessage);
      }

      if (socketMessage.type === 'update-character') {
        this.update(socketMessage);
      }

      if (socketMessage.type === 'remove-character') {
        this.remove(socketMessage);
      }
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