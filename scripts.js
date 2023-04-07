let audioContext;
let oscillator;
let gainNode;
let lfo;
let lfoGainNode;

function initializeAudio() {
    if (audioContext) return;

    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    gainNode = audioContext.createGain();
    gainNode.gain.value = 0.1;
    gainNode.connect(audioContext.destination);

    lfoGainNode = audioContext.createGain();
    lfoGainNode.gain.value = 50; // Adjust this value to control the modulation depth
}

function startTone(frequency, lfoFrequency) {
    oscillator = audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;

    lfo = audioContext.createOscillator();
    lfo.type = 'sine';
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
    const lfoFrequencyRange = 100 - 10;
    const lfoFrequency = 10 + (mouseX / windowWidth) * lfoFrequencyRange;
    return lfoFrequency;
}

document.addEventListener('mousedown', (event) => {
    initializeAudio();
    const frequency = getFrequencyFromMousePosition(event);
    const lfoFrequency = getLfoFrequencyFromMousePosition(event);
    startTone(frequency, lfoFrequency);
});

document.addEventListener('mousemove', (event) => {
    if (!oscillator || !lfo) return;
    const frequency = getFrequencyFromMousePosition(event);
    const lfoFrequency = getLfoFrequencyFromMousePosition(event);
    oscillator.frequency.value = frequency;
    lfo.frequency.value = lfoFrequency;
});

document.addEventListener('mouseup', () => {
    stopTone();
});

document.addEventListener('touchstart', (event) => {
    event.preventDefault();
    initializeAudio();
    const frequency = getFrequencyFromMousePosition(event.touches[0]);
    const lfoFrequency = getLfoFrequencyFromMousePosition(event.touches[0]);
    startTone(frequency, lfoFrequency);
});

document.addEventListener('touchmove', (event) => {
    event.preventDefault();
    if (!oscillator || !lfo) return;
    const frequency = getFrequencyFromMousePosition(event.touches[0]);
    const lfoFrequency = getLfoFrequencyFromMousePosition(event.touches[0]);
    oscillator.frequency.value = frequency;
    lfo.frequency.value = lfoFrequency;
});

document.addEventListener('touchend', () => {
    stopTone();
});
