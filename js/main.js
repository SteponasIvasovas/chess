

$(document).ready(function(){
  //inicializuojam sachmatu lenta
  let game = new ChessGame();
  let canvas = $("#my-canvas");
  let ctx = canvas[0].getContext("2d");
  resizeCanvas();
  drawBoard(game.getBoard());
  //undefined reiskia figura nera paspausta
  //jei reiskme reiskia figura yra paspausta ir galima ja judinti
  let selectedPiece = undefined;
  let selectedPieceRC = undefined;

  window.addEventListener('resize', function() {
    resizeCanvas();
    drawBoard(game.getBoard());
  });

  $("#my-canvas").click(function(e) {
    if (game.getMode() != GAME_MODE) {
      return;
    }

    if (game.getState() == STATE_GAME && selectedPiece == undefined) {
      // e.PageX, e.PageY - paspaudimo koordinates
      // my-canvas.offset().left, my-canvas.offset().top - canvas pradzios koordinates (virsutinis kairysis kampas)
      let x = Math.floor((e.pageX- canvas.offset().left) / cellSize);
      let y = Math.floor((e.pageY- canvas.offset().top) / cellSize);
      let chessBoard = game.getBoard();
      if (chessBoard[x][y] != undefined) {
        selectedPiece = chessBoard[x][y];

        if (selectedPiece.getColor() != game.getTurn()) {
          selectedPiece = undefined;
          // drawBoard(chessBoard);
        } else {
          highlightMoves(game, selectedPiece);
        }
      }
    } else if (game.getState() == STATE_GAME) {
      let xMove = Math.floor((e.pageX- canvas.offset().left) / cellSize);
      let yMove = Math.floor((e.pageY- canvas.offset().top) / cellSize);
      let chessBoard = game.getBoard();

      //patikrinam ar paspaustas langelis yra figura jei taip ar ji tos pacios spalvos
      //jeigu ji tos pacios spalvos tuomet pakeiciam ejimus i naujai pasirinkta figura
      if (chessBoard[xMove][yMove] != undefined) {
        if (selectedPiece.getColor() == chessBoard[xMove][yMove].getColor()) {
          drawBoard(chessBoard);
          selectedPiece = chessBoard[xMove][yMove];
          highlightMoves(game, selectedPiece);
          return;
        }
      }

      let validMoves = selectedPiece.getValidMoves(game);

      for (let i = 0; i < validMoves.length; i++) {
        let validMove = validMoves[i];
        //tikrinam ar pasirinktas ejimas yra legalus ejimas
        if (validMove.v_x == xMove && validMove.v_y == yMove) {
          //suteikiam figurai naujas koordinates
          selectedPiece.movePiece(game, xMove, yMove);
          //tikrinam ar ejimas nesukels sacho jei sukelia grazinam sena padeti
          let invalidMoves = selectedPiece.getInvalidMoves(game, xMove, yMove);
          if (invalidMoves != null) {
            //pazymim langelius kurie sukelia sacha
            for (let i = 0; i < invalidMoves.length; i++) {
              let invalidMove = invalidMoves[i];
              let color = "red";

              let blink = setInterval(function() {
                if (color == "red") {
                  ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
                  ctx.fillRect(invalidMove.v_x * cellSize, invalidMove.v_y * cellSize, cellSize, cellSize);
                  color = "default";
                } else {
                  ctx.fillStyle = setCellColor(invalidMove.v_x, invalidMove.v_y);
                  ctx.fillRect(invalidMove.v_x * cellSize, invalidMove.v_y * cellSize, cellSize, cellSize);
                  ctx.drawImage(chessBoard[invalidMove.v_x][invalidMove.v_y].getImg(), invalidMove.v_x * cellSize, invalidMove.v_y * cellSize, cellSize, cellSize);
                  color = "red";
                }
              }, 250);

              setTimeout(function() {
                clearInterval(blink);
              }, 1000);
            }
            //grazinam sachmatu lenta i padeti pries padarant ejima
            //sitas procesas yra tik kode ir ant lentos nematomas
            game.rollBack();
            drawBoard(chessBoard);
            break;
          }
          //perpiesiam pasikeitusia lenta
          printLastMove(game);
          game.changeTurn();
          selectedPiece = undefined;
          //perpiesiam pasikeitusia lenta
          drawBoard(chessBoard);
          //patikrinam ar ejimas sukele mata
          game.setState();
          switch (game.getState()) {
            case STATE_GAME:
              break;
            case STATE_BLACK_WIN:
              alert("BLACK WINS! CONGRATULATIONS");
              break;
            case STATE_WHITE_WIN:
              alert("WHITE WINS! CONGRATULATIONS");
          }

          break;
        }
      }
    }
  });

  $("#undo-btn").click(function() {
    let lastMove = game.rollBack();
    if (lastMove != null) {
      drawBoard(game.getBoard());
      if (game.getMode() == EDIT_MODE) {
        ctx.fillStyle = "rgba(200, 200, 200, 0.25)";
        ctx.fillRect(0, 0, boardWidth, boardHeight);
      }
      unprintLastMove();
    }

  });

  $("#edit-btn").click(function() {
    game.toggleMode();
    drawBoard(game.getBoard());

    if (game.getMode() == GAME_MODE) {
      $("#edit-btn").removeClass("active");
    } else {
      $("#edit-btn").addClass("active");
      ctx.fillStyle = "rgba(200, 200, 200, 0.25)";
      ctx.fillRect(0, 0, boardWidth, boardHeight);
    }
  });

  $("#reset-btn").click(function() {
    game.resetBoard();
    drawBoard(game.getBoard());
    $("ol").empty();
  });

  $("#my-canvas").click(function(e) {
    if (game.getMode() != EDIT_MODE) {
      return;
    }

    if (selectedPieceRC == undefined) {
      let x = Math.floor((e.pageX- canvas.offset().left) / cellSize);
      let y = Math.floor((e.pageY- canvas.offset().top) / cellSize);
      let chessBoard = game.getBoard();
      selectedPieceRC = chessBoard[x][y];
      ctx.fillStyle = "rgba(0, 255, 0, 0.75)";
      ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    } else {
      let xMove = Math.floor((e.pageX- canvas.offset().left) / cellSize);
      let yMove = Math.floor((e.pageY- canvas.offset().top) / cellSize);
      //disable castling
      selectedPieceRC.movePiece(game, xMove, yMove, false);
      selectedPieceRC = undefined;
      drawBoard(game.getBoard());
      ctx.fillStyle = "rgba(200, 200, 200, 0.25)";
      ctx.fillRect(0, 0, boardWidth, boardHeight);
    }
  });

  $("#dialog-btn").click(function() {
    createDialog(game)
  });

  $("#info-btn").click(function () {
    alert('Chess for one player(for now, still working on websockets) written using javascript with jquery library.\nButtons :\n1) Undo - revert last move\n2) Edit - Click once to enter edit mode and move any piece freely across the board, once you are done moving pieces around click edit once again to get back to normal mode\n3) Reset - click reset button to reset game\nKnown problems:\n1) On the first load, image files of chess pieces might not load, refresh page or click reset button to fix this problem');
  });


});

