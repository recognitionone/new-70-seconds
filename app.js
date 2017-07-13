
//todo: 1. level menu dające wejście do każdego levelu
//todo: 2. oznaczanie, który level jest zrobiony
//todo: 3. score - punkty za lepsze lub gorsze przejście levelu
//todo: 4. zapamiętywanie stanu gry na urządzeniu

//todo find the panda challenge


var levels = [  {rows: 3, columns: 4, text: "one",    misses: false, timer: false, mode: 'colors' },
				{rows: 3, columns: 3, text: "two",    misses: false, timer: false, mode: 'letters' },
				{rows: 4, columns: 3, text: "three",  misses: false, timer: false, mode: 'numbers' },
				{rows: 4, columns: 4, text: "four",   misses: false,  timer: false, mode: 'colors' },
				{rows: 4, columns: 4, text: "five",   misses: false, timer: false, mode: 'letters' },
				{rows: 5, columns: 4, text: "six",    misses: false,  timer: false, mode: 'numbers' },
				{rows: 5, columns: 4, text: "seven",  misses: false, timer: false, mode: 'colors' },
				{rows: 5, columns: 4, text: "eight",  misses: false,  timer: false, mode: 'letters' },

				];

var gameState = {   level: 0,
					nextButtonToClick: 1,
					misses: 0,
					levelStarted: false,
					time: 0, 
					timeId: null
				}

function gameScene() {

     document.getElementById("levelsButton").onclick = function() {
             document.getElementById("levels").classList.remove("hidden");
             document.getElementById("game").classList.add("hidden");
             document.getElementById("options").classList.add("hidden");

             document.getElementById("levelsButton").style.background = "blanchedalmond";
             document.getElementById("optionsButton").style.background = "white";
             document.getElementById("gameButton").style.background = "white";
     };

     document.getElementById("optionsButton").onclick = function() {
             document.getElementById("options").classList.remove("hidden");
             document.getElementById("game").classList.add("hidden");
             document.getElementById("levels").classList.add("hidden");

             document.getElementById("levelsButton").style.background = "white";
             document.getElementById("optionsButton").style.background = "blanchedalmond";
             document.getElementById("gameButton").style.background = "white";
     };

    document.getElementById("gameButton").onclick = function() {
              document.getElementById("game").classList.remove("hidden");
              document.getElementById("options").classList.add("hidden");
              document.getElementById("levels").classList.add("hidden");

              document.getElementById("levelsButton").style.background = "white";
              document.getElementById("optionsButton").style.background = "white";
              document.getElementById("gameButton").style.background = "blanchedalmond";
    };
	
} 
				 
var gameBoard = null; 
var levelBoard = null;
var header = null;

function initialise() {
	gameBoard = document.getElementById("game");
	header = document.getElementById("header");
	levelBoard = document.getElementById("levels");
	gameScene();
	gameStarter(0);
	createLevelBoard();
}

function createLevelBoard() {
	var rows = 3;
	var columns = 3;
	
	var numberOfButtonHere = 0;
	var newTable = document.createElement("table")
	for (var i=0; i<rows; i++) {
		var tr = document.createElement("tr");
		newTable.appendChild(tr);
		for (var j=0; j<columns; j++) {
			var td = document.createElement("td");
			addlevelButton(td, numberOfButtonHere);

			numberOfButtonHere++;
			tr.appendChild(td);
		}
	}
	levelBoard.appendChild(newTable);
}


function addlevelButton(parent, i) {
	var z = i + 1;
	var newLevelButton;
	newLevelButton = document.createElement("button");
	newLevelButton.appendChild(document.createTextNode("level " + z));
	parent.appendChild(newLevelButton);
	newLevelButton.onclick = function () {
		
		document.getElementById("levels").classList.add("hidden");
        document.getElementById("game").classList.remove("hidden");
		gameStarter(i);
		document.getElementById("levelsButton").style.background = "white";
	    document.getElementById("optionsButton").style.background = "white";
	    document.getElementById("gameButton").style.background = "blanchedalmond";
	};
}















function gameStarter(levelIdx) {
	clearElement(gameBoard);
	clearElement(header);

	gameState.nextButtonToClick = 0;
	gameState.misses = 0;
	gameState.time = 0;
	clearInterval(gameState.timeId);

	gameState.level = levelIdx;
	gameState.levelStarted = false;

	var newLevelButton = document.createElement("button");	
	newLevelButton.appendChild(document.createTextNode("start level " + levels[levelIdx].text));
	gameBoard.appendChild(newLevelButton);
	newLevelButton.onclick = function () { gamePlay(levelIdx); };
}

