let timerInterval;
let isRunning = false;

const timerDisplay = document.getElementById('timer');
const currentRoundDisplay = document.getElementById('currentRound');
const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const resetButton = document.getElementById('reset');
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

function setPreset(workMinutes, workSeconds, restMinutes, restSeconds, roundsCount, startDelaySecs) {
    document.getElementById('workMinutes').value = workMinutes;
    document.getElementById('workSeconds').value = workSeconds;
    document.getElementById('restMinutes').value = restMinutes;
    document.getElementById('restSeconds').value = restSeconds;
    document.getElementById('rounds').value = roundsCount;
    document.getElementById('startDelay').value = startDelaySecs;
    resetTimer();
}

// Load and parse the YAML configuration file
fetch('workouts.yaml')
    .then(response => response.text())
    .then(data => {
        const config = jsyaml.load(data);
        const presetsContainer = document.getElementById('presets');

        config.workouts.forEach(workout => {
            const button = document.createElement('button');
            button.textContent = workout.name;
            button.addEventListener('click', () => setPreset(workout.workTimeMins, workout.workTimeSecs, workout.restTimeMins, workout.restTimeSecs, workout.rounds, workout.startDelaySecs));
            presetsContainer.appendChild(button);
        });
    })
    .catch(error => console.error('Error loading the YAML file:', error));

startButton.addEventListener('click', startTimer);
stopButton.addEventListener('click', stopTimer);
resetButton.addEventListener('click', resetTimer);

updateDisplay();
