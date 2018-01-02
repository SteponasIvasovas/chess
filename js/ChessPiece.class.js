"use strict"
//sachmatu figura
class ChessPiece {
  //dummy defaultai yra skirti karaliaus sacho tikrinimui
  constructor(x, y, type, color, img) {
    this._x = x; //x coordinate
    this._y = y; //y coordinate
    this._type = type; //chess piece type
    this._color = color; //chess piece color
    this._img = img; //chess piece image
  }
  getX() {
    return this._x;
  }
  setX(x) {
    this._x = x;
  }
  getY() {
    return this._y;
  }
  setY(y) {
    this._y = y;
  }
  getType() {
    return this._type;
  }
  getColor() {
    return this._color;
  }
  getImg() {
    return this._img;
  }
  movePiece(game, x, y) {
    let chessBoard = game.getBoard();
    //specialus ejimas
    //CHANGE_START_POS - pradines padeties pakeitimas - galioja bokstui, karaliui, ir piestininkui
    //2. piestininko transformacija
    //3. rakiruote
    //1. ir 3. kartu
    game.registerMove(this._x, this._y, x, y);
    //priskiriam esama figura i nauja vieta
    chessBoard[x][y] = this;
    //undefininam sena vieta
    chessBoard[this._x][this._y] = undefined;
    //atnaujinam figuros koordinates
    this._x = x;
    this._y = y;
  }

  //funkcija kvieciama atlikus ejima, paduodamos naujos koordinates
  //tada paemamas atitinkamas karalius ir paskaiciuojama ar naujas sachmatu issidestymas sukelia sacha
  //jei taip grazinamas masyvas su figuru koordinatemis kurios sukelia sacha atlikus si ejima
  //poto ejimas anuliuojamas
  getInvalidMoves(game, x, y) {
    let king = game.getKing();
    //gaunam ar ejimas sukels sacha
    let killMoves = king.getInvalidMoves(game);

    if (killMoves == null) {
      return null;
    }

    if (killMoves > 1) {
      return killMoves;
    }

    for (let i = 0; i < killMoves.length; i++) {
      if (killMoves[i].v_x == x && killMoves[i].v_y == y) {
        return null;
      }
    }

    return killMoves;
  }
}
