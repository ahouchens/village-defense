import React, { Component } from 'react';
import './PlayerCharacter.css';
import PlayerCharacterSprite from './player-character.png';

const KEY_MAP = {
  'up': 'w',
  'down': 's',
  'left': 'a',
  'right': 'd'
};

class PlayerCharacter extends Component {
  constructor(props) {
    super(props);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);

    this.state = {
      speed: this.props.speed,
      id: this.props.id,
      y: this.props.y,
      x: this.props.x,
      w: this.props.w,
      h: this.props.h,
      facingDirection: this.props.facingDirection,
      moving: this.props.moving,
      color: this.props.color,
      userName: this.props.userName,
      currentPlayerCharacter: this.props.currentPlayerCharacter,
      className: this.props.speed
    };
  }
  componentWillReceiveProps(nextProps) {
    if(this.props !== nextProps) {
      this.setState({
        id: nextProps.id,
        y: nextProps.y,
        x: nextProps.x,
        w: nextProps.w,
        h: nextProps.h,
        facingDirection: nextProps.facingDirection,
        moving: nextProps.moving,
        color: nextProps.color,
        currentPlayerCharacter: nextProps.currentPlayerCharacter,
        className: nextProps
      });
    }
  }
  isCurrentPlayerCharacter() {
    return this.state.currentPlayerCharacter.id === this.props.id;
  }
  onKeyUp(e) {
    if (!this.isCurrentPlayerCharacter()) {
      return;
    }
    if (e.key === 'w' || e.key === 'a' || e.key === 's'  || e.key === 'd') {
      let playerCharacterObj = {
        moving: false,
        type: 'update-character',
        id: this.state.id
      };
      //this.props.registerGameLoopEvent(playerCharacterObj);

      console.log('keyUp stop moving');
      this.setState({
        moving: false
      });
      this.props.connection.send(JSON.stringify({
        moving: false,
        type: 'update-character',
        id: this.state.id,
      }));
      
    }
  }
  onKeyDown(e) {
    if (!this.isCurrentPlayerCharacter()) {
      console.log('return end');
      return;
    }

    let y = this.state.y;
    let x = this.state.x;
    let w = this.state.w;
    let h = this.state.h;
    let id = this.state.id;
    let newUserName = this.state.userName;
    let newColor = this.state.color; 
    let facingDirection = this.state.facingDirection;
    let moving = this.state.moving;
    let type = 'update-character';
    let className = this.state.className;
  
    if (e.key === KEY_MAP.up) {
      facingDirection = 'up';
      moving = true;
      className = 'up';
    }

    if (e.key === KEY_MAP.down) {
      facingDirection = 'down';
      moving = true;
      className = 'down';
    }
  
    if (e.key === KEY_MAP.left) {      
      facingDirection = 'left';
      moving = true;
      className = 'left';
    }

    if (e.key === KEY_MAP.right) {
      facingDirection = 'right';
      moving = true;
      className = 'right';
    }

    let playerCharacterObj = {
      className: className,
      color: newColor,
      y: y,
      x: x,
      w: w,
      h: h,
      facingDirection: facingDirection,
      moving: moving,
      userName: newUserName,
      id: id,
      type: type,
    };

    // this.props.registerGameLoopEvent(playerCharacterObj);
    this.props.connection.send(JSON.stringify(playerCharacterObj));


  }
  className() {
    let className = '';
    
    switch (this.state.facingDirection) {
      case 'down':
        if (this.state.moving) {
          className = 'down-moving';
        } else {
          className = 'down';
        }
        break;
      case 'up':
        if (this.state.moving) {
          className = 'up-moving';
        } else {
          className = 'up';
        }
        break;
      case 'left':
        if (this.state.moving) {
          className = 'left-moving';
        } else {
          className = 'left';
        }
        break;
      case 'right':
      if (this.state.moving) {
        className = 'right-moving';
      } else {
        className = 'right';
      }
        break;
      default:
        //className = 'down';
    } 
    return className;
    
  }
  render() {
    return(
      <div
        className={"player-character" + ' ' + this.className()}
        key={this.state.id}
        onKeyDown={this.onKeyDown}
        onKeyUp={this.onKeyUp}
        tabIndex="0"
        style={{
          //backgroundColor: this.state.color,
          outline: 'none !important', 
          top: this.state.y + 'px',
          left: this.state.x + 'px',
          width: this.state.w + 'px',
          height: this.state.h + 'px',
          //WebkitTransition: 'all 0.7s ease-out'
          WebkitBoxShadow: 'inset 0px 10px 0px 0px rgba(' + this.state.color + ', .6)',
        }}
        >
        {this.state.userName}
      </div>
    );
  }
}

export default PlayerCharacter;