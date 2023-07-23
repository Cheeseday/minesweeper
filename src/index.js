import { startStopwatch, stopStopwatch, clearStopwatch } from './components/stopwatch';
import { mineIcon } from './components/mineIcon';
import { updateBestResults, createListOfResults } from './components/bestResults';
import { changeColorTheme, chooseColorTheme } from './components/colorTheme';

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

let rows;
let columns;

let board = [];
let minesLocation = [];
let tilesClicked = 0; //goal to click all tiles except the ones containing mines

let flagEnabled = false;
let gameOver = false;

let numOfMoves = 0; //count of user moves for complete the game

const flagIcon = '🚩';

const body = document.body;

//Header
const header = document.createElement('header');
header.classList.add('header');

//Timer
const timerWrapper = document.createElement('div');
timerWrapper.classList.add('header-element');
timerWrapper.textContent = 'Time: ';
const timer = document.createElement('p');
timer.className = 'stopwatch';
timer.textContent = ':';
const timerMin = document.createElement('span');
timerMin.textContent = '00';
const timerSec = document.createElement('span');
timerSec.textContent = '00';
timer.insertAdjacentElement('afterbegin', timerMin);
timer.insertAdjacentElement('beforeend', timerSec);
timerWrapper.insertAdjacentElement('beforeend', timer);

//Mine counter
const mineCounterWrapper = document.createElement('div');
mineCounterWrapper.classList.add('header-element');
const counterLabel = document.createElement('span');
counterLabel.textContent = 'Mines: ';
const mineCounter = document.createElement('span');
mineCounter.classList.add('mine-counter');
mineCounterWrapper.insertAdjacentElement('beforeend', counterLabel);
mineCounterWrapper.insertAdjacentElement('beforeend', mineCounter);

//Moves counter
const movesWrapper = document.createElement('div');
const movesLabel = document.createElement('span');
movesLabel.textContent = 'Moves: ';
const movesCounter = document.createElement('span');
movesCounter.textContent = 0;
movesWrapper.insertAdjacentElement('beforeend', movesLabel);
movesWrapper.insertAdjacentElement('beforeend', movesCounter);

//Button for start new game
const buttonNewGame = document.createElement('button');
buttonNewGame.classList.add(...['button', 'button-header']);
buttonNewGame.textContent = 'New game';

header.insertAdjacentElement('beforeend', mineCounterWrapper);
header.insertAdjacentElement('beforeend', buttonNewGame);
header.insertAdjacentElement('beforeend', movesWrapper);
header.insertAdjacentElement('beforeend', timerWrapper);

// Game field
const gameField = document.createElement('div');
gameField.className = 'game-field';

//Radio for choose field size
const radioWrapper = document.createElement('div');
radioWrapper.className = 'radio-wrapper';
const radioFormLabel = document.createElement('p');
radioFormLabel.className = 'radio-form-label';
radioFormLabel.textContent = 'Choose field size: ';
const radioForm = document.createElement('form');
radioForm.id = 'radioForm';
radioForm.className = 'container';

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
inputMines.min = 10;
inputMines.max = 99;
inputMines.id = 'number-of-mines';

const labelMines = document.createElement('label');
labelMines.for = `${inputMines.id}`;
labelMines.textContent = 'Enter the number of mines*: ';

//Update button
const updateButton = document.createElement('button');
updateButton.classList.add(...['button', 'update-button']);
updateButton.textContent = 'Update';

numberOfMinesWrapper.insertAdjacentElement('afterbegin', updateButton);
numberOfMinesWrapper.insertAdjacentElement('afterbegin', inputMines);
numberOfMinesWrapper.insertAdjacentElement('afterbegin', labelMines);

//Button choose flag 
const buttonWrapper = document.createElement('div');
buttonWrapper.className = 'footer-wrapper';
const flagButton = document.createElement('button');
flagButton.classList.add(...['button', 'button-footer']);
flagButton.textContent = flagIcon;

