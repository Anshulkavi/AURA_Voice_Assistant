document.addEventListener('DOMContentLoaded', () => {
    const messagesContainer = document.getElementById('messages');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const voiceBtn = document.getElementById('voice-btn');

    function addMessage(text, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', `${sender}-message`);
        messageElement.textContent = text;
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    async function getAuraResponse(userMessage) {
        console.log("Sending request to backend with message:", userMessage);
        try {
            const response = await fetch('/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ input: userMessage }),
            });
            
            const data = await response.json();
            console.log("Received response from backend:", data);

            if (response.ok) {
                return data.response;
            } else {
                console.error("Error response from backend:", data);
                return 'Something went wrong.';
            }
        } catch (error) {
            console.error('Error:', error);
            return 'Something went wrong.';
        }
    }

    function speak(text) {
        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = 'en-US'; // Set language
        window.speechSynthesis.speak(speech);
    }

    async function handleUserInput() {
        const userMessage = userInput.value.trim();
        if (userMessage) {
            addMessage(userMessage, 'user');
            userInput.value = '';

            const auraResponse = await getAuraResponse(userMessage);
            addMessage(auraResponse, 'bot');
            speak(auraResponse); // Speak the response
        }
    }

    // Voice input functionality
    function startVoiceRecognition() {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.interimResults = false; // Don't show interim results
        recognition.lang = 'en-US'; // Set the language

        recognition.onstart = () => {
            console.log('Voice recognition started. Speak into the microphone.');
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            console.log('Voice input:', transcript);
            userInput.value = transcript; // Set the input to the recognized text
            handleUserInput(); // Call the function to send the input
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            addMessage('Could not understand the speech. Please try again.', 'bot');
        };

        recognition.onend = () => {
            console.log('Voice recognition ended.');
        };

        recognition.start(); // Start listening for voice input
    }

    sendBtn.addEventListener('click', handleUserInput);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleUserInput();
        }
    });

    voiceBtn.addEventListener('click', startVoiceRecognition); // Call voice recognition on button click

    // Initial greeting
    addMessage("Hello! I'm AURA+. How can I assist you today?", 'bot');
});
