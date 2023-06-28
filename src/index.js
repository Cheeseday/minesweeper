const easy = {
    minesCount: 10,
    tileSize: 45,
    fieldSize: [10,10],
}

const medium = {
    tileSize: 40,
    fieldSize: [15,15],
}

const hard = {
    tileSize: 30,
    fieldSize: [25,25],
}

let rows = hard.fieldSize[0]; //default value
let columns = hard.fieldSize[1]; //default value

let board = [];
let minesLocation = [];
let tilesClicked = 0; //goal to click all tiles except the ones containing mines

let flagEnabled = false;
let gameOver = false;

const flagIcon = '🚩';

const mineIcon = `<svg version="1.0" xmlns="http://www.w3.org/2000/svg"
width="70%" height="70%" viewBox="0 0 48.000000 48.000000"
preserveAspectRatio="xMidYMid meet">

<g transform="translate(0.000000,48.000000) scale(0.100000,-0.100000)"
fill="#000000" stroke="#FFFFFF" stroke-width="0">
<path d="M226 442 c-9 -26 -97 -62 -119 -48 -21 13 -34 0 -21 -21 15 -23 -25
-123 -48 -123 -23 0 -23 -17 0 -24 26 -9 62 -97 48 -119 -13 -21 0 -34 21 -21
22 14 110 -22 119 -48 7 -23 21 -23 28 0 9 26 97 62 119 48 21 -13 34 0 21 21
-14 22 22 110 48 119 23 7 23 24 1 24 -24 0 -64 100 -49 123 13 21 0 34 -21
21 -22 -14 -110 22 -119 48 -3 10 -9 18 -14 18 -5 0 -11 -8 -14 -18z m-11
-152 c0 -18 -6 -26 -23 -28 -24 -4 -38 18 -28 44 3 9 15 14 28 12 17 -2 23
-10 23 -28z"/>
</g>
</svg>`;


const body = document.body;

const header = document.createElement('header');
header.classList.add('header');
//Timer
const timer = document.createElement('div');
timer.classList.add('header-wrapper');
timer.textContent = 'Time: ';
//Mine counter
const mineCounterWrapper = document.createElement('div');
mineCounterWrapper.classList.add('header-wrapper');
const counterLabel = document.createElement('span');
counterLabel.textContent = 'Mines: ';
const mineCounter = document.createElement('span');
mineCounter.classList.add('mine-counter');
mineCounter.textContent = 10; /////////////////////////////////////////////////////
mineCounterWrapper.insertAdjacentElement('beforeend', counterLabel);
mineCounterWrapper.insertAdjacentElement('beforeend', mineCounter);
//Button for start new game
const buttonNewGame = document.createElement('button');
buttonNewGame.classList.add(...['button', 'button-header']);
buttonNewGame.textContent = 'New game';

header.insertAdjacentElement('beforeend', mineCounterWrapper);
header.insertAdjacentElement('beforeend', buttonNewGame);
header.insertAdjacentElement('beforeend', timer);

// Game field
const gameField = document.createElement('div');
gameField.className = 'game-field';
// gameField.style.width = `${easy.tileSize * easy.fieldSize[0]+ 6}px`;

//Button choose flag 
const flagButtonWrapper = document.createElement('div');
flagButtonWrapper.className = 'flag-wrapper';
const flagButton = document.createElement('button');
flagButton.classList.add(...['button', 'button-footer']);
flagButton.textContent = flagIcon;
flagButtonWrapper.insertAdjacentElement('afterbegin', flagButton);

body.insertAdjacentElement('afterbegin', header);
body.insertAdjacentElement('beforeend', flagButtonWrapper);


window.onload = function() {
    displayField(hard);
    // console.log(rows, columns);
    insertTiles(hard);
}

function displayField(object) {
    gameField.style.width = `${object.tileSize * object.fieldSize[0] + 6}px`;
    header.insertAdjacentElement('afterend', gameField);
    rows = object.fieldSize[0];
    columns = object.fieldSize[1];
}

