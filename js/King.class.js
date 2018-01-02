"use strict"
// Karalius
class King extends ChessPiece {
  constructor(x, y, type, color, img) {
    super(x, y, type, color, img);
    // this._checked = false;
    this._startPos = true;
  }
  toggleStartPos() {
    if (this._startPos) {
      this._startPos = false;
    } else {
      this._startPos = true;
    }
  }
  movePiece(game, x, y, castlingEnabled = true) {
    let chessBoard = game.getBoard();
    let special = undefined;
    if (this._startPos) {
      this._startPos = false;
      special = CHANGE_START;
    }

    if (castlingEnabled) {
      if ((this._x - x) == -2 && this._color == WHITE) {
        this._startPos = false;
        special = WHITE_KING_CASTLE_RIGHT;
      } else if ((this._x - x) == -2 && this._color == BLACK) {
        this._startPos = false;
        special = BLACK_KING_CASTLE_RIGHT;
      } else if ((this._x - x) == 2 && this._color == WHITE) {
        this._startPos = false;
        special = WHITE_KING_CASTLE_LEFT;
      } else if ((this._x - x) == 2 && this._color == BLACK) {
        this._startPos = false;
        special = BLACK_KING_CASTLE_LEFT;
      }
    }

    let rook = undefined;
    switch (special) {
      case WHITE_KING_CASTLE_RIGHT:
        rook = chessBoard[7][7];
        rook.movePiece(game, 4, 7);
        break;
      case BLACK_KING_CASTLE_RIGHT:
        rook = chessBoard[7][0];
        rook.movePiece(game, 5, 0);
        break;
      case WHITE_KING_CASTLE_LEFT:
        rook = chessBoard[0][7];
        rook.movePiece(game, 2, 7);
        break;
      case BLACK_KING_CASTLE_LEFT:
        rook = chessBoard[0][0];
        rook.movePiece(game, 3, 0);
        break;
    }

    game.registerMove(this._x, this._y, x, y, special);
    chessBoard[x][y] = this;
    chessBoard[this._x][this._y] = undefined;
    this._x = x;
    this._y = y;
  }

  getValidMoves(game, castlingEnabled = true) {
    let chessBoard = game.getBoard();
    let validMoves = [];

    //8 kryptis
    //desine i virsu - nuo dabartines pozicijos iki (BOARD_SIZE - 1, BOARD_SIZE - 1)
    moveCheck(chessBoard, this._x, this._y, 1, 1, this._x + 1, this._y + 1, validMoves);
    //desine zemyn - nuo dabartines pozicijos iki (BOARD_SIZE - 1, 0)
    moveCheck(chessBoard, this._x, this._y, 1, -1, this._x + 1, this._y - 1, validMoves);
    //kaire zemyn - nuo dabartines pozicijos iki (0, 0)
    moveCheck(chessBoard, this._x, this._y, -1, -1, this._x - 1, this._y - 1, validMoves);
    //kaire i virsu - nuo dabartines pozicijos iki (0, BOARD_SIZE - 1)
    moveCheck(chessBoard, this._x, this._y, -1, 1, this._x - 1, this._y + 1, validMoves);
    //tikrinam ejimus i desine nuo dabartines pozicijos iki x < BOARD_SIZE - 1
    moveCheck(chessBoard, this._x, this._y, 1, 0, this._x + 1, -1, validMoves)
    //tikrinam ejimus i kaire nuo dabartines pozicijos iki x > 0
    moveCheck(chessBoard, this._x, this._y, -1, 0, this._x - 1, -1, validMoves);
    //tikrinam ejimus i virsu nuo dabartines pozicijos iki y > 0
    moveCheck(chessBoard, this._x, this._y, 0, -1, -1, this._y - 1, validMoves);
    //tikrinam ejimus i apacia nuo dabartines pozicijos iki y < BOARD_SIZE - 1
    moveCheck(chessBoard, this._x, this._y, 0, 1, -1, this._y + 1, validMoves);

    let dir = ((this._color == WHITE) ? 1 : -1);

    if (castlingEnabled && this.castlingCheck(game, 4 * dir, 1 * dir)) {
      pushMove(validMoves, this._x + 2 * dir, this._y, false);
    }
    if (castlingEnabled && this.castlingCheck(game, -3 * dir, -1 * dir)) {
      pushMove(validMoves, this._x - 2 * dir, this._y, false);
    }

    return validMoves;
  }

  //tikrinam ar ejimas prives prie sacho
  getInvalidMoves(game, x = this._x, y = this._y, castlingEnabled = true) {
    let invalidMoves = [];

    //visa sita mesmale del mirksejimo
    if (castlingEnabled) {
      let lastMove = game.getLastMove();

      switch(lastMove.special) {
        case WHITE_KING_CASTLE_RIGHT:
        case WHITE_KING_CASTLE_LEFT:
        case BLACK_KING_CASTLE_RIGHT:
        case BLACK_KING_CASTLE_LEFT:
        if (Math.abs(lastMove.oldX - this._x) == 2) {
          let diff = this._x - lastMove.oldX;
          let tempMoves = this.getInvalidMoves(game, lastMove.oldX, this._y, false);

          if (tempMoves != null) {
            invalidMoves = invalidMoves.concat(tempMoves);
          }

          tempMoves = this.getInvalidMoves(game, lastMove.oldX + (diff/2), this._y, false);

          if (tempMoves != null) {
            invalidMoves = invalidMoves.concat(tempMoves);
          }
        }
      }
    }

    let chessBoard = game.getBoard();
    let thisX = this._x;
    let thisY = this._y;

    let checkKingMove = function(chessPiece) {
      //isimenam dabartinio karaliu
      let thisPiece = chessBoard[x][y];

      //priskiriam tikrinamam langeliui figura pagal kuria tikrinsim ar ji sukelia sacha
      chessBoard[x][y] = chessPiece;
      let validMoves = chessPiece.getValidMoves(game, false);

      //po ejimu gavimo atstatom buvusia figura i padeti
      chessBoard[x][y] = thisPiece;

      for (let i = 0; i < validMoves.length; i++) {
        let validMove = validMoves[i];
        //tikrinam ar yra kirtimo ejimu, jei taip tikrinam tikrinam ar figura yra to pacio tipo
        //jei salyga teigiama grazinam kad ejimas nera legalus
        if (validMove.v_kill && chessBoard[validMove.v_x][validMove.v_y].getType() == chessPiece.getType()) {
          pushMove(invalidMoves, validMove.v_x, validMove.v_y);
        }
      }
    }

    checkKingMove(new Pawn(x, y, "pawn", this._color, ""));
    checkKingMove(new Rook(x, y, "rook", this._color, ""));
    checkKingMove(new Knight(x, y, "knight", this._color, ""));
    checkKingMove(new Bishop(x, y, "bishop", this._color, ""));
    checkKingMove(new Queen(x, y, "queen", this._color, ""));
    checkKingMove(new King(x, y, "king", this._color, ""));

    if (invalidMoves.length > 0) {
      return invalidMoves;
    } else {
      return null;
    }

  }

  castlingCheck(game, limit, dir) {
    let chessBoard = game.getBoard();
    let clear = false;

    if (this._startPos) {
      clear = true;
    }

    for (let i = 1 * dir; i != limit; i += dir) {
      if (chessBoard[this._x + i][this._y] != undefined) {
        clear = false;
        break;
      }
    }

    if (clear) {
      let rook = chessBoard[this._x + limit][this._y];
      if (rook != undefined && rook.getType() == "rook" && rook.getStartPos()) {
        return clear;
      } else {
        clear = false;
      }
    }

    return clear;
  }
}
