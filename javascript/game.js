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
var player1 = 'X';
var player2 = 'O';
var players = [player1, player2];
var currentPlayer = player1;

var comp = function(){
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

	move(position, player2);
};

var move = function(position,forPlayer){
	if (forPlayer != currentPlayer){
		return false;
	}
	
	board.splice(position, 1, forPlayer);
	currentPlayer = (forPlayer == player1)? player2: player1;
	return true;
};

var board_display = function(){
	return 	' ' + board[0] + ' |' + ' ' + board[1] + ' |' + ' ' + board[2] + '\n===+===+===\n' +
			' ' + board[3] + ' |' + ' ' + board[4] + ' |' + ' ' + board[5] + '\n===+===+===\n' +
			' ' + board[6] + ' |'+' ' + board[7] + ' |' + ' ' + board[8];
};

var show = function(){
	console.log(board_display());
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
	show();
	console.log('Enter a number from 1 to 9:');
	process.openStdin().on('data', function(res){ 
		var input = Number.parseInt(res);
		
		if(isNaN(input) || input < 1 || input > 9){
			console.log('That is not a position. You must enter a number from 1 to 9:');
			return;
		}

		var position = input - 1;

		if(board[position] != ' '){
			console.log('That position is already taken. Try another one:')
		}

		if (move(position, player1)){
			var hasWinner = winner();
			var filled = board_filled();
			if (hasWinner || filled) { exit(); }
			else {
				comp();
				if (hasWinner || filled) { exit(); }
				else { show(); }
			}
		}

		console.log('Enter a number from 1 to 9:');
	});
};

play();
