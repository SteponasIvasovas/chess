"use strict"
//Karaliene
class Queen extends ChessPiece {
  constructor(x, y, type, color, img) {
    super(x, y, type, color, img);
  }

  getValidMoves(game) {
    let chessBoard = game.getBoard() ;
    let validMoves = [];

    //8 kryptis
    //tikrinam ejimus i desine nuo dabartines pozicijos iki x < BOARD_SIZE - 1
    moveCheck(chessBoard, this._x, this._y, 1, 0, BOARD_SIZE - 1, -1, validMoves);
    //tikrinam ejimus i kaire nuo dabartines pozicijos iki x > 0
    moveCheck(chessBoard, this._x, this._y, -1, 0, 0, -1, validMoves);
    //tikrinam ejimus i virsu nuo dabartines pozicijos iki y > 0
    moveCheck(chessBoard, this._x, this._y, 0, -1, -1, 0, validMoves);
    //tikrinam ejimus i apacia nuo dabartines pozicijos iki y < BOARD_SIZE - 1
    moveCheck(chessBoard, this._x, this._y, 0, 1, -1, BOARD_SIZE - 1, validMoves);
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
