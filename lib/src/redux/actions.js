// Actions  types
export const SET_HEIGHT = "SET_HEIGHT";
export const SET_WIDTH = "SET_WIDTH";
export const SET_FLAGS = "SET_FLAGS";
export const RESTART_GAME = "RESTART_GAME";
export const SET_SUPERMAN = "SET_SUPERMAN"; 

// Action creators
export function setHeight(height) {
  return {
    type: SET_HEIGHT,
    payload: height
  }
}

export function setWidth(width) {
  return {
    type: SET_WIDTH,
    payload: width
  }
}

export function setFlags(flags) {
  return {
    type: SET_FLAGS,
    payload: flags
  }
}

export function isNewGameClicked(isNewGame) {
  return {
    type: RESTART_GAME,
    payload: isNewGame
  }
}

export function setSuperman(isSuperman) {
  return {
    type: SET_SUPERMAN,
    payload: isSuperman
  }
}
