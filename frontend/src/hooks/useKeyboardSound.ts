const audioStrokeSounds = [
    new Audio("/sounds/keystroke1.mp3"),
    new Audio("/sounds/keystroke2.mp3"),
    new Audio("/sounds/keystroke3.mp3"),
    new Audio("/sounds/keystroke4.mp3"),
]

const useKeyboardSounds = () => {
    const playRandomKeystrokeSound = () => {
        const randomSound = audioStrokeSounds[Math.floor(Math.random() * audioStrokeSounds.length)];

        randomSound.currentTime = 0;
        randomSound.play().catch(error => console.log("Audio play failed error:", error));
    }

    return {playRandomKeystrokeSound};
}

export default useKeyboardSounds;