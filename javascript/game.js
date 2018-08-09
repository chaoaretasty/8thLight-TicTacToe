//While node is an asynchronous environment synchronous user input is an acceptable exception
//At the very least while refactoring it makes sense to have this syncronous
const readlineSync = require('readline-sync');

/* eslint-disable no-regex-spaces */
var moveToWin = [
	[(/ OO....../),0],
	[(/O O....../),1],
	[(/OO ....../),2],
	[(/... OO.../),3],
	[(/...O O.../),4],
	[(/...OO .../),5],
	[(/...... OO/),6],
	[(/......O O/),7],
	[(/......OO /),8],
	[(/ ..O..O../),0],
	[(/O.. ..O../),3],
	[(/O..O.. ../),6],
	[(/. ..O..O./),1],
	[(/.O.. ..O./),4],
	[(/.O..O.. ./),7],
	[(/.. ..O..O/),2],
	[(/..O.. ..O/),5],
	[(/..O..O.. /),8],
	[(/ ...O...O/),0],
	[(/O... ...O/),4],
	[(/O...O... /),8],
	[(/.. .O.O../),2],	
	[(/..O. .O../),4],	
	[(/..O.O. ../),6],
];
var moveToBlockWin = [
	[(/ XX....../),0],
	[(/X X....../),1],
	[(/XX ....../),2],
	[(/... XX.../),3],
	[(/...X X.../),4],
	[(/...XX .../),5],
	[(/...... XX/),6],
	[(/......X X/),7],
	[(/......XX /),8],
	[(/ ..X..X../),0],
	[(/X.. ..X../),3],
	[(/X..X.. ../),6],
	[(/. ..X..X./),1],
	[(/.X.. ..X./),4],
	[(/.X..X.. ./),7],
	[(/.. ..X..X/),2],
	[(/..X.. ..X/),5],
	[(/..X..X.. /),8],
	[(/ ...X...X/),0],
	[(/X... ...X/),4],
	[(/X...X... /),8],
	[(/.. .X.X../),2],
	[(/..X. .X../),4],
	[(/..X.X. ../),6]
];

var moveToCorners = [
	//Pattern 1
	[(/  XX.. ../), 0],
	[(/ X .. ..X/), 2],
	[(/X.. .. X /), 6],
	[(/.. ..XX  /), 8],
	//Pattern 2
	[(/ X  ..X../), 0],
	[(/X  ..X.. /), 2],
	[(/ ..X..  X/), 6],
	[(/..X..  X /), 8],
	//Pattern 3
	[(/ X X.. ../), 0],
	[(/ X ..X.. /), 2],
	[(/ ..X.. X /), 6],
	[(/.. ..X X /), 8]
];

var winningPatterns = [
	[(/OOO....../),'O'],
	[(/...OOO.../),'O'],
	[(/......OOO/),'O'],
	[(/O..O..O../),'O'],
	[(/.O..O..O./),'O'],
	[(/..O..O..O/),'O'],
	[(/O...O...O/),'O'],
	[(/..O.O.O../),'O'],
	[(/XXX....../),'X'],
	[(/...XXX.../),'X'],
	[(/......XXX/),'X'],
	[(/X..X..X../),'X'],
	[(/.X..X..X./),'X'],
	[(/..X..X..X/),'X'],
	[(/X...X...X/),'X'],
	[(/..X.X.X../),'X']
];
/* eslint-enable no-regex-spaces */

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
		default:
			this.getMove = getHumanMove;
			break;
	}
}

function Board(){
	var boardState = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
	var winner = null;
	var isFull = false;
	
	var checkWinner = function(){
		var winningSymbol = getFromPattern(winningPatterns, boardState);
		if (winningSymbol != -1){
			winner = winningSymbol;
		}
	};
	
	var checkFull = function(){
		isFull = boardState.indexOf(' ') == -1;
	};

	this.getState = function(){
		return { 
			winner: winner, 
			isFull: isFull,
			boardState: boardState.slice()
		};
	};

	this.move = function(position, player){
		boardState[position] = player.symbol;
		checkFull();
		checkWinner();
	};

	this.show = function(){
		console.log('\n');
		console.log(this.printBoard());
		console.log('\n');
	};

	this.printBoard = function(){
		return 	` ${boardState[0]} | ${boardState[1]} | ${boardState[2]}\n===+===+===\n` +
				` ${boardState[3]} | ${boardState[4]} | ${boardState[5]}\n===+===+===\n` +
				` ${boardState[6]} | ${boardState[7]} | ${boardState[8]}`;
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

		if(board[position] != ' '){
			console.log('That position is already taken. Try another one:\n');
			continue;
		}

		return position;
	}
};

var getCompMove = function(board){
	var position = getFromPattern(moveToWin, board);
	if (position == -1){
		position = getFromPattern(moveToBlockWin, board);
	}
	if (position == -1){
		position = getFromPattern(moveToCorners, board);
	}
	if (position == -1 && board[4] == ' '){
		position = 4;
	}
	if (position == -1){
		position = board.indexOf(' ');
	}

	console.log(`Player ${this.symbol} selected position ${position}`);

	return position;
};

var getFromPattern = function(patternList, board){
	var board_string = board.join('');
	for(var i = 0; i < patternList.length; i++){
		var array = board_string.match(patternList[i][0]);
		if (array){
			return patternList[i][1];
		}
	}
	return -1;
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
		var playerPos = currentPlayer.getMove(board.getState().boardState);
		board.move(playerPos, currentPlayer);
		board.show();

		var gameState = board.getState();
		
		if (gameState.winner != null){
			console.log(`The winner is player ${gameState.winner}!`);
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
