import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import '../styles/Styles.css';
import Cell from './Cell.js';
import { CELL_TYPES,
        DIST,
        SET_FLAG_STATUS,
        WALL_EXT } from '../helpers/constants.js';
import{ RESTART_GAME } from '../redux/actions.js';
import { connect } from 'react-redux';

/*
--- Board
Holds the board game and handles the whole game logic
*/
export class Board extends Component {
  constructor(props) {
    super(props);

    // Initialize values for board game
    let extHeight = Number(this.props.height) + WALL_EXT;
    let extWidth = Number(this.props.width) + WALL_EXT;
    let flags = this.props.flags;

    // Board game, held as a state
    this.state = {
      board: this.initBoard(extHeight, extWidth, flags)
    };

    this.handleBoardClick = this.handleBoardClick.bind(this);
  }

  getHeight() {
    return (Number(this.props.height) + WALL_EXT);
  }

  getWidth() {
    return (Number(this.props.width) + WALL_EXT);
  }

  /*
  -- initDefaultValues
  Giving the board matrix initial size and default values
  - extHeight: height of the board added invisible frame
  - extWidth: width of the board added invisible frame
  */
  initDefaultValues(extHeight, extWidth) {
    let currCell;
    let arrRows = [];

    for (let i = 0; i < extHeight; i++) {
      arrRows[i] = [];
      for (let j = 0; j < extWidth; j++) {
        currCell = {
          val: CELL_TYPES.EMPTY,
          isFlagged: false,
          isCovered: true
        };
        arrRows[i][j] = currCell;
      }
    }

    return (arrRows);
  }

  /*
  -- initWalls
  Initializing the extended frame of the board matrix
  - board: board matrix, passed by-value between initializing methods
  - extHeight: height of the board added invisible frame
  - extWidth: width of the board added invisible frame
  */
  initWalls(board, extHeight, extWidth) {
    for (let i = 0; i < extHeight; i++) {
      for (let j = 0; j < extWidth; j++) {
        if ((j == 0) || (j == (extWidth - 1)) ||
           (i == 0) || (i == (extHeight - 1))) {
          board[i][j].val = CELL_TYPES.WALL;
        }
      }
    }
  }

  /*
  -- initMinesByFlags
  Setting randomally-spread mines, according to user settings (flags)
  - board: board matrix, passed by-value between initializing methods
  - extHeight: height of the board added invisible frame
  - extWidth: width of the board added invisible frame
  - flags: number of flags (mines) to set
  */
  initMinesByFlags(board, extHeight, extWidth, flags) {
    let isFoundEmptyCell = false;
    let currRowInd;
    let currColInd;
    const MIN = 1;
    const RAND_H_FACTOR = (extHeight - MIN - 1);
    const RAND_W_FACTOR = (extWidth - MIN - 1);
    for (let i = 0; i < flags; i++) {
      isFoundEmptyCell = false;

      // Checking for a new random spot for every mine
      while (!isFoundEmptyCell) {
        currRowInd = (Math.floor(Math.random() * RAND_H_FACTOR) + MIN);
        currColInd = (Math.floor(Math.random() * RAND_W_FACTOR) + MIN);
        if (board[currRowInd][currColInd].val === CELL_TYPES.EMPTY) {
          board[currRowInd][currColInd].val = CELL_TYPES.MINE;
          isFoundEmptyCell = true;
        }
      }
    }
  }

  /*
  -- calcBoardValuesByMines
  Calculating number of mines around all the empty cells
  - board: board matrix, passed by-value between initializing methods
  - extHeight: height of the board added invisible frame
  - extWidth: width of the board added invisible frame
  */
  calcBoardValuesByMines(board, extHeight, extWidth) {
    let currMinesAroundCell;

    for (let i = 1; i < (extHeight - 1); i++ ) {
      for (let j = 1; j < (extWidth - 1); j++ ) {
        if (board[i][j].val !== CELL_TYPES.MINE) {
          currMinesAroundCell = this.countAdjacentMines(i, j, board);
          board[i][j].val = (currMinesAroundCell === 0) ?
            CELL_TYPES.EMPTY
          :
            currMinesAroundCell;
        }
      }
    }
  }

  /*
  -- countAdjacentMines
  Calculates & returns number of mines around specific cell
  - rowInd: row index of cell
  - colInd: column index of cell
  - board: board matrix, passed by-value between initializing methods
  */
  countAdjacentMines(rowInd, colInd, board) {
    let cntMinesAroundCell = 0;

    for (let i = (rowInd - DIST); i <= (rowInd + DIST); i++) {
      for (let j = (colInd - DIST); j <= (colInd + DIST); j++) {
        if (board[i][j].val === CELL_TYPES.MINE) {
          cntMinesAroundCell++;
        }
      }
    }

    return (cntMinesAroundCell);
  }

