"use strict"
//Dramblys
class Bishop extends ChessPiece {
  constructor(x, y, type, color, img) {
    super(x, y, type, color, img);
  }

  getValidMoves(game) {
    let chessBoard = game.getBoard();
    let validMoves = [];

    //keturios kryptis
    //desine i virsu - nuo dabartines pozicijos iki (BOARD_SIZE - 1, BOARD_SIZE - 1)
    moveCheck(chessBoard, this._x, this._y, 1, 1, BOARD_SIZE - 1, BOARD_SIZE - 1, validMoves);
    //desine zemyn - nuo dabartines pozicijos iki (BOARD_SIZE - 1, 0)
    moveCheck(chessBoard, this._x, this._y, 1, -1, BOARD_SIZE - 1, 0, validMoves);
    //kaire zemyn - nuo dabartines pozicijos iki (0, 0)
    moveCheck(chessBoard, this._x, this._y, -1, -1, 0, 0, validMoves);
    //kaire i virsu - nuo dabartines pozicijos iki (0, BOARD_SIZE - 1)
    moveCheck(chessBoard, this._x, this._y, -1, 1, 0, BOARD_SIZE - 1, validMoves);
    return validMoves;
  }
}
