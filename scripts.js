const frequencySlider = document.getElementById('frequencySlider');
const frequencyValue = document.getElementById('frequencyValue');

let audioContext;
let oscillator;
let gainNode;

function initializeAudio() {
    if (audioContext) return;

    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    oscillator = audioContext.createOscillator();
    gainNode = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = 100;
    gainNode.gain.value = 0.1;

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start();
}

frequencySlider.addEventListener('mousedown', () => {
    initializeAudio();
});

frequencySlider.addEventListener('touchstart', () => {
    initializeAudio();
});

frequencySlider.addEventListener('input', (event) => {
    if (!audioContext) {
        initializeAudio();
    }
    const newFrequency = event.target.value;
    oscillator.frequency.value = newFrequency;
    frequencyValue.textContent = newFrequency;
});
