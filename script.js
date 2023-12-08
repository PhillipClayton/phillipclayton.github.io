// Button listener for displaying the buttons for spelling
document.addEventListener('DOMContentLoaded', function () {
    const startLearningBtn = document.getElementById('startLearningBtn');
    
    startLearningBtn.addEventListener('click', async function () {
        // Get the selected grade value
        const gradeSelect = document.getElementById('gradeSelect');
        const selectedGrade = gradeSelect.value;
        
        // Load all words from selected grade's word bank
        let selectedWordBank = await loadWordBank(selectedGrade);

        // Randomnly select 10 words from the bank
        let wordsToTest = getRandomWordsFromArray(selectedWordBank)

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
        wordsForGrade = parseCSV(csvData);

        return wordsForGrade;
    } catch (error) {
        throw new Error(`Error loading word bank for grade ${grade}: ${error.message}`);
    }
}

// Parse CSV data
function parseCSV(csvData) {
    const words = csvData.split(',');
    return words.map(word => word.trim()); // Trim whitespace from each word
}

// Get random words from the array
function getRandomWordsFromArray(fullArray) {
    if (!Array.isArray(fullArray)) {
        throw new Error('fullArray must be an array');
    }
    let randomWords = [];
    
    for (let i = 0; i < 10; i++) {
        const j = Math.floor(Math.random() * fullArray.length - 1);
        randomWords.push(fullArray[j]);
        temp_value = fullArray[fullArray.length - 1];
        fullArray[fullArray.length - 1] = fullArray[j];
        fullArray[j] = temp_value;
        fullArray.pop();
    }
    return randomWords;
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
        button.addEventListener('click', () => speakWord(word)); // Attach a click event listener
        wordButtonsContainer.appendChild(button);
    });

    //wordButtonsContainer.style.display = 'block';
}

// Speak a given word using the Web Speech API
async function speakWord(word) {
    // Check if the browser supports the SpeechSynthesis API
    if ('speechSynthesis' in window) {
        // Create a SpeechSynthesisUtterance object
        const utterance = new SpeechSynthesisUtterance();

        // Set the text to be spoken
        utterance.text = word;

        // Use the default voice (you can customize this if needed)
        // Wait for the voices to be loaded before setting the voice
        if (speechSynthesis.getVoices().length === 0) {
            speechSynthesis.onvoiceschanged = function() {
                utterance.voice = speechSynthesis.getVoices()[0];
            };
        } else {
            utterance.voice = speechSynthesis.getVoices()[0];
        }

        // Speak the word
        speechSynthesis.speak(utterance);
    } else {
        console.error('SpeechSynthesis API not supported in this browser.');
    }
}
