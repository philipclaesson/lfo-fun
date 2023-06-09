let audioContext;
let oscillator;
let gainNode;
let lfo;
let lfoGainNode;
let isMouseDown = false;

const waveforms = ['sine', 'square', 'sawtooth', 'triangle'];
let oscillatorWaveformIndex = 0;
let lfoWaveformIndex = 0;

function createAudioContext() {
    if (audioContext) return;
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
}

function initializeAudio() {
    gainNode = audioContext.createGain();
    gainNode.gain.value = 0.1;
    gainNode.connect(audioContext.destination);

    lfoGainNode = audioContext.createGain();
    lfoGainNode.gain.value = 50; // Adjust this value to control the modulation depth
}

function startTone(frequency, lfoFrequency) {
    oscillator = audioContext.createOscillator();
    oscillator.type = waveforms[oscillatorWaveformIndex]; // Add this line
    oscillator.frequency.value = frequency;

    lfo = audioContext.createOscillator();
    lfo.type = waveforms[lfoWaveformIndex]; // Add this line
    lfo.frequency.value = lfoFrequency;

    lfo.connect(lfoGainNode);
    lfoGainNode.connect(oscillator.frequency);
    oscillator.connect(gainNode);

    oscillator.start();
    lfo.start();
}

function stopTone() {
    if (oscillator) {
        oscillator.stop();
        oscillator.disconnect();
    }
    if (lfo) {
        lfo.stop();
        lfo.disconnect();
    }
}

function getFrequencyFromMousePosition(event) {
    const windowHeight = window.innerHeight;
    const mouseY = event.clientY;
    const frequencyRange = 1000 - 100;
    const frequency = 1000 - (mouseY / windowHeight) * frequencyRange;
    return frequency;
}

function getLfoFrequencyFromMousePosition(event) {
    const windowWidth = window.innerWidth;
    const mouseX = event.clientX;
    const lfoFrequencyRange = 10 - .1;
    const lfoFrequency = .1 + (mouseX / windowWidth) * lfoFrequencyRange;
    return lfoFrequency;
}

// mouse down
document.addEventListener('mousedown', (event) => {
    isMouseDown = true;
    createAudioContext();
    initializeAudio();
    const frequency = getFrequencyFromMousePosition(event);
    const lfoFrequency = getLfoFrequencyFromMousePosition(event);
    startTone(frequency, lfoFrequency);
    document.body.style.backgroundColor = getColorFromMousePosition(event);
});

// touching screen
document.addEventListener('touchstart', async (event) => {
    isMouseDown = true;
    event.preventDefault();
    createAudioContext();
    initializeAudio();
    const frequency = getFrequencyFromMousePosition(event.touches[0]);
    const lfoFrequency = getLfoFrequencyFromMousePosition(event.touches[0]);
    startTone(frequency, lfoFrequency);
}, { passive: false });

// moving mouse
document.addEventListener('mousemove', (event) => {
    if (!oscillator || !lfo || !isMouseDown) return;
    const frequency = getFrequencyFromMousePosition(event);
    const lfoFrequency = getLfoFrequencyFromMousePosition(event);
    oscillator.frequency.value = frequency;
    lfo.frequency.value = lfoFrequency;
    oscillatorFrequencyValue.textContent = frequency.toFixed(0);
    lfoFrequencyValue.textContent = lfoFrequency.toFixed(1);
    document.body.style.backgroundColor = getColorFromMousePosition(event);
});

// moving finger
document.addEventListener('touchmove', (event) => {
    event.preventDefault();
    if (!oscillator || !lfo || !isMouseDown) return;
    const frequency = getFrequencyFromMousePosition(event.touches[0]);
    const lfoFrequency = getLfoFrequencyFromMousePosition(event.touches[0]);
    oscillator.frequency.value = frequency;
    lfo.frequency.value = lfoFrequency;
    oscillatorFrequencyValue.textContent = frequency.toFixed(2);
    lfoFrequencyValue.textContent = lfoFrequency.toFixed(2);
    document.body.style.backgroundColor = getColorFromMousePosition(event.touches[0]);
}, { passive: false });

// lifting mouse
document.addEventListener('mouseup', () => {
    isMouseDown = false;
    stopTone();
});

// lifting finger
document.addEventListener('touchend', () => {
    isMouseDown = false;
    stopTone();
});

document.addEventListener('touchcancel', () => {
    isMouseDown = false;
    stopTone();
});

const oscillatorWaveformBtn = document.getElementById('oscillatorWaveformBtn');
const lfoWaveformBtn = document.getElementById('lfoWaveformBtn');
const oscillatorFrequencyValue = document.getElementById('oscillatorFrequencyValue');
const lfoFrequencyValue = document.getElementById('lfoFrequencyValue');

function onOscillatorWaveformBtnClick() {
    console.log('click')
    oscillatorWaveformIndex = (oscillatorWaveformIndex + 1) % waveforms.length;
    if (oscillator) {
        oscillator.type = waveforms[oscillatorWaveformIndex];
    }
    let oscillatorformLabel = document.getElementById('oscillatorWaveformLabel');
    oscillatorformLabel.textContent = waveforms[oscillatorWaveformIndex];
}

function onLfoWaveformBtnClick() {
    lfoWaveformIndex = (lfoWaveformIndex + 1) % waveforms.length;
    if (lfo) {
        lfo.type = waveforms[lfoWaveformIndex];
    }
    let lfoWaveformLabel = document.getElementById('lfoWaveformLabel');
    lfoWaveformLabel.textContent = waveforms[lfoWaveformIndex];
}

oscillatorWaveformBtn.addEventListener('click', onOscillatorWaveformBtnClick);
oscillatorWaveformBtn.addEventListener('touchstart', onOscillatorWaveformBtnClick);


lfoWaveformBtn.addEventListener('click', onLfoWaveformBtnClick);
lfoWaveformBtn.addEventListener('touchstart', onLfoWaveformBtnClick);

// Background color fun!
function getColorFromMousePosition(event) {
    const xRatio = event.clientX / window.innerWidth;
    const yRatio = event.clientY / window.innerHeight;

    const r = Math.floor(xRatio * 255);
    const g = Math.floor(yRatio * 255);
    const b = Math.floor((1 - xRatio) * (1 - yRatio) * 255);

    return `rgb(${r}, ${g}, ${b})`;
}

