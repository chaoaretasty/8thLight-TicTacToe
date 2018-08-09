//While node is an asynchronous environment synchronous user input is an acceptable exception
//At the very least while refactoring it makes sense to have this syncronous
const readlineSync = require('readline-sync');

var PositionEnum = {
	NONE: 0,
	SELF: 1,
	OPPONENT: 2,
	ANY: 3
};

//Questionable if enum value of enum label would be more appropriate here.
//The label is clearer but when written out patterns are much harder to see so its helpfulness is questionable
//Groups are ordered and labelled by type to help check

var moveToWin = [
	//Horizontal
	[[0, 1, 1, 3, 3, 3, 3, 3, 3],0],
	[[1, 0, 1, 3, 3, 3, 3, 3, 3],1],
	[[1, 1, 0, 3, 3, 3, 3, 3, 3],2],
	[[3, 3, 3, 0, 1, 1, 3, 3, 3],3],
	[[3, 3, 3, 1, 0, 1, 3, 3, 3],4],
	[[3, 3, 3, 1, 1, 0, 3, 3, 3],5],
	[[3, 3, 3, 3, 3, 3, 0, 1, 1],6],
	[[3, 3, 3, 3, 3, 3, 1, 0, 1],7],
	[[3, 3, 3, 3, 3, 3, 1, 1, 0],8],
	//Vertical
	[[0, 3, 3, 1, 3, 3, 1, 3, 3],0],
	[[1, 3, 3, 0, 3, 3, 1, 3, 3],3],
	[[1, 3, 3, 1, 3, 3, 0, 3, 3],6],
	[[3, 0, 3, 3, 1, 3, 3, 1, 3],1],
	[[3, 1, 3, 3, 0, 3, 3, 1, 3],4],
	[[3, 1, 3, 3, 1, 3, 3, 0, 3],7],
	[[3, 3, 0, 3, 3, 1, 3, 3, 1],2],
	[[3, 3, 1, 3, 3, 0, 3, 3, 1],5],
	[[3, 3, 1, 3, 3, 1, 3, 3, 0],8],
	//Diagonal
	[[0, 3, 3, 3, 1, 3, 3, 3, 1],0],
	[[1, 3, 3, 3, 0, 3, 3, 3, 1],4],
	[[1, 3, 3, 3, 1, 3, 3, 3, 0],8],
	[[3, 3, 0, 3, 1, 3, 1, 3, 3],2],	
	[[3, 3, 1, 3, 0, 3, 1, 3, 3],4],	
	[[3, 3, 1, 3, 1, 3, 0, 3, 3],6],
];
var moveToBlockWin = [
	//Vertical
	[[0, 2, 2, 3, 3, 3, 3, 3, 3],0],
	[[2, 0, 2, 3, 3, 3, 3, 3, 3],1],
	[[2, 2, 0, 3, 3, 3, 3, 3, 3],2],
	[[3, 3, 3, 0, 2, 2, 3, 3, 3],3],
	[[3, 3, 3, 2, 0, 2, 3, 3, 3],4],
	[[3, 3, 3, 2, 2, 0, 3, 3, 3],5],
	[[3, 3, 3, 3, 3, 3, 0, 2, 2],6],
	[[3, 3, 3, 3, 3, 3, 2, 0, 2],7],
	[[3, 3, 3, 3, 3, 3, 2, 2, 0],8],
	//Horizontal
	[[0, 3, 3, 2, 3, 3, 2, 3, 3],0],
	[[2, 3, 3, 0, 3, 3, 2, 3, 3],3],
	[[2, 3, 3, 2, 3, 3, 0, 3, 3],6],
	[[3, 0, 3, 3, 2, 3, 3, 2, 3],1],
	[[3, 2, 3, 3, 0, 3, 3, 2, 3],4],
	[[3, 2, 3, 3, 2, 3, 3, 0, 3],7],
	[[3, 3, 0, 3, 3, 2, 3, 3, 2],2],
	[[3, 3, 2, 3, 3, 0, 3, 3, 2],5],
	[[3, 3, 2, 3, 3, 2, 3, 3, 0],8],
	//Diagonal
	[[0, 3, 3, 3, 2, 3, 3, 3, 2],0],
	[[2, 3, 3, 3, 0, 3, 3, 3, 2],4],
	[[2, 3, 3, 3, 2, 3, 3, 3, 0],8],
	[[3, 3, 0, 3, 2, 3, 2, 3, 3],2],
	[[3, 3, 2, 3, 0, 3, 2, 3, 3],4],
	[[3, 3, 2, 3, 2, 3, 0, 3, 3],6]
];

