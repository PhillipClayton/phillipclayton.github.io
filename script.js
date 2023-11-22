
// Button listener for displaying the buttons for spelling
document.addEventListener('DOMContentLoaded', function () {
    const startLearningBtn = document.getElementById('startLearningBtn');
    
    startLearningBtn.addEventListener('click', function () {
        // Get the selected grade value
        const gradeSelect = document.getElementById('gradeSelect');
        const selectedGrade = gradeSelect.value;
        
        // Load all words from selected grade's word bank
        let selectedWordBank = []
        selectedWordBank = loadWordBank(selectedGrade);

        // Randomnly select 10 words from the bank
        let wordsToTest = []
        wordsToTest = getRandomWordsFromArray(selectedWordBank)

        // Generate a button for each word
        // When pressed, each button speaks the word but doesn't display it
        generateWordButtons(wordsToTest)
    });
});

// Load the word bank for a given grade from a CSV file
async function loadWordBank(grade) {
    try {
        const response = await fetch(`WordBanks/Grade${grade}.csv`);
        const csvData = await response.text();
        return parseCSV(csvData);
    } catch (error) {
        throw new Error(`Error loading word bank for grade ${grade}: ${error.message}`);
    }
}

// Parse CSV data
function parseCSV(csvData) {
    const lines = csvData.split(',');
    // const headers = lines[0].split(',');

    let wordBank = [];
    lines.forEach(word, wordBank.push());    

    /* 
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        let entry = {};

        for (let j = 0; j < headers.length; j++) {
            entry[headers[j]] = values[j];
        }

        wordBank.push(entry);
    }
    */

    return wordBank;
}

// Get 10 random words from an array
function getRandomWordsFromArray(wordsArray) {
    let shuffledWords = [];
    shuffledWords = shuffleArray(wordsArray); // Shuffle the words
    return shuffledWords.slice(0, 10); // Take the first 10 words
}

// Function to shuffle an array
function shuffleArray(arrayToShuffle) {
    let shuffledArray = arrayToShuffle;
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
}

// Generate word buttons in the "wordDisplay" div
function generateWordButtons(words) {
    const wordButtonsContainer = document.getElementById('wordButtons');

    // Clear existing buttons
    wordButtonsContainer.innerHTML = '';

    // Create buttons for each word
    words.forEach((word, index) => {
        const button = document.createElement('button');
        button.textContent = `Word ${index + 1}`;
        button.value = word; // Set the value to the corresponding word
        // button.addEventListener('click', handleWordButtonClick); // Attach a click event listener
        wordButtonsContainer.appendChild(button);
    });
}

// Speak a given word using the Web Speech API
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