//Change color palette version
// const root = document.querySelector(':root');
const themeButton = document.createElement('button');
themeButton.classList.add('theme-button');
themeButton.textContent = 'Change theme';

//remark
const remark = document.createElement('p');
remark.className = 'remark';
remark.textContent = '* the number of mines should be changed from 10 to 99';

//Modal window for end of the game
const modalContainer = document.createElement('div');
modalContainer.className = 'modal-container';
const modalSection = document.createElement('section');
modalSection.classList.add(...['modal', 'hidden']);
const modalOverlay = document.createElement('div');
modalOverlay.classList.add(...['overlay', 'hidden']);

const result = document.createElement('p');
const closeModalButton = document.createElement('button');
closeModalButton.classList.add(...[ 'button-close']);
closeModalButton.textContent = '⨉';

//Modal window for the best results
const modalResultsContainer = document.createElement('div');
modalResultsContainer.className = 'modal-container';
const modalForResults = document.createElement('div');
const headerOfResults = document.createElement('p');
headerOfResults.textContent = ('Your best results').toLocaleUpperCase();
   
const wrapper = document.createElement('div');
const listOfResults = document.createElement('ol');
listOfResults.type = '1';
wrapper.insertAdjacentElement('beforeend', listOfResults);
modalForResults.classList.add(...['modal', 'hidden', 'modal-results']);
modalForResults.insertAdjacentElement('beforeend', headerOfResults);
modalForResults.insertAdjacentElement('beforeend', wrapper);
modalResultsContainer.insertAdjacentElement('beforeend', modalForResults);

//Button for display the list of best results 
const resultsButton = document.createElement('button');
resultsButton.textContent = 'Your best results';

//Inserting of the elements
buttonWrapper.insertAdjacentElement('beforeend', flagButton);
buttonWrapper.insertAdjacentElement('beforeend', themeButton);
buttonWrapper.insertAdjacentElement('beforeend', resultsButton);
buttonWrapper.insertAdjacentElement('beforeend', remark);

modalSection.insertAdjacentElement('afterbegin', closeModalButton);
modalSection.insertAdjacentElement('afterbegin', result);
modalContainer.insertAdjacentElement('afterbegin', modalSection);

body.insertAdjacentElement('beforeend', header);
body.insertAdjacentElement('beforeend', radioWrapper);
body.insertAdjacentElement('beforeend', numberOfMinesWrapper);
body.insertAdjacentElement('beforeend', buttonWrapper);

body.insertAdjacentElement('afterbegin', modalContainer);
body.insertAdjacentElement('afterbegin', modalResultsContainer);
body.insertAdjacentElement('afterbegin', modalOverlay);

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

function newGame() {
    resetGameToZero();
    changeMinesCount();
    clearStopwatch(timerSec, timerMin);
    startGame();
}

function resetGameToZero() {
    board = [];
    minesLocation = [];
    tilesClicked = 0;
    numOfMoves = 0;
    
    flagEnabled = false;
    gameOver = false;

    flagButton.classList.remove('active-button');
    
    movesCounter.textContent = 0;
    gameField.replaceChildren();
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

    buttonWrapper.insertAdjacentElement('beforebegin', gameField);
    rows = xTiles;
    columns = yTiles;
}

