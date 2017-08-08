// CELL_TYPES: types of cell values
export const CELL_TYPES = {
  WALL: "W",
  MINE: "*",
  EMPTY: ""
};

// CELL_STYLES: holds CSS class names
export const CELL_STYLES = {
  REG: "reg-cell",
  COVER: "reg-cell covered",
  FLAG: "reg-cell covered flagged",
  WALL: "wall",
  SUPERMAN: "reg-cell superman-mode",
  SM_FLAG: "reg-cell flagged superman-mode"
}

// DIST: holds distance between cell indices
export const DIST = 1;

// SET_FLAG: notify which value to set for isFlagged
export const SET_FLAG_STATUS = {
  ON: true,
  OFF: false
};

// WALL_EXT: holds the size to add to height & width for invisible frame
export const WALL_EXT = 2;
