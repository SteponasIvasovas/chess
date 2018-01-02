"use strict"
//nupiesiam || perpiesiam lenta
function drawBoard(chessBoard) {
  let canvas = $("#my-canvas");
  let ctx = canvas[0].getContext("2d");

  // paisom grida
  for(let i = 0; i <= boardWidth; i += cellSize) {
    for(let j = 0; j <= boardHeight; j += cellSize) {
      ctx.fillStyle = setCellColor(i / cellSize, j / cellSize);
      ctx.fillRect(i, j, cellSize, cellSize);
      ctx.stroke();
    }
  }

  // paisom sachmatu figurass
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      if (chessBoard[i][j] != undefined) {
        let chessPiece = chessBoard[i][j];
        let img = chessPiece.getImg();
        ctx.drawImage(img, i * cellSize, j * cellSize, cellSize, cellSize);
      }
    }
  }
}
//atspaudinam paskutini ejima
function printLastMove(game) {
  let lastMove = game.getLastMove();

  if (lastMove == undefined) {
    return;
  }

  let killPieceType = ""
  let special = "";
  let div = $("#move-container ol");

  if (lastMove.killPiece != undefined) {
    killPieceType = lastMove.killPiece.getType();
  }

  if (lastMove.special == PAWN_TRANSFORM) {
    special = "TRANSFORM";
  }


  let p = $("<li> " + game.getTurn() + ": " + lastMove.oldPiece.getType() + " [" + lastMove.oldX + "][" + lastMove.oldY + "] => " + killPieceType + " [" + lastMove.moveX + "][" + lastMove.moveY + "] " + special + "</li>");
  div.append(p);
}

function unprintLastMove() {
  $("#move-container ol li:last-child").remove();
}
//jeigu ejimas teisingas idedam ji i galima ejimu masyva
function pushMove(validMoves, x, y, kill) {
  let validMove = {
    v_x: x,
    v_y: y,
    v_kill: kill
  }

  validMoves.push(validMove);
}

//lyginam figuru spalvas jeigu skirtingos tai imetam i galimus ejimus
function killCheck(chessBoard, x, y, xKill, yKill) {
  if (chessBoard[xKill][yKill] != undefined) {
    let thisPiece = chessBoard[x][y];
    let killPiece = chessBoard[xKill][yKill];

    if (thisPiece.getColor() != killPiece.getColor()) {
      return true;
    } else {
      return false;
    }
  }
};

//jei kill move grazinam true ir sustabdom tikrinimo cikla
//tikrinimas damos, boksto, dramblio ir karalius ejimai
function moveValidation(chessBoard, x, y, xCheck, yCheck, validMoves) {
  let kill = false;
  let stop = true;
  if (chessBoard[xCheck][yCheck] == undefined) {
    pushMove(validMoves, xCheck, yCheck, kill);
    return !stop;
  } else {
    kill = killCheck(chessBoard, x, y, xCheck, yCheck);

    if (kill) {
      pushMove(validMoves, xCheck, yCheck, kill);
    }

    return stop;
  }
}

//patikrinimai ejimu damai, karaliui, bokstui ir drambliui
//xThis, yThis - dabartines figuros koordinates
//xMove, yMove - judejimo kryptis
//xLimit, yLimit - judeimo apribojimai
function moveCheck(chessBoard, xThis, yThis, xMove, yMove, xLimit, yLimit, validMoves) {
  for (let x = xThis, y = yThis; x != xLimit && y != yLimit; x+=xMove, y+=yMove) {
    let xCheck = x + xMove;
    let yCheck = y + yMove;

    if (xCheck < 0 || xCheck >= BOARD_SIZE || yCheck < 0 || yCheck >= BOARD_SIZE) {
      return;
    }

    if (moveValidation(chessBoard, xThis, yThis, xCheck, yCheck, validMoves)) {
      break;
    }
  }
}

//nustatom tinkama langelio spalva
function setCellColor(x, y) {
  if ((x + y) % 2 == 0) {
    return "#4b3e34"; // ruda spalva
  } else {
    return "#ffffff"; // balta spalva
  }
}

function highlightMoves(game, chessPiece) {
  let canvas = $("#my-canvas");
  let ctx = canvas[0].getContext("2d");
  let x = chessPiece.getX();
  let y = chessPiece.getY();

  //melynai nuspalvinam pasirinkta figura
  ctx.fillStyle = "rgba(0, 0, 100, 0.75)";
  ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
  let validMoves = chessPiece.getValidMoves(game);

  for (let i = 0; i < validMoves.length; i++) {
    let validMove = validMoves[i];

    if (validMove.v_kill) {
      //raudonai spalvinam kirtimo judesius
      ctx.fillStyle = "rgba(100, 0, 0, 0.75)";
    } else {
      //zaliai spalvinam nekirtimo judesius
      ctx.fillStyle = "rgba(0, 100, 0, 0.75)";
    }

    ctx.fillRect(validMove.v_x * cellSize, validMove.v_y * cellSize, cellSize, cellSize);
  }
}
