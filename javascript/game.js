//While node is an asynchronous environment synchronous user input is an acceptable exception
//At the very least while refactoring it makes sense to have this syncronous
const readlineSync = require('readline-sync');


var moveToWin = [
	[(/ OO....../),0],
	[(/O..O.. ../),6],
	[(/......OO /),8],
	[(/.. ..O..O/),2],
	[(/ ..O..O../),0],
	[(/...... OO/),6],
	[(/..O..O.. /),8],
	[(/OO ....../),2],
	[(/ ...O...O/),0],
	[(/..O.O. ../),6],
	[(/O...O... /),8],
	[(/.. .O.O../),2],
	[(/O O....../),1],
	[(/O.. ..O../),3],
	[(/......O O/),7],
	[(/..O.. ..O/),5],
	[(/. ..O..O./),1],
	[(/... OO.../),3],
	[(/.O..O.. ./),7],
	[(/...OO .../),5]
];
var moveToBlockOpponent = [
	[(/  X . X  /),1],
	[(/ XX....../),0],
	[(/X..X.. ../),6],
	[(/......XX /),8],
	[(/.. ..X..X/),2],
	[(/ ..X..X../),0],
	[(/...... XX/),6],
	[(/..X..X.. /),8],
	[(/XX ....../),2],
	[(/ ...X...X/),0],
	[(/..X.X. ../),6],
	[(/X...X... /),8],
	[(/.. .X.X../),2],
	[(/X X....../),1],
	[(/X.. ..X../),3],
	[(/......X X/),7],
	[(/..X.. ..X/),5],
	[(/. ..X..X./),1],
	[(/... XX.../),3],
	[(/.X..X.. ./),7],
	[(/...XX .../),5],
	[(/ X X.. ../),0],
	[(/ ..X.. X /),6],
	[(/.. ..X X /),8],
	[(/ X ..X.. /),2],
	[(/  XX.. ../),0],
	[(/X.. .. X /),6],
	[(/.. .XX   /),8],
	[(/X  ..X.. /),2],
	[(/ X  ..X../),0],
	[(/ ..X..  X/),6],
	[(/..X..  X /),8],
	[(/X  ..X.. /),2]
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

var board = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
var players = [];
var currentPlayer;
var playerTypes = {
	HUMAN: 'Human',
	COMPUTER: 'Computer'
};

function Player(symbol, playerType){
	this.symbol = symbol;
	switch(playerType){
		case playerTypes.COMPUTER:
			this.getMove = getCompMove;
			break;
		case playerTypes.HUMAN:
		default:
			this.getMove = getHumanMove;
			break;
	}
}

var getHumanMove = function(){
	while (true)
	{
		var ans = readlineSync.question(`Player ${this.symbol} Enter a number from 1 to 9:\n`);
		
		if(ans=="quit"){exit();}

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

var getCompMove = function(){
	var position = get_from_pattern(moveToWin);
	if (position == -1){
		position = get_from_pattern(moveToBlockOpponent);
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

var move = function(position,forPlayer){
	board.splice(position, 1, forPlayer.symbol);
};

var board_display = function(){
	return 	' ' + board[0] + ' |' + ' ' + board[1] + ' |' + ' ' + board[2] + '\n===+===+===\n' +
			' ' + board[3] + ' |' + ' ' + board[4] + ' |' + ' ' + board[5] + '\n===+===+===\n' +
			' ' + board[6] + ' |'+' ' + board[7] + ' |' + ' ' + board[8];
};

var show = function(){
	console.log('\n');
	console.log(board_display());
	console.log('\n');
};

var board_filled = function(){
	if (board.indexOf(' ') == -1){
		show();
		console.log('Game over');
		return true;
	}
	return false;
};

var winner = function(){
	var winner = get_from_pattern(winningPatterns);
	
	if (winner != -1){
		show();
		console.log('Game over');
		return true;
	}

	return false;
};

var get_from_pattern = function(pattern){
	var board_string = board.join('');
	for(var i = 0; i < pattern.length; i++){
		var array = board_string.match(pattern[i][0]);
		if (array){
			return pattern[i][1];
		}
	}
	return -1;
};

var exit = function(){ process.exit(); };

var play = function(){
	var types = [playerTypes.HUMAN, playerTypes.COMPUTER];
	var p1 = readlineSync.keyInSelect(types, "Select player 1", { cancel:false });
	var p2 = readlineSync.keyInSelect(types, "Select player 2", { cancel:false });

	players.push(new Player('X', types[p1]), new Player('O', types[p2]));

	currentPlayer = players[0];

	while(true){
		show();
		var playerPos = currentPlayer.getMove();
		move(playerPos, currentPlayer);
		var hasWinner = winner();
		var filled = board_filled();
		if (hasWinner || filled) { exit(); }
		
		currentPlayer = players[0] == currentPlayer ? players[1] : players[0];
	}
};

play();