var moveToCorners = [
	//Pattern 1
	[[0, 0, 2, 2, 3, 3, 0, 3, 3], 0],
	[[0, 2, 0, 3, 3, 0, 3, 3, 2], 2],
	[[2, 3, 3, 0, 3, 3, 0, 2, 0], 6],
	[[3, 3, 0, 3, 3, 2, 2, 0, 0], 8],
	//Pattern 2
	[[0, 2, 0, 0, 3, 3, 2, 3, 3], 0],
	[[2, 0, 0, 3, 3, 2, 3, 3, 0], 2],
	[[0, 3, 3, 2, 3, 3, 0, 0, 2], 6],
	[[3, 3, 2, 3, 3, 0, 0, 2, 0], 8],
	//Pattern 3
	[[0, 2, 0, 2, 3, 3, 0, 3, 3], 0],
	[[0, 2, 0, 3, 3, 2, 3, 3, 0], 2],
	[[0, 3, 3, 2, 3, 3, 0, 2, 0], 6],
	[[3, 3, 0, 3, 3, 2, 0, 2, 0], 8]
];

var winningPatterns = [
	[[1, 1, 1, 3, 3, 3, 3, 3, 3], 1],
	[[3, 3, 3, 1, 1, 1, 3, 3, 3], 1],
	[[3, 3, 3, 3, 3, 3, 1, 1, 1], 1],
	[[1, 3, 3, 1, 3, 3, 1, 3, 3], 1],
	[[3, 1, 3, 3, 1, 3, 3, 1, 3], 1],
	[[3, 3, 1, 3, 3, 1, 3, 3, 1], 1],
	[[1, 3, 3, 3, 1, 3, 3, 3, 1], 1],
	[[3, 3, 1, 3, 1, 3, 1, 3, 3], 1],
	[[2, 2, 2, 3, 3, 3, 3, 3, 3], 2],
	[[3, 3, 3, 2, 2, 2, 3, 3, 3], 2],
	[[3, 3, 3, 3, 3, 3, 2, 2, 2], 2],
	[[2, 3, 3, 2, 3, 3, 2, 3, 3], 2],
	[[3, 2, 3, 3, 2, 3, 3, 2, 3], 2],
	[[3, 3, 2, 3, 3, 2, 3, 3, 2], 2],
	[[2, 3, 3, 3, 2, 3, 3, 3, 2], 2],
	[[3, 3, 2, 3, 2, 3, 2, 3, 3], 2]
];

var players = [];
var currentPlayer;
var playerTypes = {
	HUMAN: 'Human',
	COMPUTER_HARD: 'Computer - Hard'
};

function Player(symbol, playerType){
	this.symbol = symbol;
	switch(playerType){
		case playerTypes.COMPUTER_HARD:
			this.getMove = getCompMove;
			break;
		case playerTypes.HUMAN:
			this.getMove = getHumanMove;
			break;
		default:
			this.getMove = function(){ throw 'Null player can\'t move'; };
			break;
	}
}

Player.NullPlayer = new Player(' ');

