let timerInterval;
let isRunning = false;

const timerDisplay = document.getElementById('timer');
const currentRoundDisplay = document.getElementById('currentRound');
const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const resetButton = document.getElementById('reset');
const tabataPresetButton = document.getElementById('tabataPreset');
const emomPresetButton = document.getElementById('emomPreset');
const forTimePresetButton = document.getElementById('forTimePreset');
const beepStartWork = document.getElementById('beepStartWork');
const beepStartRest = document.getElementById('beepStartRest');
const beepFinishWorkout = document.getElementById('beepFinishWorkout');

let workTime, restTime, rounds, startDelay;
let currentRound = 0;
let currentTime;
let isWorkPhase = true;

function updateDisplay() {
    const minutes = Math.floor(currentTime / 60);
    const seconds = currentTime % 60;
    timerDisplay.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    currentRoundDisplay.textContent = `Round: ${currentRound + 1}`;
}

function playBeep(audioElement) {
    audioElement.currentTime = 0; // Rewind to the start
    audioElement.play();
}

function startTimer() {
    if (isRunning) return;

    workTime = parseInt(document.getElementById('workMinutes').value) * 60 + parseInt(document.getElementById('workSeconds').value);
    restTime = parseInt(document.getElementById('restMinutes').value) * 60 + parseInt(document.getElementById('restSeconds').value);
    rounds = parseInt(document.getElementById('rounds').value);
    startDelay = parseInt(document.getElementById('startDelay').value);

    isRunning = true;
    currentRound = 0;
    currentTime = startDelay;
    isWorkPhase = true;
    updateDisplay();

    const startDelayInterval = setInterval(() => {
        if (currentTime > 0) {
            currentTime--;
            updateDisplay();
        } else {
            clearInterval(startDelayInterval);
            playBeep(beepStartWork);
            currentTime = workTime;
            updateDisplay();
            timerInterval = setInterval(runTimer, 1000);
        }
    }, 1000);
}

function runTimer() {
    if (currentTime > 0) {
        currentTime--;
    } else {
        if (isWorkPhase) {
            if (currentRound < rounds - 1) {
                if (restTime > 0) {
                    playBeep(beepStartRest);
                }
                currentRound++;
                isWorkPhase = false;
                currentTime = restTime;
            } else {
                clearInterval(timerInterval);
                isRunning = false;
                playBeep(beepFinishWorkout);
            }
        } else {
            playBeep(beepStartWork);
            isWorkPhase = true;
            currentTime = workTime;
        }
    }
    updateDisplay();
}

function stopTimer() {
    clearInterval(timerInterval);
    isRunning = false;
}

function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    currentRound = 0;
    isWorkPhase = true;
    workTime = parseInt(document.getElementById('workMinutes').value) * 60 + parseInt(document.getElementById('workSeconds').value);
    currentTime = workTime;
    updateDisplay();
}

function setPreset(workMinutes, workSeconds, restMinutes, restSeconds, roundsCount) {
    document.getElementById('workMinutes').value = workMinutes;
    document.getElementById('workSeconds').value = workSeconds;
    document.getElementById('restMinutes').value = restMinutes;
    document.getElementById('restSeconds').value = restSeconds;
    document.getElementById('rounds').value = roundsCount;
    resetTimer();
}

tabataPresetButton.addEventListener('click', () => setPreset(0, 20, 0, 10, 8));
emomPresetButton.addEventListener('click', () => setPreset(1, 0, 0, 0, 20));
forTimePresetButton.addEventListener('click', () => setPreset(5, 0, 0, 0, 1));
startButton.addEventListener('click', startTimer);
stopButton.addEventListener('click', stopTimer);
resetButton.addEventListener('click', resetTimer);

updateDisplay();
