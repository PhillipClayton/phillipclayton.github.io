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
        const response = await fetch(`WordBanks/GradeSentences${grade}.csv`);
        const csvData = await response.text();
        wordsForGrade = parseCSV(csvData);

        return wordsForGrade;
    } catch (error) {
        throw new Error(`Error loading word bank for grade ${grade}: ${error.message}`);
    }
}

// Parse CSV data
function parseCSV(csvData) {
    const lines = csvData.split('\n');
    return lines.map(line => {
        let word, sentence;
        if (line.includes(',')) {
            [word, sentence] = line.split(',');
        } else {
            word = line;
            sentence = '';
        }
        return { word: word.trim(), sentence: sentence.trim() };
    });
}

// Get random words from the array
function getRandomWordsFromArray(fullArray) {
    if (!Array.isArray(fullArray)) {
        throw new Error('fullArray must be an array');
    }
    let randomWords = [];
    
    for (let i = 0; i < 10; i++) {
        const j = Math.floor(Math.random() * fullArray.length);
        randomWords.push(fullArray[j]);
        const temp_value = fullArray[fullArray.length - 1];
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
    words.forEach((wordObj, index) => {
        const button = document.createElement('button');
        button.textContent = `Word ${index + 1}`;
        button.value = wordObj.word; // Set the value to the corresponding word
        button.addEventListener('click', () => speakWord(wordObj.word + ',' + wordObj.sentence)); // Attach a click event listener
        wordButtonsContainer.appendChild(button);
    });
}

// Speak a given word and sentence using the Web Speech API
async function speakWord(wordAndSentence) {
    // Check if the browser supports the SpeechSynthesis API
    if ('speechSynthesis' in window) {
        // Split the input string into a word and a sentence
        const [word, sentence] = wordAndSentence.split(',');

        // Create a SpeechSynthesisUtterance object for the word
        const utteranceWord = new SpeechSynthesisUtterance();
        utteranceWord.text = word;
        utteranceWord.lang = 'en-US';

        // Create a SpeechSynthesisUtterance object for the sentence
        const utteranceSentence = new SpeechSynthesisUtterance();
        utteranceSentence.text = sentence;
        utteranceSentence.lang = 'en-US';
        utteranceSentence.rate = 0.8; // Slow down the rate of speech for the sentence

        // Use the default voice (you can customize this if needed)
        // Wait for the voices to be loaded before setting the voice
        if (speechSynthesis.getVoices().length === 0) {
            speechSynthesis.onvoiceschanged = function() {
                utteranceWord.voice = speechSynthesis.getVoices()[1];
                utteranceSentence.voice = speechSynthesis.getVoices()[1];

                // Speak the word
                speechSynthesis.speak(utteranceWord);
            };
        } else {
            utteranceWord.voice = speechSynthesis.getVoices()[1];
            utteranceSentence.voice = speechSynthesis.getVoices()[1];

            // Speak the word
            speechSynthesis.speak(utteranceWord);
        }

        // When the word has finished being spoken, speak the sentence
        utteranceWord.onend = function() {
            speechSynthesis.speak(utteranceSentence);
        };
    } else {
        console.error('SpeechSynthesis API not supported in this browser.');
    }
}