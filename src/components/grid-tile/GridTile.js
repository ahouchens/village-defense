import React, { Component } from 'react';
import './GridTile.css';
import WallSprite from './hive0.png';
import GroundSprite from './dirt_full.png';
import GroundSprite2 from './ground-tiles/grass-dirt-tile-sheet.png';
import BoundarySprite from './ground-tiles/terrain-boundary.png';

class GridTile extends Component {
  constructor(props) {
    super(props);

    this.someRefName = React.createRef();
    this.isBoundaryTile = this.isBoundaryTile.bind(this);
  
    this.state = {
      groundTile: this.randomBackgroundImage(),
      backgroundImage: GroundSprite2,
      width: 32,
      height: 32
    };
    this.id = this.props.id;
    this.column = this.props.column;
    this.gridWidth = this.props.gridWidth;
    this.gridHeight = this.props.gridHeight;
    this.rowId = this.props.rowId;

  }
  isBoundaryTile() {
    //console.log('bounadryTle check ', this.props);
    if (this.column === this.gridWidth - 1) {
      this.setState({
        backgroundImage: '',
      });
      return true;
    }
    if (this.column === 0) {
      this.setState({
        backgroundImage: '',
      });
      return true;
    }
    if (this.rowId === this.gridHeight - 1) {
      this.setState({
        backgroundImage: '',
      });
      return true;
    }
    if (this.rowId === 0) {
      this.setState({
        backgroundImage: '',
      });
      return true;
    }

    return false;

  }
  randomBackgroundImage() {
    let row1Tiles = [
      {
        x: 0,
        y: 0 
      }, 
      {
        x: 32 * 6,
        y: 0
      },
      {
        x: 32 * 5,
        y: 0
      }
    ];

    let row2Tiles = [
      {
        x: 32 * 6,
        y: -32
      }, 
      {
        x: 32 * 5,
        y: -32
      }
    ];

    let groundTiles = row1Tiles.concat(row2Tiles);
    let groundTile = groundTiles[Math.floor(Math.random() * groundTiles.length)];
    this.setState({ groundTile });

    return groundTile;

  }
  componentDidMount() {
    if (this.isBoundaryTile()) {
      this.props.registerCollisionObject({
        id: this.id,
        x: this.someRefName.current.offsetLeft,
        y: this.someRefName.current.offsetTop,
        w: this.someRefName.current.offsetWidth,
        h: this.someRefName.current.offsetHeight
      });
    }
  }
  render() {
    return (
      <div 
        className="grid-tile" 
        style={{
          backgroundImage: `url(${this.state.backgroundImage})`,
          backgroundPositionX: this.state.groundTile.x,
          backgroundPositionY: this.state.groundTile.y,
          width: this.state.width + 'px',
          height: this.state.height + 'px'
        }}
        ref={this.someRefName}
      >
      </div>
    );
  }
}

export default GridTile;