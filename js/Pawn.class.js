"use strict"
//Piestininkas
class Pawn extends ChessPiece {
  constructor(x, y, type, color, img) {
    super(x, y, type, color, img)
    this._startPos = true;
  }
  //reikalinga tiems atvejams kai piestinkas yra stumiamas atgal
  toggleStartPos() {
    if (this._startPos) {
      this._startPos = false;
    } else {
      this._startPos = true;
    }
  }
  movePiece(game, x, y) {
    let chessBoard = game.getBoard();
    let special = undefined;
    let imgSrc = "";
    let img = "";

    if (this._startPos) {
      this._startPos = false;
      special = CHANGE_START;
    }

    if (y == 0 && this._color == WHITE) {
      imgSrc = "http://www.matn.co.uk/__chess/png/wqueen.png";
      img = $("<img src = " + imgSrc + " width='100' height='100'>");

      if (special == CHANGE_START) {
        special = CHANGE_START_PAWN_TRANSFORM;
      } else {
        special = PAWN_TRANSFORM;
      }
    } else if (y == BOARD_SIZE - 1 && this._color == BLACK) {
      imgSrc = "http://www.matn.co.uk/__chess/png/bqueen.png";
      img = $("<img src = " + imgSrc + " width='100' height='100'>");

      if (special == CHANGE_START) {
        special = CHANGE_START_PAWN_TRANSFORM;
      } else {
        special = PAWN_TRANSFORM;
      }
    }

    game.registerMove(this._x, this._y, x, y, special);

    //jeigu transformacija
    if (special == PAWN_TRANSFORM || special == CHANGE_START_PAWN_TRANSFORM) {
      // chessBoard[x][y] = new Queen(x, y, "queen", this._color, img[0]);
      createDialog(game);
    }

    chessBoard[x][y] = this;
    chessBoard[this._x][this._y] = undefined;
    this._x = x;
    this._y = y;
  }

  getValidMoves(game) {
    let chessBoard = game.getBoard();
    let validMoves = [];
    //piestininko ejimo kryptis (priklauso nuo spalvos)
    let dir = 0;
    if (this._color == WHITE) {
      dir = -1;
    } else {
      dir = 1;
    }
    //tikrinam ar piestininko ejimas per viena langeli galimas
    if (chessBoard[this._x][this._y + 1 * dir] == undefined) {
      pushMove(validMoves, this._x, this._y + 1 * dir, false);

      //tikrinam ar piestininko ejimas per du langelius galimas
      if (this._startPos && chessBoard[this._x][this._y + 2 * dir] == undefined) {
        pushMove(validMoves, this._x, this._y + 2 * dir, false);
      }
    }
    //tikrinam ar piestininkas nera prie desines sienos
    if (this._x != (BOARD_SIZE - 1)) {
      //tikrinam ar piestinkas gali atlikti kirtima i desine
      let kill = killCheck(chessBoard, this._x, this._y, this._x + 1, this._y + 1 * dir);

      if (kill) {
        pushMove(validMoves, this._x + 1, this._y + 1 * dir, kill);
      }
    }
    //tikrinam ar piestinkas nera prie kaires sienos
    if (this._x != 0) {
      //tikrinam ar piestinkas gali atlikti kirtima i kaire
      let kill = killCheck(chessBoard, this._x, this._y, this._x - 1, this._y + 1 * dir);

      if (kill) {
        pushMove(validMoves, this._x - 1, this._y + 1 * dir, kill);
      }
    }

    return validMoves;
  }
}
