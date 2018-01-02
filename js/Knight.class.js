"use strict"
//Arklys
class Knight extends ChessPiece {
  constructor(x, y, type, color, img) {
    super(x, y, type, color, img);
  }

  getValidMoves(game) {
    let chessBoard = game.getBoard();
    let validMoves = [];
    //reikalinga tam, nes is funkcijos vidaus this._x ir this._y nera matomas
    let thisX = this._x;
    let thisY = this._y;

    let knightMoveCheck = function(x, y) {
      if (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE) {
        moveValidation(chessBoard, thisX, thisY, x, y, validMoves);
      }
    }
    //8 galimi ejimai :
    //x + 1 y + 2
    knightMoveCheck(this._x + 1, this._y + 2);
    //x + 1 y - 2
    knightMoveCheck(this._x + 1, this._y - 2);
    //x + 2 y + 1
    knightMoveCheck(this._x + 2, this._y + 1);
    //x + 2 y - 1
    knightMoveCheck(this._x + 2, this._y - 1);
    //x - 1 y + 2
    knightMoveCheck(this._x - 1, this._y + 2);
    //x - 1 y - 2
    knightMoveCheck(this._x - 1, this._y - 2);
    //x - 2 y + 1
    knightMoveCheck(this._x - 2, this._y + 1);
    //x - 2 y - 1
    knightMoveCheck(this._x - 2, this._y - 1);

    return validMoves;
  }
}
