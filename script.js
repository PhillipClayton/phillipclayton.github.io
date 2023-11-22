// Function to load the word bank for a given grade from a CSV file
async function loadWordBank(grade) {
    try {
        const response = await fetch(`WordBanks/grade${grade}.csv`);
        const csvData = await response.text();
        return parseCSV(csvData);
    } catch (error) {
        throw new Error(`Error loading word bank for grade ${grade}: ${error.message}`);
    }
}

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

/* Example usage
const wordToSpeak = 'apple';
speakWord(wordToSpeak);
*/

/* Example usage in the context of your application
const wordButton = document.getElementById('wordButton1'); // Replace with the actual ID of your button
wordButton.addEventListener('click', () => {
    const wordToSpeak = 'apple'; // Replace with the actual word associated with the button
    speakWord(wordToSpeak);
});
*/ 

// Function to load word bank for a specific grade
async function loadWordBank(grade) {
    try {
        const response = await fetch(`wordbanks/grade${grade}.csv`);
        const data = await response.text();
        return parseCSV(data);
    } catch (error) {
        console.error('Error loading word bank:', error);
    }
}

// Function to parse CSV data
function parseCSV(csvData) {
    const lines = csvData.split('\n');
    const headers = lines[0].split(',');

    const wordBank = [];

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        const entry = {};

        for (let j = 0; j < headers.length; j++) {
            entry[headers[j]] = values[j];
        }

        wordBank.push(entry);
    }

    return wordBank;
}

// Button listener for displaying the buttons for spelling
document.addEventListener('DOMContentLoaded', function () {
    const startLearningBtn = document.getElementById('startLearningBtn');
    
    startLearningBtn.addEventListener('click', function () {
        // Get the selected grade value
        const gradeSelect = document.getElementById('gradeSelect');
        const selectedGrade = gradeSelect.value;
        
        // Call your function with the selected grade as an argument
        loadWordBank(selectedGrade);
    });
});