function Board(){
	var boardState = new Array(9).fill(Player.NullPlayer);
	var winner = null;
	var isFull = false;
	
	var checkWinner = function(){
		var winningResult = getFromPattern(winningPatterns, boardState);
		winner = winningResult == PositionEnum.SELF ? currentPlayer : null;
	};
	
	var checkFull = function(){
		isFull = boardState.indexOf(Player.NullPlayer) == -1;
	};

	this.getState = function(){
		return { 
			winner: winner, 
			isFull: isFull,
			boardState: boardState.slice()
		};
	};

	this.move = function(position, player){
		boardState[position] = player;
		checkFull();
		checkWinner();
	};

	this.show = function(){
		console.log('\n');
		console.log(this.printBoard());
		console.log('\n');
	};

	this.printBoard = function(){
		return 	` ${boardState[0].symbol} | ${boardState[1].symbol} | ${boardState[2].symbol}\n===+===+===\n` +
				` ${boardState[3].symbol} | ${boardState[4].symbol} | ${boardState[5].symbol}\n===+===+===\n` +
				` ${boardState[6].symbol} | ${boardState[7].symbol} | ${boardState[8].symbol}`;
	};
}

var getHumanMove = function(board){
	/* eslint-disable-next-line no-constant-condition */
	while (true)
	{
		var ans = readlineSync.question(`Player ${this.symbol} Enter a number from 1 to 9:\n`);
		
		var input = Number.parseInt(ans);

		if(isNaN(input) || input < 1 || input > 9){
			console.log('That is not a position. You must enter a number from 1 to 9:\n');
			continue;
		}

		var position = input - 1;

		if(board[position] != Player.NullPlayer){
			console.log('That position is already taken. Try another one:\n');
			continue;
		}

		return position;
	}
};

var getCompMove = function(board){
	var position = getFromPattern(moveToWin, board, this);
	if (position == false){
		position = getFromPattern(moveToBlockWin, board, this);
	}
	if (position == false){
		position = getFromPattern(moveToCorners, board, this);
	}
	if (position == false && board[4] == Player.NullPlayer){
		position = 4;
	}
	if (position == false){
		position = board.indexOf(Player.NullPlayer);
	}

	console.log(`Player ${this.symbol} selected position ${position}`);

	return position;
};

var getFromPattern = function(patternList, board){
	var mappedBoard = board.map(x =>
		x == Player.NullPlayer ? PositionEnum.NONE : (x == currentPlayer ? PositionEnum.SELF : PositionEnum.ANY)
	);

	var result = patternList.find( p =>
		p[0].every( (x, i) => x == mappedBoard[i] || x == PositionEnum.ANY)
	);

	if (result instanceof Array) { return result[1]; }
	return false;
};

var exit = function(){ process.exit(); };

var play = function(){
	var types = [playerTypes.HUMAN, playerTypes.COMPUTER_HARD];
	var p1Symbol, p2Symbol;
	var p1 = readlineSync.keyInSelect(types, 'Select player 1', { cancel:false });
	p1Symbol = readlineSync.keyIn('Select player 1 symbol:');
	var p2 = readlineSync.keyInSelect(types, 'Select player 2', { cancel:false });

	var sameSymbol = true;

	while(sameSymbol){
		p2Symbol = readlineSync.keyIn('Select player 2 symbol:');
		sameSymbol = p1Symbol == p2Symbol;
		if(sameSymbol){
			console.log('Player 2 must use a different symbol:');
		}
	}

	players.push(new Player(p1Symbol, types[p1]), new Player(p2Symbol, types[p2]));

	currentPlayer = players[0];

	var board = new Board();
	board.show();

	/* eslint-disable-next-line no-constant-condition */
	while(true){
		var playerPos = currentPlayer.getMove(board.getState().boardState, currentPlayer);
		board.move(playerPos, currentPlayer);
		board.show();

		var gameState = board.getState();
		
		if (gameState.winner != null){
			console.log(`The winner is player ${gameState.winner.symbol}!`);
			exit();
		}
		
		if(gameState.isFull){
			console.log('Tied game!');
			exit();
		}
		
		currentPlayer = players[0] == currentPlayer ? players[1] : players[0];
	}
};

play();
