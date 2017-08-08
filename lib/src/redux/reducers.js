import { SET_HEIGHT,
        SET_WIDTH,
        SET_FLAGS,
        RESTART_GAME,
        SET_SUPERMAN } from './actions.js';

const initialState = {
  height: 10,
  width: 10,
  flags: 10,
  isNewGame: false,
  isSuperman: false
};

// Working with single reducer only
export const minesweeperApp = (state = initialState, action) => {
  switch (action.type) {
    case SET_HEIGHT:
      state = {
        ...state,
        height: action.payload
      }
      break;
    case SET_WIDTH:
      state = {
        ...state,
        width: action.payload
      }
      break;
    case SET_FLAGS:
      state = {
        ...state,
        flags: action.payload
      }
      break;
      case RESTART_GAME:
        state = {
          ...state,
          isNewGame: action.payload
        }
        break;
        case SET_SUPERMAN:
          state = {
            ...state,
            isSuperman: action.payload
          }
          break;
    }
    return (state);
};
