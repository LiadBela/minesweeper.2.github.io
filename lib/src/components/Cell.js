import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../styles/Styles.css';
import { NO_TEXT, CELL_STYLES, CELL_TYPES } from '../helpers/constants.js';
import { connect } from 'react-redux';

/*
--- Cell
Renders a cell in the board game, according to props sent from Board
*/
export class Cell extends Component {
  constructor(props) {
    super(props);
    this.handleCellClick = this.handleCellClick.bind(this);
  }

  /*
  -- handleCellClick
  Event handler which fires at cell click on the board, sends
  relevant data to handleBoardClick() in Board.js
  - e: Event-related data, indicates wehther user pressed ShiftKey
  */
  handleCellClick(e) {
    let row = this.props.rowInd;
    let col = this.props.colInd;
    let isFlagged = this.props.isFlagged;
    let isShiftKey = e.shiftKey;

    this.props.onClick(isShiftKey, row, col, isFlagged);
  }

  /*
  -- matchCssClassByVal
  Event handler which fires at cell click on the board, sends
  relevant data to handleBoardClick() in Board.js
  - e: Event-related data, indicates wehther user pressed ShiftKey
  */
  styleCellByValue() {
    let cellClass = CELL_STYLES.REG;

    if (this.props.isCovered) {
      cellClass = CELL_STYLES.COVER;

      if (this.props.isSuperman) {
        cellClass = CELL_STYLES.SUPERMAN;
      }

      if (this.props.isFlagged) {
        cellClass = CELL_STYLES.FLAG;
      }
    }

    if (this.props.cellValue === CELL_TYPES.WALL) {
      cellClass = CELL_STYLES.WALL;
    }

    return (cellClass);
  }

  render() {
    return (
      <td>
        <div className={this.styleCellByValue()} onClick={this.handleCellClick}>
          {this.props.cellValue}
        </div>
      </td>
    );
  }
}

// Cell PropTypes declaration
Cell.propTypes = {
  celValue:  PropTypes.string.isRequired, // Value of the particular cell
  rowInd:    PropTypes.number.isRequired, // Row index
  colInd:    PropTypes.number.isRequired, // Column Index
  isCovered: PropTypes.bool.isRequired, // Indicates whether cell is covered
  isFlagged: PropTypes.bool.isRequired, // Indicates whether cell is flagged
  onClick:   PropTypes.func.isRequired, // Event listener for clicking a cell
  isSuperman: PropTypes.bool.isRequired  // is game in Superman mode
};

/*
--- Redux configuration
-- mapStateToProps: setting the props available on this component from store
- isSuperman: is game in Superman mode
*/
const mapStateToProps = (state) => {
  return {
    isSuperman: state.isSuperman
  }
};

// Connect to store
export default connect(mapStateToProps, null)(Cell);