function resizeCanvas() {
  let canvas = $("#my-canvas");
  let moveListBlock = $("#move-container");
  boardWidth = $("#canvas-container").width();

  boardHeight = boardWidth;
  cellSize = boardWidth / 8;
  //-4 del borderio
  canvas[0].width = boardWidth - 4;
  canvas[0].height = boardHeight - 4;
  moveListBlock.height(boardHeight - 4);
}

function createDialog(game) {
  let canvasContainer = $("#canvas-container");
  let div = $("<div id='dialog'>");
  let p = $("<p>Dialog test</p>");
  let a = $("<a href='#'>");
  let color = "b";
  if (game.getTurn() == WHITE) {
    color = "w";
  }
  let imgSrc = "img/" + color +"queen.png";
  let img1 = $("<img src = " + imgSrc + " width='100' height='100'>");
  a.append(img1);
  a.click(function(){
    choosePiece(game, 1, img1[0]);
  });
  div.append(a);
  imgSrc = "img/" + color + "rook.png";
  let img2 = $("<img src = " + imgSrc + " width='100' height='100'>");
  a = $("<a>");
  a.append(img2);
  a.click(function(){
    choosePiece(game, 2, img2[0]);
  });
  div.append(a);
  imgSrc = "img/" + color + "knight.png";
  let img3 = $("<img src = " + imgSrc + " width='100' height='100'>");
  a = $("<a>");
  a.append(img3);
  a.click(function(){
    choosePiece(game, 3, img3[0]);
  });
  div.append(a);
  imgSrc = "img/" + color + "bishop.png";
  let img4 = $("<img src = " + imgSrc + " width='100' height='100'>");
  a = $("<a>");
  a.append(img4);
  a.click(function(){
    choosePiece(game, 4, img4[0]);
  });
  div.append(a);
  canvasContainer.append(div);
  $("#move-container").append("<div id='curtain'>");
}

function choosePiece(game, pieceNr, img) {
  let lastMove = game.getLastMove();
  let chessBoard = game.getBoard();
  let chessPiece = undefined;

  switch (pieceNr) {
    case 1:
      chessPiece = new Queen(lastMove.moveX, lastMove.moveY, "queen", lastMove.turn, img);
      break;
    case 2:
      chessPiece = new Rook(lastMove.moveX, lastMove.moveY, "rook", lastMove.turn, img);
      break;
    case 3:
      chessPiece = new Knight(lastMove.moveX, lastMove.moveY, "knight", lastMove.turn, img);
      break;
    case 4:
      chessPiece = new Bishop(lastMove.moveX, lastMove.moveY, "bishop", lastMove.turn, img);
      break;
  }

  chessBoard[lastMove.moveX][lastMove.moveY] = chessPiece;
  $("#dialog").remove();
  $("#curtain").remove();
  drawBoard(chessBoard);
  game.setState();
  switch (game.getState()) {
    case STATE_GAME:
      break;
    case STATE_BLACK_WIN:
      alert("BLACK WINS! CONGRATULATIONS")
      break;
    case STATE_WHITE_WIN:
      alert("WHITE WINS! CONGRATULATIONS")
  }
}
