import React, { Component } from 'react';
import PlayerCharacter from '../player-character/PlayerCharacter.js';
import GridTile from '../grid-tile/GridTile.js';
import './MapGrid.css';


class GridRow extends Component {
  constructor(props) {
    super(props);

    this.gridWidth = this.props.gridWidth;
    this.gridHeight = this.props.gridHeight;
    this.rowId = this.props.rowId;

    this.gridTiles = [];
    let column = 0;
    for (column = 0; column < this.gridWidth; column++) {
      let gridTileId = this.rowId + '_' + column;

      this.gridTiles.push(
        <GridTile
          id={gridTileId}
          key={gridTileId}

          rowId={this.rowId}
          column={column}
          gridWidth={this.gridWidth}
          gridHeight={this.gridHeight}

          registerCollisionObject={this.props.registerCollisionObject}
        />
      );
    }

  }
  render() {
    return (
      <div className="grid-tile-row"> 
        {this.gridTiles}
      </div>
    );
  }
}

class MapGrid extends Component {
  constructor(props) {
    super(props);

    this.state = {
      playerCharacters: [],
      currentPlayerCharacter: {},

      gridHeight: 20,
      gridWidth: 30,
      collisionRegistry: [],

    };

    this.gridRows = [];
    let i = 0;
    for (i; i < this.state.gridHeight; i++) {
      this.gridRows.push({
        id: i
      });
    }

    this.checkCollisions = this.checkCollisions.bind(this);
    this.registerCollisionObject = this.registerCollisionObject.bind(this);

  }

  registerCollisionObject(obj) {
    this.state.collisionRegistry.push({
      id: obj.id,
      x: obj.x,
      y: obj.y,
      w: obj.w,
      h: obj.h
    });
  }

  checkCollisions(collisionObj) {
    let collisions = [];
    let rect1 = collisionObj;

    let collisionRegistryObjects = [].concat(this.state.playerCharacters, this.state.collisionRegistry);
    console.log('collisionRegistryObjects Before Filter', collisionRegistryObjects);
    collisionRegistryObjects = collisionRegistryObjects.filter((obj) => {
      if (obj.id )
      return obj.id !== collisionObj.id;
    });
    console.log('rect1', rect1);
    console.log('collisionRegistryObjects', collisionRegistryObjects);
    console.log('this.state.playerCharacters', this.state.playerCharacters);
    collisionRegistryObjects.forEach((collisionObj2) => {
 
      let rect2 = {
        id: collisionObj2.id,
        x: collisionObj2.x,
        y: collisionObj2.y,
        w: collisionObj2.w,
        h: collisionObj2.h
      };
      if (collisionObj2.userName === 'ti') {
       
        debugger;
      }
      let isCollided = rect1.x < rect2.x + rect2.w &&
      rect1.x + rect1.w > rect2.x &&
      rect1.y < rect2.y + rect2.h &&
      rect1.h + rect1.y > rect2.y;

      if (isCollided) {
        console.log('COLLISION DETECTED!');
        collisions.push(rect2);
      }

    });

    return collisions;

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
    delete socketMessage.type;

    let index = this.state.playerCharacters.findIndex((character) => {
      return character.id === socketMessage.id;
    });

    let playerCharacters = [...this.state.playerCharacters];
    
    playerCharacters[index] = Object.assign(this.state.playerCharacters[index], socketMessage);

    Object.assign(playerCharacters[index], socketMessage);
    console.log('playerCharacters', playerCharacters);
   this.setState({ playerCharacters: playerCharacters });
  }

  spawnWithoutCollision(obj) {
    let collisions = this.checkCollisions(obj);

    if (collisions.length > 0) {
      let x = obj.x + 50;
      obj.x = x;
      this.spawnWithoutCollision(obj);
    } else {
      let updateCharacter = Object.assign(obj, {
        type: 'update-character'
      });
      this.props.connection.send(JSON.stringify(updateCharacter));
    }
  }
  invoke(socketMessage) {
    console.log('INVOKE', socketMessage);
    this.setState(prevState => ({
      playerCharacters: [...prevState.playerCharacters, socketMessage],
    }), () => {
      console.log('this.state.playerChracters', this.playerCharacters );
      console.log('socketMessage', socketMessage);
      this.spawnWithoutCollision(socketMessage);
    });

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
        console.log('EVENT: INVOKE CHARACTER');
        this.invoke(socketMessage);
      }

      if (socketMessage.type === 'update-character') {
        console.log('EVENT: UPDATE CHARACTER', socketMessage);
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
            y={playerCharacter.y}
            x={playerCharacter.x}
            w={playerCharacter.w}
            h={playerCharacter.h}
            facingDirection={playerCharacter.facingDirection}
            moving={playerCharacter.moving}
            color={playerCharacter.color}
            userName={playerCharacter.userName}

            connection={this.props.connection}
            currentPlayerCharacter={this.state.currentPlayerCharacter}
            checkCollisions={this.checkCollisions}
            collisionRegistry={this.state.collisionRegistry}
          />
        )}

        {this.gridRows.map((gridRowId) =>
          <GridRow
            gridWidth={this.state.gridWidth}
            gridHeight={this.state.gridHeight}
            rowId={gridRowId.id}
            key={gridRowId.id}

            registerCollisionObject={this.registerCollisionObject}
          />
        )}

      </div>
    );
  }
}

export default MapGrid;