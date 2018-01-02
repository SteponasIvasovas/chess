"use strict"
//Bokstas
class Rook extends ChessPiece {
  constructor(x, y, type, color, img) {
    super(x, y, type, color, img);
    this._startPos = true;
  }
  toggleStartPos() {
    if (this._startPos) {
      this._startPos = false;
    } else {
      this._startPos = true;
    }
  }
  getStartPos() {
    return this._startPos;
  }
  movePiece(game, x, y) {
    let chessBoard = game.getBoard();
    let special = undefined;

    if (this._startPos) {
      this._startPos = false;
      special = CHANGE_START;
    }

    game.registerMove(this._x, this._y, x, y, special);
    chessBoard[x][y] = this;
    chessBoard[this._x][this._y] = undefined;
    this._x = x;
    this._y = y;
  }
  getValidMoves(game) {
    let chessBoard = game.getBoard();
    let validMoves = [];

    //keturi tikrinimai
    //tikrinam ejimus i desine nuo dabartines pozicijos iki x < BOARD_SIZE - 1
    moveCheck(chessBoard, this._x, this._y, 1, 0, BOARD_SIZE - 1, -1, validMoves);
    //tikrinam ejimus i kaire nuo dabartines pozicijos iki x > 0
    moveCheck(chessBoard, this._x, this._y, -1, 0, 0, -1, validMoves);
    //tikrinam ejimus i virsu nuo dabartines pozicijos iki y > 0
    moveCheck(chessBoard, this._x, this._y, 0, -1, -1, 0, validMoves);
    //tikrinam ejimus i apacia nuo dabartines pozicijos iki y < BOARD_SIZE - 1
    moveCheck(chessBoard, this._x, this._y, 0, 1, -1, BOARD_SIZE - 1, validMoves);

    return validMoves;
  }
}
