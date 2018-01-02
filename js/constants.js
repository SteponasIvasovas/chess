"use strict"
//board parameters
//global variables
const BOARD_SIZE = 8;
let cellSize = 75;
let boardHeight = BOARD_SIZE * cellSize;
let boardWidth = BOARD_SIZE * cellSize;
//constants
//game modes
const GAME_MODE = 0;
const EDIT_MODE = 1;

//game states
const STATE_GAME = 0;
const STATE_WHITE_WIN = 1;
const STATE_BLACK_WIN = 2;

const WHITE = "white";
const BLACK = "black";

//speeciaulus ejimai
const CHANGE_START = 0;
const PAWN_TRANSFORM = 1;
const CHANGE_START_PAWN_TRANSFORM = 2;
const WHITE_KING_CASTLE_RIGHT = 3;
const BLACK_KING_CASTLE_RIGHT = 4;
const WHITE_KING_CASTLE_LEFT = 5;
const BLACK_KING_CASTLE_LEFT = 6;
