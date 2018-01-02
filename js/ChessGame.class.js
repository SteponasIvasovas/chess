//Sachmatu zaidimas
class ChessGame {
  constructor() {
    this._blackKing = undefined;
    this._whiteKing = undefined;
    this._chessBoard = this.initBoard();
    this._turn = WHITE;
    this._state = STATE_GAME;
    this._mode = GAME_MODE;
    this._registeredMoves = [];
  }
  toggleMode() {
    if (this._mode == GAME_MODE) {
      this._mode = EDIT_MODE;
    } else {
      this._mode = GAME_MODE;
    }
  }
  getMode() {
    return this._mode;
  }
  changeTurn() {
    if (this._turn == WHITE) {
      this._turn = BLACK;
    } else {
      this._turn = WHITE;
    }
  }

  getTurn() {
    return this._turn;
  }
  getBoard() {
    return this._chessBoard;
  }
  resetBoard() {
    this._chessBoard = this.initBoard();
    this._registeredMoves = [];
    this._turn = WHITE;
    console.log(this._turn);
    this._state = STATE_GAME;
  }
  getKing() {
    if (this._turn == WHITE) {
      return this._whiteKing;
    } else {
      return this._blackKing;
    }
  }
  getLastMove() {
    if (this._registeredMoves.length == 0) {
      return undefined;
    }
    return this._registeredMoves[this._registeredMoves.length - 1];
  }
  registerMove(oldX, oldY, moveX, moveY, special = undefined) {
    let registeredMove = {
      oldX: oldX,
      oldY: oldY,
      oldPiece: this._chessBoard[oldX][oldY],
      moveX: moveX,
      moveY: moveY,
      killPiece: this._chessBoard[moveX][moveY],
      special: special,
      state: this._state,
      turn: this._turn
    };

    this._registeredMoves.push(registeredMove);
  }
  //panaikinam paskutini ejima
  //funkcija grazina true jei tokiu ejimu yra
  //false jei tokiu ejimu nera
  rollBack() {
    if (this._registeredMoves.length == 0) {
      return null;
    }

    let rollBackMove = this._registeredMoves.pop();

    this._chessBoard[rollBackMove.oldX][rollBackMove.oldY] = rollBackMove.oldPiece;
    rollBackMove.oldPiece.setX(rollBackMove.oldX);
    rollBackMove.oldPiece.setY(rollBackMove.oldY);
    switch (rollBackMove.special) {
      case CHANGE_START_PAWN_TRANSFORM:
      case CHANGE_START:
        rollBackMove.oldPiece.toggleStartPos();
        break;
      case WHITE_KING_CASTLE_RIGHT:
      case BLACK_KING_CASTLE_RIGHT:
      case WHITE_KING_CASTLE_LEFT:
      case BLACK_KING_CASTLE_LEFT:
        rollBackMove.oldPiece.toggleStartPos();
        this.rollBack();
      default:
    }
    this._chessBoard[rollBackMove.moveX][rollBackMove.moveY] = rollBackMove.killPiece;
    this._state = rollBackMove.state;
    this._turn = rollBackMove.turn;
    return rollBackMove;
  }
  getState() {
    return this._state;
  }
  setState() {
    for(let i = 0; i < this._chessBoard.length; i++) {
      for(let j = 0; j < this._chessBoard[i].length; j++) {
        let chessPiece = this._chessBoard[i][j];

        if (chessPiece != undefined && this.getTurn() == chessPiece.getColor()) {
          let validMoves = chessPiece.getValidMoves(this);
          for (let k = 0; k < validMoves.length; k++) {
            let validMove = validMoves[k];

            chessPiece.movePiece(this, validMove.v_x, validMove.v_y);
            let invalidMoves = chessPiece.getInvalidMoves(this, validMove.v_x, validMove.v_y);
            this.rollBack();

            if (invalidMoves == null) {
              this._state = STATE_GAME;
              return;
            }
          }
        }
      }
    }

    if (this.getTurn() == WHITE) {
      this._state = STATE_BLACK_WIN;
    } else {
      this._state = STATE_WHITE_WIN;
    }

  }
  //sukuriam sachmatu lenta ir pastatom ant jos figuras
  initBoard() {
    let chessBoard = new Array(8);

    for (let i = 0; i < 8; i++) {
      chessBoard[i] = new Array(8);
    }

    let x = 0;
    let y = 0;
    let type = "";
    let color = "";
    let img = "";
    let imgSrc = "";

    //pridedam juodus pestininkus
    type = "pawn";
    color = BLACK;
    imgSrc = "http://www.matn.co.uk/__chess/png/bpawn.png";
    img = $("<img src = " + imgSrc + " width='100' height='100'>");
    for (let i = 0; i < 8; i++) {
      //x = i, y = 1
      chessBoard[i][1] = new Pawn(i, 1, type, color, img[0], true);
    }

    //pridedam baltus pestininkus
    type = "pawn";
    color = WHITE;
    imgSrc = "http://www.matn.co.uk/__chess/png/wpawn.png";
    img = $("<img src = " + imgSrc + " width='100' height='100'>");
    for (let i = 0; i < 8; i++) {
      //x = i, y = 6
      chessBoard[i][6] = new Pawn(i, 6, type, color, img[0], true);
    }

    //pridedam juodus bokstus
    type = "rook";
    color = BLACK;
    imgSrc = "http://www.matn.co.uk/__chess/png/brook.png";
    img = $("<img src = " + imgSrc + " width='100' height='100'>");
    //x = 0, y = 0
    chessBoard[0][0] = new Rook(0, 0, type, color, img[0]);
    //x = 7, y = 0
    chessBoard[7][0] = new Rook(7, 0, type, color, img[0]);

    //pridedam baltus bokstus
    type = "rook";
    color = WHITE;
    imgSrc = "http://www.matn.co.uk/__chess/png/wrook.png";
    img = $("<img class = 'rook' src = " + imgSrc + " width='100' height='100'>");
    //x = 0, y = 7
    chessBoard[0][7] = new Rook(0, 7, type, color, img[0]);
    //x = 7, y =7
    chessBoard[7][7] = new Rook(7, 7, type, color, img[0]);

    //pridedam juodus arklius
    type = "knight";
    color = BLACK;
    imgSrc = "http://www.matn.co.uk/__chess/png/bknight.png"
    img = $("<img src = " + imgSrc + " width='100' height='100'>");
    //x = 1, y = 0
    chessBoard[1][0] = new Knight(1, 0, type, color, img[0]);
    //x = 6, y = 0
    chessBoard[6][0] = new Knight(6, 0, type, color, img[0]);

    //prideddam baltus arklius
    type = "knight";
    color = WHITE;
    imgSrc = "http://www.matn.co.uk/__chess/png/wknight.png";
    img = $("<img src = " + imgSrc + " width='100' height='100'>");
    //x = 1, y = 7
    chessBoard[1][7] = new Knight(1, 7, type, color, img[0]);
    //x = 6, y = 7
    chessBoard[6][7] = new Knight(6, 7, type, color, img[0]);

    //pridedam juodus dramblius
    type = "bishop";
    color = BLACK;
    imgSrc = "http://www.matn.co.uk/__chess/png/bbishop.png";
    img = $("<img src = " + imgSrc + " width='100' height='100'>");
    //x = 2, y = 0
    chessBoard[2][0] = new Bishop(2, 0, type, color, img[0]);
    //x = 5, y = 0
    chessBoard[5][0] = new Bishop(5, 0, type, color, img[0]);

    //pridedam baltus dramblius
    type = "bishop";
    color = WHITE;
    imgSrc = "http://www.matn.co.uk/__chess/png/wbishop.png";
    img = $("<img src = " + imgSrc + " width='100' height='100'>");
    //x = 2, y = 7
    chessBoard[2][7] = new Bishop(2, 7, type, color, img[0]);
    //x = 5, y = 7
    chessBoard[5][7] = new Bishop(5, 7, type, color, img[0]);

    //pridedam juoda karaliene
    type = "queen";
    color = BLACK;
    imgSrc = "http://www.matn.co.uk/__chess/png/bqueen.png";
    img = $("<img src = " + imgSrc + " width='100' height='100'>");
    //x = 3, y = 0
    chessBoard[3][0] = new Queen(3, 0, type, color, img[0]);

    //pridedam balta karaliene
    type = "queen";
    color = WHITE;
    imgSrc = "http://www.matn.co.uk/__chess/png/wqueen.png";
    img = $("<img src = " + imgSrc + " width='100' height='100'>");
    //x = 4, y = 7
    chessBoard[4][7] = new Queen(4, 7, type, color, img[0]);

    //pridedam juoda karaliu
    type = "king";
    color = BLACK;
    imgSrc = "http://www.matn.co.uk/__chess/png/bking.png";
    img = $("<img src = " + imgSrc + " width='100' height='100'>");
    //x = 4, y = 0
    chessBoard[4][0] = new King(4, 0, type, color, img[0]);
    this._blackKing = chessBoard[4][0];

    //pridedam balta karaliu
    type = "king";
    color = WHITE;
    imgSrc = "http://www.matn.co.uk/__chess/png/wking.png";
    img = $("<img src = " + imgSrc + " width='100' height='100'>");
    //x = 3, y = 7
    chessBoard[3][7] = new King(3, 7, type, color, img[0]);
    this._whiteKing = chessBoard[3][7];

    return chessBoard;
  }
}