  /*
  -- initBoard
  Initializing board game via all initializing methods
  Returning board matrix (initializing state)
  - extHeight: height of the board added invisible frame
  - extWidth: width of the board added invisible frame
  - flags: number of flags (mines) to set
  */
  initBoard(extHeight, extWidth, flags) {
    let board = [];

    board = this.initDefaultValues(extHeight, extWidth);
    this.initWalls(board, extHeight, extWidth);
    this.initMinesByFlags(board, extHeight, extWidth, flags);
    this.calcBoardValuesByMines(board, extHeight, extWidth);

    return (board);
  }

  /*
  -- handleBoardClick
  Event listener that handles both regular-clicking and shift-clicking and
  transfers to methods accordingly
  - isShiftKey: indicates whether shift was held while onClick
  - rowInd: row index of clicked cell
  - colInd: column index of clicked cell
  - isCellFlagged: holds whether clicked cell was flagged when clicked
  */
  handleBoardClick(isShiftKey, rowInd, colInd, isCellFlagged) {
    if ((isShiftKey) && (this.state.board[rowInd][colInd].isCovered)) {
      this.flagClicked(rowInd, colInd, isCellFlagged);
    }
    else if (!isCellFlagged) {
      this.cellClicked(rowInd, colInd);
    }
  }

  /*
  -- flagClicked
  The main methods which manages a flag pin/unpin from the board
  The method checks validity for flag-pinning, updating flags indicator and
  checks for a win
  - rowInd: row index of the pinned/unpinned flagClicked
  - colInd: column index of the pinned/unpinned flagClicked
  - isCellFlagged: holds the current flagged status of the given coords
  */
  flagClicked(rowInd, colInd, isCellFlagged) {
    let cntFlags = this.getFlaggedCoords().length;

    // Checking for pin/unpin
    if (isCellFlagged) {
      this.updateFlagByCoord(rowInd, colInd, SET_FLAG_STATUS.OFF);
    } else if (cntFlags < this.props.flags) {
      this.updateFlagByCoord(rowInd, colInd, SET_FLAG_STATUS.ON);
    } else {
      alert("You have already used all of your flags. Re-positioning anyone?");
    }

    // Checking for a possible win when all flags have pinned
    if (this.isWinner()) {
      alert("WHOOOHOHOOO! You win!");
      this.props.restartGame(true);
    }
  }

  /*
  -- getRemainingFlags
  Returns number of remaining flags to pin
  */
  getRemainingFlags() {
    return (this.props.flags - this.getFlaggedCoords().length);
  }

  /*
  -- getFlaggedCoords
  Returns an array with all flagged cells coords
  */
  getFlaggedCoords() {
    let arrFlags = [];

    for (let i = 0; i < this.getHeight(); i++) {
      for (let j = 0; j < this.getWidth(); j++) {
        if (this.state.board[i][j].isFlagged) {
          arrFlags.push({ row: i, col: j });
          }
        }
      }

    return (arrFlags);
  }

  /*
  -- isWinner
  Returns whether the user has won the game
  */
  isWinner() {
    let arrFlags = this.getFlaggedCoords();
    let currFlag;
    let currCellValue;
    let isAllFlagsOnMines = true;

    // Checks if every flag that has been pinned is also a mine cell
    for (let i = 0; i < arrFlags.length; i++) {
      currFlag = arrFlags.pop();
      currCellValue = this.state.board[currFlag.row][currFlag.col].val;
      if (currCellValue !== CELL_TYPES.MINE) {
        isAllFlagsOnMines = false;
      }
    }

    // If no more flags, and all flags positioned on mines, alerts on a win
    return ((isAllFlagsOnMines) && (!this.getRemainingFlags()));
  }

  /*
  -- updateFlagByCoord
  Pinning/unpinning a cell with a flag according to coords and boolean
  indicator, and updates the state
  - rowInd: row index to pin/unpin
  - colInd: column index to pin/unpin
  - setFlag: indicates whether to pin a new flag or to unpin an existing one
  */
  updateFlagByCoord(rowInd, colInd, setFlag) {
    let changedBoard = this.state.board.slice();
    changedBoard[rowInd][colInd].isFlagged = setFlag;

    this.setState({
      board: changedBoard
    });
  }