function levelFailed() {
	clearElement(gameBoard);
	clearElement(header);

	gameState.nextButtonToClick = 0;
	gameState.misses = 0;
	gameState.time = 0;
	clearInterval(gameState.timeId);
	gameState.levelStarted = false;

	var failedLevelDiv = document.createElement("div")
		failedLevelDiv.appendChild(document.createTextNode("game over, try again"));


	var repeatLevelButton = document.createElement("button");	
		repeatLevelButton.appendChild(document.createTextNode("retry"));
		repeatLevelButton.onclick = function () { gamePlay(gameState.level); };
			failedLevelDiv.appendChild(repeatLevelButton);

	var skipLevelButton = document.createElement("button");	
		skipLevelButton.appendChild(document.createTextNode("skip this level"));
		skipLevelButton.onclick = function () { 
			gameState.level++;
			gamePlay(gameState.level); 
		};
			failedLevelDiv.appendChild(skipLevelButton);

	gameBoard.appendChild(failedLevelDiv);
}



function gamePlay(levelIdx) {
	gameState.levelStarted = true;
	createBoard(levelIdx, levels[levelIdx]);
	createMisses();
	updateMisses();
	fitBoard();
	setTimer(); 	
}



function buttonOnclick(cell, buttonIdx) {
	if (buttonIdx == gameState.nextButtonToClick) {
		gameState.nextButtonToClick++;
		cell.style.opacity = 0.1;

		if (gameState.nextButtonToClick >= levels[gameState.level].rows*levels[gameState.level].columns) {
			// if (levels[gameState.level].timer) {clearInterval(gameState.id);}

			if (gameState.level +1 >= levels.length) {
				console.log("GAME OVER")
			}
			else {
				gameStarter(gameState.level +1);
			}			
		}
	}
	else {
		gameState.misses++;
		if (levels[gameState.level].misses && gameState.levelStarted && gameState.misses >= 4) {
			levelFailed();
		}
		updateMisses();
	}
}

function createBoard(idx, def) {
	clearElement(gameBoard);

	var rows = levels[gameState.level].rows;
	var columns = levels[gameState.level].columns;
	
	var numberOfButtonHere = 0;
	var arrayOfNumbers = createAnArray();

	var newTable = document.createElement("table");
	newTable.id = "board";
	for (var i=0; i<rows; i++) {
		var tr = document.createElement("tr");
		newTable.appendChild(tr);
		for (var j=0; j<columns; j++) {
			var td = document.createElement("td");

			addButton(td, arrayOfNumbers[numberOfButtonHere] );
			numberOfButtonHere++;
			tr.appendChild(td);
		}
	}
	gameBoard.appendChild(newTable);
}

//create button that will be used in the table.
//buttons have text or colors
function addButton(parent, i) {

	var newButton;
	newButton = document.createElement("button");
	switch (levels[gameState.level].mode) {
		case 'colors':
			newButton.style.backgroundColor = arrayOfColors[i];
			break;
		case 'letters':
			newButton.appendChild(document.createTextNode(arrayOfLetters[i]));
			break;
		default:
			newButton.appendChild(document.createTextNode(i + 1));
			break;
	}

	parent.appendChild(newButton);
	newButton.onclick = function () {buttonOnclick(this, i);};
}

//create brand new div that shows number of misses in given level
function createMisses() {
	if (levels[gameState.level].misses && gameState.levelStarted ) {
		var missesButton = document.createElement("div");
		missesButton.id = "misses";
		missesButton.appendChild(document.createTextNode(gameState.misses));
		document.getElementById("header").appendChild(missesButton);
	} 
}

function updateMisses() {
	if (levels[gameState.level].misses && gameState.levelStarted ){
			document.getElementById("misses").innerHTML = gameState.misses;
	}
}

//set timer that takes the same number of seconds as the lenght of the table. 
//timer can punish you if you don't finish on time
function setTimer() {
	if (levels[gameState.level].timer && gameState.levelStarted) {
		gameState.time = levels[gameState.level].rows*levels[gameState.level].columns;

		var timeButton = document.createElement("div");
		timeButton.id = "timer";
		timeButton.appendChild(document.createTextNode(gameState.time));
		document.getElementById("header").appendChild(timeButton);

		gameState.timeId = setInterval(frame, 1000);
		function frame() {
			gameState.time--;
			timeButton.innerHTML = gameState.time;
			if (gameState.time == 0) {
				levelFailed();
				clearInterval(gameState.id);
			}
		}
	}
}

