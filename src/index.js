const easy = {
    name: 'easy',
    minesCount: 10,
    fieldSize: '10x10',
}
const medium = {
    name: 'medium',
    minesCount: 40,
    fieldSize: '15x15',
}
const hard = {
    name: 'hard',
    minesCount: 99,
    fieldSize: '25x25',
}

// const tileSize = 35;

let rows;
let columns;

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
</svg>`;  //carry on another module

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

//Radio for choose field size
const radioWrapper = document.createElement('div');
radioWrapper.className = 'radio-wrapper';
const radioFormLabel = document.createElement('p');
radioFormLabel.className = 'radio-form-label';
radioFormLabel.textContent = 'Choose field size: ';
const radioForm = document.createElement('form');
radioForm.id = 'radioForm';
radioForm.className = 'container'

let [input, label] = createRadioElement(easy, 'field-size');
label.insertAdjacentElement('afterbegin', input);
radioForm.insertAdjacentElement('beforeend', label);
[input, label] = createRadioElement(medium, 'field-size');
label.insertAdjacentElement('afterbegin', input);
radioForm.insertAdjacentElement('beforeend', label);
[input, label] = createRadioElement(hard, 'field-size');
label.insertAdjacentElement('afterbegin', input);
radioForm.insertAdjacentElement('beforeend', label);

radioWrapper.insertAdjacentElement('afterbegin', radioForm);
radioWrapper.insertAdjacentElement('afterbegin', radioFormLabel);

//Mines counter
const numberOfMinesWrapper = document.createElement('div');
const inputMines = document.createElement('input');
inputMines.type = 'number';
inputMines.name = 'number-of-mines';
inputMines.value = 10;
inputMines.min = 10;
inputMines.max = 99;
inputMines.id = 'number-of-mines';

const labelMines = document.createElement('label');
labelMines.for = `${inputMines.id}`;
labelMines.textContent = 'Enter the number of mines*: ';

const minesButton = document.createElement('button');
minesButton.classList.add(...['button', 'mines-button']);
minesButton.textContent = 'Update';

numberOfMinesWrapper.insertAdjacentElement('afterbegin', minesButton);
numberOfMinesWrapper.insertAdjacentElement('afterbegin', inputMines);
numberOfMinesWrapper.insertAdjacentElement('afterbegin', labelMines);

//Button choose flag 
const flagButtonWrapper = document.createElement('div');
flagButtonWrapper.className = 'flag-wrapper';
const flagButton = document.createElement('button');
flagButton.classList.add(...['button', 'button-footer']);
flagButton.textContent = flagIcon;
flagButtonWrapper.insertAdjacentElement('afterbegin', flagButton);

//Change color palette version
const root = document.querySelector(':root');
const themeButton = document.createElement('button');
themeButton.classList.add('theme-button');
themeButton.textContent = 'Change theme';

//remark
const remark = document.createElement('p');
remark.className = 'remark';
remark.textContent = '* the number of mines should be changed from 10 to 99';

body.insertAdjacentElement('beforeend', header);
body.insertAdjacentElement('beforeend', radioWrapper);
body.insertAdjacentElement('beforeend', numberOfMinesWrapper);
body.insertAdjacentElement('beforeend', flagButtonWrapper);
body.insertAdjacentElement('beforeend', themeButton);
body.insertAdjacentElement('beforeend', remark);


window.onload = function() {
    startGame();
}

function startGame() {
    let tilesOnAbscissaAxis;
    let tilesOnOrdinateAxis;
    const tileSize = defineTileSize();
    if(localStorage.getItem('fieldSize')) {
        [tilesOnAbscissaAxis, tilesOnOrdinateAxis] = localStorage.getItem('fieldSize').split('x');
    } else {
        tilesOnAbscissaAxis = 10; 
        tilesOnOrdinateAxis = 10; 
    }
    displayField(tilesOnAbscissaAxis, tilesOnOrdinateAxis, tileSize);
    insertTiles(tilesOnAbscissaAxis, tilesOnOrdinateAxis, tileSize);
    chooseColorTheme();
}

function chooseColorTheme() {
    let theme = localStorage.getItem('theme');
    if(!theme || theme === 'light') {
        root.classList.add('light');
        localStorage.setItem('theme', 'light');
    } else if(theme === 'dark') {
        root.classList.add('dark');
    }
}

function changeColorTheme() {
    const theme = localStorage.getItem('theme');
    if(!theme || theme === 'light') {
        root.classList.add('dark');
        root.classList.remove('light');
        localStorage.setItem('theme', 'dark');
    } else if(theme === 'dark') {
        root.classList.add('light');
        root.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }
    console.log(localStorage.getItem('theme'));
    console.log(root);
}

function defineTileSize() {
    const screenWidth = document.documentElement.clientWidth;
    let tileSize;
    if(screenWidth < 500) {
        tileSize = 15;
    } else if(screenWidth <= 767) {
        tileSize = 19;
    } else if(screenWidth <= 1079) {
        tileSize = 30;   
    } else if(screenWidth > 1079) {
        tileSize = 40;
    } else {
        tileSize = 25;
    }
    return tileSize;
}

function displayField(xTiles, yTiles, tileSize) {
    gameField.style.width = `${tileSize * xTiles + 5.8}px`;

    flagButtonWrapper.insertAdjacentElement('beforebegin', gameField);
    rows = xTiles;
    columns = yTiles;
}

function insertTiles(xTiles, yTiles, tileSize) {
    flagButton.addEventListener('click', setFlag);
    setMines();

    for(let i = 0; i < xTiles; i++) {
        let row = [];
        for(let j = 0; j < yTiles; j++){
            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.id = `${i.toString()}-${j.toString()}`; 
            tile.style.width = `${tileSize}px`;
            tile.style.height = `${tileSize}px`;
            tile.addEventListener('click', clickTile);
            gameField.insertAdjacentElement('beforeend', tile);
            row.push(tile);
        }
        board.push(row);
    }
}

function setMines() {
    let minesLeft;
    const mines = localStorage.getItem('countOfMines');
    if(mines) {
        minesLeft = mines;
        mineCounter.textContent = mines;
    } else {
        minesLeft = 10;
        mineCounter.textContent = 10;
    }
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
        flagButton.classList.remove('active-button');
    } else {
        flagEnabled = true;
        flagButton.classList.add('active-button');
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
            tile.classList.add('tile-flagged');
        }
        else if(tile.innerText == flagIcon) {
            tile.innerText = '';
            tile.classList.remove('tile-flagged');
        }
        return;
    }

    if(!flagEnabled && tile.innerText === flagIcon) {
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
                tile.classList.add('tile-clicked');
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
    if(board[coordX][coordY].innerText === flagIcon) {
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

function newGame() {
    resetGameToZero();
    changeMinesCount();
    startGame();
}

function resetGameToZero() {
    board = [];
    minesLocation = [];
    tilesClicked = 0;

    flagEnabled = false;
    gameOver = false;

    gameField.replaceChildren();
}

function createRadioElement(object, name) {
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = name;
    let [tilesInWidth, tilesInHeight] = object.fieldSize.split('x');
    input.value = `${tilesInWidth}x${tilesInHeight}`;
    input.id = object.name;

    const label = document.createElement('label');
    label.className = 'input-size-label';
    label.for = `${input.id}`;
    label.textContent = input.value;
    return [input, label];
}

function changeMinesCount() {
    if(inputMines.value > 99) {
        localStorage.setItem('countOfMines', 99);
        inputMines.value = 99;
    } else if (inputMines.value < 10) {
        localStorage.setItem('countOfMines', 10);
        inputMines.value = 10;
    } else {
        localStorage.setItem('countOfMines', inputMines.value);
    }
}

//Event listeners
buttonNewGame.addEventListener('click', newGame);

minesButton.addEventListener('click', () => {
    changeMinesCount();
    newGame();
});

radioForm.addEventListener('click', (event) => {
    if(event.target.value === '10x10') {
        localStorage.setItem('fieldSize', event.target.value);
    } else if(event.target.value === '15x15') {
        localStorage.setItem('fieldSize', event.target.value);
    } else if(event.target.value === '25x25') {
        localStorage.setItem('fieldSize', event.target.value);
    }
});

themeButton.addEventListener('click', changeColorTheme);