/**
 * The message to show when there is an error.
 * @const {string}
 */
const errMsg = "Please copy this and comment below, I will fix it: ";
/**
 * The game board.
 * Left up corner has index 0 and right bottom corner has index 8.
 * Each element can be 0 for empty, 1 for player token placed, or 2 for computer token placed.
 * @var {Array.<number>}
 */
let gameBoard = [0, 0, 0,
                 0, 0, 0,
                 0, 0, 0];
/**
 * The moves log, displayed if the player wins.
 * The first letter indicates who starts first, c for computer and p for player.
 * The rest of the characters will be moves order log, they will be logged as indexes of gameBoard.
 * @var {string}
 */
let playback = "";
/**
 * The player's token.
 * Can be "X" or "O", player and computer must have different tokens.
 * @var {string}
 */
let playerToken = "X";
/**
 * Whether or not the game is still running.
 * @var {boolean}
 */
let isGameRunning = false;

/**
 * Check if the place is empty then place the token, log the move in playback, then update the screen.
 * This function will not check if the game is still running.
 * @function
 * @param {number} place - The index of the place to place the token.
 * @param {number} token - The token state, see gameBoard for more information.
 * @return {boolean} True if the token is successfully placed, false otherwise.
 */
const placeToken = function (place, token) {
    if (gameBoard[place] === 0) {
        //Update game board and playback
        gameBoard[place] = token;
        playback += place.toString();
        //Update screen
        if (gameBoard[place] === 1) {
            $("#" + place.toString()).text(playerToken).css("color", "darkgreen");
        } else if (gameBoard[place] === 2) {
            $("#" + place.toString()).text(((playerToken === "X") ? "O" : "X")).css("color", "darkred");
        }
        return true;
    } else {
        return false;
    }
};
/**
 * Check if there is a winner or it is tied, then set isGameRunning to false, and finally, update the screen.
 * This function will not check if the game is still running.
 * @function
 */
const winCheck = function () {
    //Internal function, set isGameRunning to false then update state message
    const showEndMsg = function (winner) {
        //Set isGameRunning
        isGameRunning = false;
        //Show state message
        if (winner === 0) {
            $("#state").text("Tie! ");
        } else if (winner === 1) {
            $("#state").text("Player wins! " + errMsg + playback);
        } else if (winner === 2) {
            $("#state").text("Computer wins! ");
        }
    };
    //Internal function, check if the value in gameBoard at 3 places (should be a line) are same and not 0
    //Then end the game if they are the same
    const check = function (a, b, c) {
        if (gameBoard[a] !== 0 && gameBoard[a] === gameBoard[b] && gameBoard[b] === gameBoard[c]) {
            showEndMsg(gameBoard[a]);
            //Update color to highlight the 3 tokens that are lined up
            const color = ((gameBoard[a] === 1) ? "green" : "red");
            for (let i = 0; i < arguments.length; i++) {
                $("#" + arguments[i].toString()).css("color", color);
            }
        }
    };
    //Horizontal
    check(0, 1, 2);
    check(3, 4, 5);
    check(6, 7, 8);
    //Vertiacal
    check(0, 3, 6);
    check(1, 4, 7);
    check(2, 5, 8);
    //Diagonal
    check(0, 4, 8);
    check(2, 4, 6);
    //Tie
    if (!gameBoard.includes(0)) {
        showEndMsg(0);
    }
};
/**
 * Reset the game and let computer move once if computer starts.
 * @function
 * @param {boolean} computerStarts - Whether or not computer starts.
 */
const start = function (computerStarts) {
    //Reset variables
    gameBoard = [0, 0, 0,
                 0, 0, 0,
                 0, 0, 0];
    isGameRunning = true;
    playback = (computerStarts ? "c" : "p");
    //Reset screen
    $("#state").text("Your turn! ");
    $("th").text("");
    //Check if computer starts first
    if (computerStarts) {
        placeToken(algorithm(gameBoard), 2);
        //We do not need a win check here since only one move was done
    }
};
/**
 * When the document is ready, set up event handlers, then start the first game where player starts.
 * @function
 * @listens $(document).ready
 */
$(document).ready(function () {
    //Check if the browser is supported
    if (typeof Array.prototype.includes === "undefined") {
        $("#state").text("Sorry, your browser is not supported. ");
    } else {
        //=====Set up event handlers=====
        //Start buttons
        $("#playerStarts").click(start.bind(undefined, false));
        $("#computerStarts").click(start.bind(undefined, true));
        //Toggle token button
        $(".toggleToken").click(function () {
            //Update variable
            playerToken = ((playerToken === "X") ? "O" : "X");
            //Update screen
            $("th, .toggleToken").each(function () {
                if ($(this).text() === "X") {
                    $(this).text("O");
                } else if ($(this).text() === "O") {
                    $(this).text("X");
                }
            });
        });
        //Game board
        $("th").click(function () {
            //See if we can place the token
            if (isGameRunning && placeToken($(this).attr("id"), 1)) {
                //Check if game ended
                winCheck();
                //See if the game is still running
                if (isGameRunning) {
                    //Computer's turn
                    if (!placeToken(algorithm(gameBoard), 2)) {
                        //Failed to place conputer's token
                        isGameRunning = false;
                        $("#state").text("Algorithm error! " + errMsg + playback);
                    } else {
                        //Check if game ended again (this needs to be done after each move)
                        winCheck();
                    }
                }
            }
        });
        //Start the first game
        start(false);
    }
    //Load Disqus chat board
    disqusLoader("tictactoe-2", "http://jspenguin2017.github.io/TicTacToe/", "main", "Tic Tac Toe");
});