//create and array of numbers with the same lenght as table but randomise
function createAnArray() {
	var numbers = [];
	var n=0;
	for (var i=1; i<levels[gameState.level].rows+1; i++){
		for (var j=1; j<levels[gameState.level].columns+1; j++){
			numbers.push(n);
			n++;
		}
	}
	for (var i=1; i<5; i++){
			numbers.sort(function(a, b){return 0.5 - Math.random()});
	}
	return numbers;
}

// clear everything in giver area
function clearElement(el) {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
}

var boardScale = 100;
var boardScaleInterval;

function fitBoard() {
	boardScale = 100;	
	boardScaleInterval = setInterval(updateBoardSize, 50);
}

function updateBoardSize() {
	var board = document.getElementById('board');
	if (!board) {
		return;
	}

	var parent = document.getElementById('outer-game-td');

	var maxWidth = parent.offsetWidth * 0.9;
	var maxHeight = parent.offsetHeight * 0.9;

	var ratioW = maxWidth / board.offsetWidth;
	var ratioH = maxHeight / board.offsetHeight;

//	boardScale = 100 * ratioW;

	if ((board.offsetHeight > maxHeight) || (board.offsetWidth > maxWidth)) {
		clearInterval(boardScaleInterval);
		boardScaleInterval = undefined;
	} else {
		boardScale += 150 * (Math.min(ratioW, ratioH) - 1);
	}

	board.style.fontSize = boardScale + '%';
	console.log(board.style.fontSize);
}


window.onload = initialise; 

var arrayOfLetters =[  'a',  'b',  'c',  'd',  'e',  'f',  'g',  'h',  'i',  'j',  'k',  'l',  'm',  'n',  'o',  'p',  'q',  'r',  's',  't',  'u',  'v',  'w',  'x',  'y',  'z' ]

// var color = "hsl(0, 100%, 50%)";

// #03ff05
// #15ee13
// #28dc21
// #3acb2f
// #4db93e
// #5fa84c
// #72965a
// #848568
// #977376
// #a96284
// #bc5093
// #ce3fa1
// #e12daf

// #f31cbd




// 1:
// #03ff05
// #0af017
// #11e12a
// #18d23c
// #1fc34e
// #26b461
// #2da573
// #339785
// #3a8897
// #4179aa
// #486abc
// #4f5bce
// #564ce1

// #5d3df3


// 2:
// #ffe015
// #fed315
// #fdc715
// #fcba15
// #fbae15
// #faa115
// #f99515
// #f98814
// #f87c14
// #f76f14
// #f66314
// #f55614
// #f44a14

// #f33d14

// 3:
// #ff47a8
// #ef51ad
// #df5ab3
// #d064b8
// #c06ebd
// #b077c3
// #a081c8
// #918bcd
// #8195d2
// #719ed8
// #61a8dd
// #52b2e2
// #42bbe8

// #32c5ed



// 4. 9 cells:
// #354dfc
// #3561f6
// #3674f1
// #3688eb
// #379ce5
// #37afdf
// #37c3da
// #38d6d4

// #38eace


// 5. 9 cells:
// #000000
// #1d0011
// #3a0022
// #570033
// #740044
// #910055
// #ae0066
// #cb0077

// #e80088


// 6. 9 cells:
// #291500
// #412400
// #593200
// #714100
// #894f00
// #a05e00
// #b86c00
// #d07b00

// #e88900


// 7. 16 cells
// #050d00
// #051b02
// #042903
// #043705
// #044506
// #035308
// #036109
// #036f0b
// #027e0c
// #028c0e
// #029a0f
// #01a811
// #01b612
// #01c414
// #00d215

// #00e017

// 8. 12 cells
// #06177c
// #082980
// #0a3b84
// #0c4e88
// #0e608c
// #107290
// #128493
// #149697
// #16a89b
// #18bb9f
// #1acda3

// #1cdfa7

// 9. 12 cells
var arrayOfColors =['#030437', '#17053c', '#2a0540', '#3e0645','#52074a', '#66084e', '#790853', '#8d0957','#a10a5c', '#b50b61', '#c80b65', '#dc0c6a']

// 

//green to red
// var arrayOfColors = ["#0bfb00", "#24dc07", "#3dbc0e", "#559d14", "#6e7e1b", "#875e22", "#a03f29", "#b81f2f", "#d10036"]

// blue to orange 12 cells:
// var arrayOfColors = ["#5e4fa2","#6c559b","#7a5c95","#88628e","#966887","#a46e81","#b1757a","#bf7b74","#cd816d","#db8766","#e98e60","#f79459"]


















