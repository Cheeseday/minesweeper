function updateBestResults(mines, moves, time) {
    const newNote = createNote(mines, moves, time);
    const array = receiveBestResults();
    if(array.length < 10) {
        array.push(newNote);
        array.sort(sortArrayByTime);
        localStorage.setItem('bestResults', JSON.stringify(array));
        return;
    }
    const hasWorseResult = array.some(element => countSeconds(element.time) > countSeconds(newNote.time));
    if(hasWorseResult) {
        array.pop();
        array.push(newNote);
        array.sort(sortArrayByTime);
        localStorage.setItem('bestResults', JSON.stringify(array));
    }
    return;
}

function createNote(mines, moves, time) {
    return {
        time: time,
        moves: moves,
        mines: mines,
    };
}

function sortArrayByTime(a, b) {
    const timeA = countSeconds(a.time);
    const timeB = countSeconds(b.time);
    if (timeA < timeB) {
        return -1;
    }
    if (timeA > timeB) {
        return 1;
    }
    return 0;
}

function countSeconds(time) {
    const [minutes, seconds] = time.split(':');
    const result = minutes * 60 + (+seconds);
    return result; 
}

function receiveBestResults() {
    let bestResults;
    if(localStorage.getItem('bestResults') && localStorage.getItem('bestResults') !== '') {
        bestResults = localStorage.getItem('bestResults');
    } else {
        bestResults = '[]';
    }
    return JSON.parse(bestResults);
}

function createListOfResults(listOfResults, headerOfResults) {
    listOfResults.replaceChildren();
    const resultsArray = receiveBestResults();
    if(resultsArray.length === 0) {
        headerOfResults.textContent = 'Will glad to sight your results! Here we go!'.toLocaleUpperCase();
    } else {
        resultsArray.forEach((element) => {
            const item = document.createElement('li');
            const content = `Time: ${element.time}, moves: ${element.moves}, mines: ${element.mines}`;
            item.className = 'results-item';
            item.textContent = content;
            listOfResults.insertAdjacentElement('beforeend', item); 
        });
    }
    return;
}

export { updateBestResults, createListOfResults};