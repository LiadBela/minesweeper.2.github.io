import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { setHeight, setWidth, setFlags } from '../redux/actions.js';
import{ SET_HEIGHT,
        SET_WIDTH,
        SET_FLAGS,
        RESTART_GAME,
        SET_SUPERMAN } from '../redux/actions.js';
import { connect } from 'react-redux';

/*
--- UserSetting
Renders the input area where the user can determine the app setting, and
updates redux store
*/
export class UserSetting extends Component {
  constructor(props) {
    super(props)

    this.handleUserSetting = this.handleUserSetting.bind(this);
    this.handleChangeHeight = this.handleChangeHeight.bind(this);
    this.handleChangeWidth = this.handleChangeWidth.bind(this);
    this.handleChangeFlags = this.handleChangeFlags.bind(this);
    this.handleSuperman = this.handleSuperman.bind(this);

    this.state = {
      height: this.props.height,
      width: this.props.width,
      flags: this.props.flags
    }
  }

  /*
  -- handleUserSetting
  Handles the event of 'Start game' button, sends user data from local state
  to store
  */
  handleUserSetting() {
    let validateMsg = this.validateInput();

    if (validateMsg.length === 0) {
      this.props.restartGame(true);
      this.props.setHeight(this.state.height);
      this.props.setWidth(this.state.width);
      this.props.setFlags(this.state.flags);
    } else {
      alert(validateMsg);
    }
  }

  /*
  -- handleChangeHeight
  Handling the user height input
  - e: event-related data, holds the value of the user input
  */
  handleChangeHeight(e) {
    let value = e.target.value;
    this.setState({
      height: value
    });
  }

  /*
  -- handleChangeWidth
  Handling the user width input
  - e: event-related data, holds the value of the user input
  */
  handleChangeWidth(e) {
    let value = e.target.value;
    this.setState({
      width: value
    });
  }

  /*
  -- handleChangeFlags
  Handling the user flags input
  - e: event-related data, holds the value of the user input
  */
  handleChangeFlags(e) {
    let value = e.target.value;
    this.setState({
      flags: value
    });
  }

  handleSuperman(e) {
    let isSuperman = e.target.checked;
    this.props.setSuperman(isSuperman);
  }

  /*
  -- handleChangeFlags
  Validates user data, returns message string
  */
  validateInput() {
    const MAX_SIZE = 300;
    const MIN_SIZE = 1;
    let msg = "";

    // Checking for any input
    if ((this.state.height.length > 0) &&
       (this.state.width.length > 0) &&
       (this.state.flags.length > 0)) {

      // Checking board size input
      if ((this.state.height > MAX_SIZE) || (this.state.width > MAX_SIZE) ||
         (this.state.height < MIN_SIZE) || (this.state.width < MIN_SIZE)) {
        msg = msg.concat("Height or width should be between 1 to 300\n");
      }

      let boardSize = Number(this.state.height) * Number(this.state.width);
      // Checking that no more flags than board size
      if ((this.state.flags > boardSize) ||
         (this.state.flags < 1)) {
        msg = msg.concat("Flags should be between 1 and " + boardSize + "\n");
      }

    // If not having all values set
    } else {
      msg = msg.concat("Please fill all input fields");
    }

    return (msg);
  }

  render() {
    return (
      <div>
        <p>Height:</p>
        <input type="number" onChange={this.handleChangeHeight} />

        <p>Width:</p>
        <input type="number" onChange={this.handleChangeWidth} />

        <p>Number of flags:</p>
        <input type="number" onChange={this.handleChangeFlags} />

        <input className="sm-check" type="checkbox" onChange={this.handleSuperman} />
        <p>Superman</p>

        <button className="submit-button" onClick={this.handleUserSetting}>
          New game
        </button>

      </div>
    )
  }
}

// Board PropTypes declaration
UserSetting.propTypes = {
  height:      PropTypes.number.isRequired, // Height of the board (store)
  width:       PropTypes.number.isRequired, // Width of the board (store)
  flags:       PropTypes.number.isRequired,  // Flags on the board (store)
  setHeight:   PropTypes.func.isRequired, // setting height (store)
  setWidth:    PropTypes.func.isRequired, // setting width (store)
  setFlags:    PropTypes.func.isRequired, // setting flags (store)
  restartGame: PropTypes.func.isRequired, // Re-initialize of board (store)
  setSuperman: PropTypes.func.isRequired, // Setting Superman mode
};

/*
--- Redux configuration
-- mapStateToProps: setting the props available on this component from store
- height: get user setting for board height
- width: get user setting for board width
- flags: get user setting for number of flags
*/
const mapStateToProps = (state) => {
  return {
    height: state.height,
    width: state.width,
    flags: state.flags,
  }
};

/*
-- mapDispatchToProps: setting the set methods to dispatch in this component
- setHeight(height): set user setting for board height
- setWidth(width): set user setting for board width
- setFlags(flags): set user setting for number of flags
- restartGame: set new board with values as in UserSetting
*/
const mapDispatchToProps = (dispatch) => {
  return {
    setHeight: (height) => {
      dispatch({
        type: SET_HEIGHT,
        payload: height
      });
    },
    setWidth: (width) => {
      dispatch({
        type: SET_WIDTH,
        payload: width
      });
    },
    setFlags: (flags) => {
      dispatch({
        type: SET_FLAGS,
        payload: flags
      });
    },
    restartGame: (isNewGame) => {
      dispatch({
        type: RESTART_GAME,
        payload: isNewGame
      });
    },
    setSuperman: (isSuperman) => {
      dispatch({
        type: SET_SUPERMAN,
        payload: isSuperman
      });
    }
  };
};

// Connect to store
export default connect(mapStateToProps, mapDispatchToProps)(UserSetting);
