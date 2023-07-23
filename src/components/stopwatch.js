let interval;

function startStopwatch(secondsElement, minutesElement) {
    clearInterval(interval);
    interval = setInterval(startTimer, 1000, secondsElement, minutesElement);
    return;
}

function stopStopwatch() {
    clearInterval(interval);
    return;
}

function clearStopwatch(secondsElement, minutesElement) {
    stopStopwatch();
    secondsElement.textContent = '00';
    minutesElement.textContent = '00';
    return;
}

function startTimer(secondsElement, minutesElement) {
    let seconds = +secondsElement.textContent;
    let minutes = +minutesElement.textContent;
    if(seconds < 9) {
        seconds = '0' + (seconds + 1); 
    } else if(+seconds >= 9) {
        seconds = (seconds + 1); 
    }
    if(seconds > 59) {
        if(minutes < 9) {
            minutes = '0' + (minutes + 1).toString(); 
        } else {
            minutes = minutes++;
        }
        minutesElement.textContent = minutes;
        seconds = '00';
    }
    secondsElement.textContent = seconds;
    return;
}

export {startStopwatch, stopStopwatch, clearStopwatch};