  /*
  -- cellClicked
  The main method which taking care of cell onClick (no shiftKey), the method
  will update the board according to the particular cell revealed
  - rowInd: row index of clicked cell
  - colInd: column index of clicked cell
  */
  cellClicked(rowInd, colInd) {
    this.revealCell(rowInd, colInd);

    // Checks cell's type and respond accordingly
    switch (this.state.board[rowInd][colInd].val) {
      case CELL_TYPES.EMPTY:
        this.revealSurroundByCell(rowInd, colInd);
        break;
      case CELL_TYPES.MINE:
        alert("YOU LOSE! Try again?");
        this.props.restartGame(true);
      default:
    }
  }

  /*
  -- revealSurroundByCell
  Core method of the game, checks all adjacent cells and reveals them
  recursively unill it meets non-empty cells
  - rowInd: row index of clicked cell
  - colInd: column index of clicked cell
  */
  revealSurroundByCell(rowInd, colInd) {
    for (let i = (rowInd - DIST); i <= (rowInd + DIST); i++) {
      for (let j = (colInd - DIST); j <= (colInd + DIST); j++) {
        if ((this.isInBoundries(i, j)) &&
           (this.state.board[i][j].isCovered)) {

          // If adjacent cell is empty - check its adjacent cells too
          if (this.state.board[i][j].val === CELL_TYPES.EMPTY) {
            this.revealCell(i, j);
            this.revealSurroundByCell(i, j);
          // Otherwise - reveal current cell and stop
          } else if (this.state.board[i][j].val !== CELL_TYPES.WALL) {
            this.revealCell(i, j)
          }
        }
      }
    }
  }

  /*
  -- isInBoundries
  Returns whether the adjacent cells of the input cell are the board's boundries
  (therefore the board has extended frame)
  - rowInd: row index of cell that will check its surrounding
  - colInd: column index of cell that will check its surrounding
  */
  isInBoundries(rowInd, colInd) {
    const DIST = 1;
    return (((rowInd - DIST) >= 0) &&
           ((rowInd + DIST) < (this.getHeight())) &&
           ((colInd - DIST) >= 0) &&
           ((colInd + DIST) < (this.getWidth())));
  }

  /*
  -- revealCell
  This method will reveal the input cell's value
  - rowInd: row index of cell to reveal
  - colInd: col index of cell to reveal
  */
  revealCell(rowInd, colInd) {
    let changedIsCovered = false;
    let changedBoard = this.state.board.slice();
    changedBoard[rowInd][colInd].isCovered = changedIsCovered;

    this.setState({
      board: changedBoard
    });
  }

  /*
  -- componentWillReceiveProps
  This method will be called when props are changed. We will use it to
  identify the UserSetting submit for initializing new board
  - nextProps: holds the new values of the component's props
  */
  componentWillReceiveProps(nextProps) {
    if (nextProps.isNewGame)
    {
      let extHeight = Number(nextProps.height) + WALL_EXT;
      let extWidth = Number(nextProps.width) + WALL_EXT;
      let flags = nextProps.flags;
      let newBoard = this.initBoard(extHeight, extWidth, flags);

      this.setState({
        board: newBoard
      });

      this.props.restartGame(false);
    }
  }

  render() {
    return (
      <div className="board-box">
        <div>
          <p>Remaining flags: {this.getRemainingFlags()}</p>
        </div>
        <table>
          {this.state.board.map((row, i) =>
            <tr>
              {row.map((cell, j) =>
                <Cell cellValue={cell.val}
                      rowInd={i}
                      colInd={j}
                      isCovered={cell.isCovered}
                      isFlagged={cell.isFlagged}
                      onClick={this.handleBoardClick} />
              )}
            </tr>
          )}
        </table>
      </div>
    );
  }
}

// Board PropTypes declaration
Board.propTypes = {
  height:      PropTypes.number.isRequired, // Height of the board (store)
  width:       PropTypes.number.isRequired, // Width of the board (store)
  flags:       PropTypes.number.isRequired,  // Flags on the board (store)
  isNewGame:   PropTypes.bool.isRequired, // Did 'new game' triggerd (store)
  restartGame: PropTypes.func.isRequired // Updates isNewGame (store)
};

/*
--- Redux configuration
-- mapStateToProps: setting the props available on this component from store
- height: get user setting for board height
- width: get user setting for board width
- flags: get user setting for number of flags
- isNewGame: indicates whether the board should be initialized wuth new values
*/
const mapStateToProps = (state) => {
  return {
    height: state.height,
    width: state.width,
    flags: state.flags,
    isNewGame: state.isNewGame
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
    restartGame: (isNewGame) => {
      dispatch({
        type: RESTART_GAME,
        payload: isNewGame
      });
    }
  };
};

// Connect to store
export default connect(mapStateToProps, mapDispatchToProps)(Board);
