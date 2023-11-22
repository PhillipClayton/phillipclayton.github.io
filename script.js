// Function to speak a given word using the Web Speech API
function speakWord(word) {
    // Check if the browser supports the SpeechSynthesis API
    if ('speechSynthesis' in window) {
        // Create a SpeechSynthesisUtterance object
        const utterance = new SpeechSynthesisUtterance();

        // Set the text to be spoken
        utterance.text = word;

        // Use the default voice (you can customize this if needed)
        utterance.voice = speechSynthesis.getVoices()[0];

        // Speak the word
        speechSynthesis.speak(utterance);
    } else {
        console.error('SpeechSynthesis API not supported in this browser.');
    }
}

// Example usage
const wordToSpeak = 'apple';
speakWord(wordToSpeak);