function insertTiles(xTiles, yTiles, tileSize) {
    flagButton.addEventListener('click', setFlag);
    const mines = localStorage.getItem('countOfMines');
    mineCounter.textContent = mines ?? 10;
    inputMines.value = mines ?? 10;

    setMines(mines);

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

function setMines(mines, withoutMines) {
    let minesLeft = mines ?? 0;
    let arrayWithoutMines = withoutMines ?? [];
    while(minesLeft > 0) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        let id = `${r.toString()}-${c.toString()}`;

        if(!minesLocation.includes(id) && !arrayWithoutMines.includes(id)) {
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

    if(numOfMoves === 0) {
        startStopwatch(timerSec, timerMin);
    }

    let hasMine = minesLocation.includes(tile.id); 
    if(hasMine && numOfMoves === 0) {
        let withoutMines = [];
        let insertMines = 1;
        const clickedTileLocation = minesLocation.findIndex(item => item === tile.id);
        minesLocation.splice(clickedTileLocation, 1);
        withoutMines.push(tile.id);
        setMines(insertMines, withoutMines);
    }

    hasMine = minesLocation.includes(tile.id); 
    if(hasMine) {
        gameOver = true;
        stopStopwatch();
        revealMines(rows, columns);
        displayModal(false);
        disableTiles();
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
            const hasMine = minesLocation.includes(tile.id);
            const isFlagged = tile.classList.contains('tile-flagged');
            if(hasMine && !isFlagged) {
                // tile.innerText = '💣';
                tile.classList.add('tile-clicked');
                tile.innerHTML = mineIcon;
                // tile.style.backgroundColor = 'red';
            } else if(!hasMine && isFlagged) {
                tile.classList.add('wrong-flagged');
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
        gameOver = true;
        stopStopwatch();
        revealMines(rows, columns);
        displayModal(true);
        disableTiles();
        updateBestResults(mineCounter.textContent, movesCounter.textContent, timer.textContent);
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

function disableTiles() {
    for(const row of board) {
        for(const tile of row){
            tile.style.pointerEvents = 'none';
        }
    }
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

function closeModal() {
    modalSection.classList.add('hidden');
    modalOverlay.classList.add('hidden');
    modalForResults.classList.add('hidden');
}

function displayModal(condition) {
    if(condition) {
        result.classList.add('game-win');
        result.textContent = `Hooray! You found all mines in ${bringOutTime()} and ${numOfMoves} moves!`;
        condition = false;
    } else {
        result.classList.add('game-lose');
        result.textContent = 'Game over. Try again';
        condition = true;
    }
    modalSection.classList.remove('hidden');
    modalOverlay.classList.remove('hidden');
}

function addButtonAnimation() {
    let isClicked = this.classList.contains('mouse-over');
    if(!isClicked) {
        this.classList.remove('mouse-out');
        this.classList.add('mouse-over');
    } else {
        this.classList.remove('mouse-over');
        this.classList.add('mouse-out');
    }
}

function displayResults() {
    createListOfResults(listOfResults, headerOfResults);
    modalForResults.classList.remove("hidden");
    modalOverlay.classList.remove("hidden");
    return;
}

function bringOutTime() {
    let seconds = +timerSec.textContent;
    let minutes = +timerMin.textContent;
    if(minutes === 0) {
        return `${seconds} seconds`;
    } else if(minutes === 1) {
        return `1 minute and ${seconds} seconds`;
    } else {
        return `${minutes} minutes and ${seconds} seconds`;
    }
}

//Event listeners
buttonNewGame.addEventListener('click', newGame);

updateButton.addEventListener('click', () => {
    changeMinesCount();
    newGame();
});

radioForm.addEventListener('click', (event) => {
    const size = event.target.value;
    if(size === '10x10') {
        localStorage.setItem('fieldSize', size);
    } else if(size === '15x15') {
        localStorage.setItem('fieldSize', size);
    } else if(size === '25x25') {
        localStorage.setItem('fieldSize', size);
    }
});

gameField.addEventListener('click', (event) => {
    if(event.target.classList.contains('tile')) {
        numOfMoves++;
        movesCounter.textContent = numOfMoves;
    }
});

themeButton.addEventListener('click', changeColorTheme);

closeModalButton.addEventListener('click', closeModal);

modalOverlay.addEventListener('click', closeModal);

resultsButton.addEventListener('click', displayResults)

const buttons = document.querySelectorAll('button');

for(const button of buttons) {
    button.addEventListener('mouseover', addButtonAnimation);
    button.addEventListener('mouseout', addButtonAnimation);
}