//While node is an asynchronous environment synchronous user input is an acceptable exception
const readlineSync = require('readline-sync');

var TicTacToe = {};
(function(){
	var PositionEnum = {
		NONE: 0,
		SELF: 1,
		OPPONENT: 2,
		ANY: 3
	};
	
	//Questionable if enum value of enum label would be more appropriate here.
	//The label is clearer but when written out patterns are much harder to see so its helpfulness is questionable
	//Groups are ordered and labelled by type to help check
	
	const Patterns = {
		moveToWin: [
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
		],
		moveToBlockWin: [
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
		],		
		moveToCorners: [
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
		],
		winningPatterns: [
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
		]
	};
	
	var playerTypes = {
		HUMAN: 'Human',
		COMPUTER_HARD: 'Computer - Hard'
	};
	
	function Player(symbol, playerType){
		this.symbol = symbol;
		
		switch(playerType){
			case playerTypes.COMPUTER_HARD:
				this.getMove = Player.getCompMove;
				break;
			case playerTypes.HUMAN:
				this.getMove = Player.getHumanMove;
				break;
			default:
				this.getMove = function(){ throw 'Null player can\'t move'; };
				break;
		}
	}
	
	Player.NullPlayer = new Player(' ');
	Player.getHumanMove = function(board){
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
	
	Player.getCompMove = function(board){
		var position = getFromPattern(Patterns.moveToWin, board, this);
		if (position == false){
			position = getFromPattern(Patterns.moveToBlockWin, board, this);
		}
		if (position == false){
			position = getFromPattern(Patterns.moveToCorners, board, this);
		}
		if (position == false && board[4] == Player.NullPlayer){
			position = 4;
		}
		if (position == false){
			position = board.indexOf(Player.NullPlayer);
		}
	
		console.log(`Player ${this.symbol} selected position ${position + 1}`);
	
		return position;
	};
	
	
	function Board(){
		var boardState = new Array(9).fill(Player.NullPlayer);
		var winner = null;
		var isFull = false;
		
		var checkWinner = function(currentPlayer){
			var winningResult = getFromPattern(Patterns.winningPatterns, boardState, currentPlayer);
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
	
		this.move = function(position, currentPlayer){
			boardState[position] = currentPlayer;
			checkFull();
			checkWinner(currentPlayer);
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
	
	var getFromPattern = function(patternList, board, currentPlayer){
		var mappedBoard = board.map(x =>
			x == Player.NullPlayer ? PositionEnum.NONE : (x == currentPlayer ? PositionEnum.SELF : PositionEnum.OPPONENT)
		);
	
		var result = patternList.find( p =>
			p[0].every( (x, i) => x == mappedBoard[i] || x == PositionEnum.ANY)
		);
	
		if (result instanceof Array) { return result[1]; }
		return false;
	};
		
	var play = function(){
		var anotherGame = true;
		while (anotherGame){
			playGame();
			anotherGame = readlineSync.keyInYN('Would you like to play again?');
		}
	};

	var getPlayers = function(){
		var players = [];
		var types = [playerTypes.HUMAN, playerTypes.COMPUTER_HARD];
		var p1Type, p2Type, p1Symbol, p2Symbol;
		var validSymbol = false;

		p1Type = readlineSync.keyInSelect(types, 'Select player 1', { cancel:false });
		while(!validSymbol){
			p1Symbol = readlineSync.keyIn('Select player 1 symbol:');
			if (p1Symbol == ' '){
				console.log('Space is not allowed as a symbol');
			} else {
				validSymbol = true;
			}
		}

		p2Type = readlineSync.keyInSelect(types, 'Select player 2', { cancel:false });
	
		validSymbol = false;
	
		while(!validSymbol){
			p2Symbol = readlineSync.keyIn('Select player 2 symbol:');
			if (p2Symbol == ' '){
				console.log('Space is not allowed as a symbol');
			} else if (p1Symbol == p2Symbol){
				console.log('Player 2 must use a different symbol:');
			} else {
				validSymbol = true;
			}
		}
	
		players.push(new Player(p1Symbol, types[p1Type]), new Player(p2Symbol, types[p2Type]));

		return players;
	};

	var playGame = function(){
		var players = getPlayers();
		var currentPlayer = players[0];
	
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
				return;
			}
			
			if(gameState.isFull){
				console.log('Tied game!');
				return;
			}
			
			currentPlayer = players[0] == currentPlayer ? players[1] : players[0];
		}
	};

	TicTacToe.play = play;
})();

TicTacToe.play();