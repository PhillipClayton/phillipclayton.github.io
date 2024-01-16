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

// Generate word buttons and input boxes in the "wordDisplay" div
function generateWordButtons(words) {
    const wordButtonsContainer = document.getElementById('wordButtons');

    // Clear existing buttons and input boxes
    wordButtonsContainer.innerHTML = '';

    // Create buttons and input boxes for each word
    words.forEach((wordObj, index) => {
        const div = document.createElement('div');

        const button = document.createElement('button');
        button.textContent = `Word ${index + 1}`;
        button.addEventListener('click', () => speakWord(wordObj.word + ',' + wordObj.sentence)); // Attach a click event listener

        const input = document.createElement('input');
        input.type = 'text';

        const result = document.createElement('span');

        div.appendChild(button);
        div.appendChild(input);
        div.appendChild(result);

        wordButtonsContainer.appendChild(div);
    });

// Function to play a tone with a given frequency and duration, with optional oscillation
function playTone(context, frequency, duration, oscillate = false) {
    const oscillator = context.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;

    if (oscillate) {
        const gain = context.createGain();
        gain.gain.value = 30; // The amplitude of the oscillation

        const modulator = context.createOscillator();
        modulator.type = 'sine';
        modulator.frequency.value = 4; // The frequency of the oscillation

        modulator.connect(gain);
        gain.connect(oscillator.frequency);

        modulator.start();
        setTimeout(() => { modulator.stop(); }, duration);
    }

    oscillator.connect(context.destination);
    oscillator.start();
    setTimeout(() => { oscillator.stop(); }, duration);
}

// Create the "Check Answers" button
const checkAnswersButton = document.createElement('button');
checkAnswersButton.textContent = 'Check Answers';
checkAnswersButton.addEventListener('click', () => {
    const divs = wordButtonsContainer.children;
    let allCorrect = true;
    for (let i = 0; i < divs.length - 1; i++) { // -1 to exclude the checkAnswersButton
        const input = divs[i].children[1]; // the input is the second child
        const result = divs[i].children[2]; // the result span is the third child

        if (input.value.toLowerCase() === words[i].word.toLowerCase()) {
            result.textContent = '✅';
        } else {
            result.textContent = '❌';
            allCorrect = false;
        }
    }

    // Play a three-tone sequence based on whether all answers are correct
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const duration_1 = 500; // Half a second
    const duration_2 = 1500; // 1.5 seconds
    const delay = 600; // Slightly longer than the duration to ensure the tones don't overlap
    if (allCorrect) {
        // Four ascending tones forming an A-major triad (A4, C#5, E5) + A5 (one octave higher)
        setTimeout(() => { playTone(context, 440, duration_1); }, 0); // A4
        setTimeout(() => { playTone(context, 554.37, duration_1); }, delay); // C#5
        setTimeout(() => { playTone(context, 659.25, duration_1); }, delay * 2); // E5
        setTimeout(() => { playTone(context, 880, duration_2); }, delay * 3); // A5
    } else {
        // Three descending tones starting with A4 and descending two whole steps (A4, G4, F4)
        setTimeout(() => { playTone(context, 440, duration_1); }, 0); // A4
        setTimeout(() => { playTone(context, 392, duration_1); }, delay); // G4
        setTimeout(() => { playTone(context, 369.99, duration_2, true); }, delay * 2); // F4#
    }
});

    wordButtonsContainer.appendChild(checkAnswersButton);
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
        utteranceWord.pitch = 1.5; // Increase the pitch

        // Create a SpeechSynthesisUtterance object for the sentence
        const utteranceSentence = new SpeechSynthesisUtterance();
        utteranceSentence.text = sentence;
        utteranceSentence.lang = 'en-US';
        utteranceSentence.rate = 0.8; // Slow down the rate of speech for the sentence
        utteranceSentence.pitch = 1.5; // Increase the pitch

        // Get the list of voices
        let voices = window.speechSynthesis.getVoices();

        // Filter for American English voices
        const usVoices = voices.filter(voice => voice.lang === 'en-US');

        // Use the first available American English voice
        if (usVoices.length > 0) {
            utteranceWord.voice = usVoices[0];
            utteranceSentence.voice = usVoices[0];
        }

        // Speak the word
        speechSynthesis.speak(utteranceWord);

        // When the word has finished being spoken, speak the sentence
        utteranceWord.onend = function() {
            speechSynthesis.speak(utteranceSentence);
        };
    } else {
        console.error('SpeechSynthesis API not supported in this browser.');
    }
}