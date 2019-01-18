import React, { Component } from 'react';
import './GridTile.css';
import WallSprite from './hive0.png';
import GroundSprite from './dirt_full.png';

class GridTile extends Component {
  constructor(props) {
    super(props);

    this.someRefName = React.createRef();
  
    this.state = {};
    this.id = this.props.id;
    this.column = this.props.column;
    this.gridWidth = this.props.gridWidth;
    this.gridHeight = this.props.gridHeight;
    this.rowId = this.props.rowId;

    this.backgroundColor = (this.isBoundaryTile()) ? 'green' : 'red';
    this.backgroundImage = (this.isBoundaryTile()) ? WallSprite : GroundSprite;
  }
  isBoundaryTile() {
    if (this.column === this.gridWidth - 1) {
      return true;
    }
    if (this.column === 0) {
      return true;
    }
    if (this.rowId === this.gridHeight - 1) {
      return true;
    }
    if (this.rowId === 0) {
      return true;
    }
    return false;

  }
  componentDidMount() {
    if (this.isBoundaryTile()) {

      this.props.registerCollisionObject({
        id: this.id,
        x: this.someRefName.current.offsetLeft,
        y: this.someRefName.current.offsetTop,
        w: 32,
        h: 32
      });
    }
  }
  render() {
    return (
      <div 
        className="grid-tile" 
        style={{backgroundImage: `url(${this.backgroundImage})`}}
        ref={this.someRefName}
      >
      </div>
    );
  }
}

export default GridTile;