function insertTiles(object) {
    flagButton.addEventListener('click', setFlag);
    setMines();

    for(let i = 0; i < object.fieldSize[0]; i++) {
        let row = [];
        for(let j = 0; j < object.fieldSize[1]; j++){
            const tile = document.createElement('div');
            tile.classList.add(...['tile']); 
            tile.id = `${i.toString()}-${j.toString()}`; 
            tile.style.width = `${object.tileSize}px`;
            tile.style.height = `${object.tileSize}px`;
            tile.addEventListener('click', clickTile);
            gameField.insertAdjacentElement('beforeend', tile);
            row.push(tile);
        }
        board.push(row);
    }
}
console.log(board);

function setMines() {
    let minesLeft = mineCounter.textContent;
    while(minesLeft > 0) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        let id = `${r.toString()}-${c.toString()}`;

        if(!minesLocation.includes(id)) {
            minesLocation.push(id);
            minesLeft -= 1;
        }
    }
}

function setFlag() {
    if(flagEnabled) {
        flagEnabled = false;
        flagButton.classList.remove('activeButton');
    } else {
        flagEnabled = true;
        flagButton.classList.add('activeButton');
    }
}

function clickTile() {
    if(gameOver || this.classList.contains('tile-clicked')) {
        return;
    }

    let tile = this;
    if(flagEnabled) {
        if(tile.innerText == '') {
            tile.innerText = flagIcon;
        }
        else if(tile.innerText == flagIcon) {
            tile.innerText = '';
        }
        return;
    }

    if(minesLocation.includes(tile.id)) {
        console.log('Game over!');
        gameOver = true;
        revealMines(rows, columns);
        return;
    }

    let coords = tile.id.split('-');
    let coordX = parseInt(coords[0]);
    let coordY = parseInt(coords[1]);
    checkMine(coordX, coordY);
}

function revealMines(rows, columns) {
    for(let i = 0; i < rows; i++) {
        for(let j = 0; j < columns; j++){
            let tile = board[i][j];
            if(minesLocation.includes(tile.id)) {
                // tile.innerText = '💣';
                tile.innerHTML = mineIcon;
                // tile.style.backgroundColor = 'red';
            }
        }
    }
}

function checkMine(coordX, coordY) {
    if(coordX < 0 || coordX >= rows || coordY < 0 || coordY >= columns) {
        return;
    }
    if(board[coordX][coordY].classList.contains('tile-clicked')) {
        return;
    }

    board[coordX][coordY].classList.add('tile-clicked');
    tilesClicked += 1;

    let minesFound = 0;

    //top 3 tiles
    minesFound += checkTile(coordX - 1, coordY - 1);
    minesFound += checkTile(coordX - 1, coordY);
    minesFound += checkTile(coordX - 1, coordY + 1);

    //left and right tiles
    minesFound += checkTile(coordX, coordY - 1);
    minesFound += checkTile(coordX, coordY + 1);

    //bottom 3 tiles
    minesFound += checkTile(coordX + 1, coordY - 1);
    minesFound += checkTile(coordX + 1, coordY);
    minesFound += checkTile(coordX + 1, coordY + 1);

    if(minesFound > 0) {
        board[coordX][coordY].innerText = minesFound;
        board[coordX][coordY].classList.add(`number-${minesFound}`);
    } else {
        //top 3
        checkMine(coordX - 1, coordY - 1);
        checkMine(coordX -1, coordY);
        checkMine(coordX -1, coordY + 1);

        //left and right
        checkMine(coordX, coordY - 1);
        checkMine(coordX, coordY + 1);

        //bottom 3
        checkMine(coordX + 1, coordY - 1);
        checkMine(coordX + 1, coordY);
        checkMine(coordX + 1, coordY + 1);
    }
    if(tilesClicked == rows * columns - +mineCounter.textContent) {
        mineCounter.textContent = 'Cleared';
        gameOver = true;
    }

}

function checkTile(coordX, coordY) {
    if(coordX < 0 || coordX >= rows || coordY < 0 || coordY >= columns) {
        return 0;
    }
    if(minesLocation.includes(`${coordX.toString()}-${coordY.toString()}`)) {
        return 1;
    }
    return 0;
}