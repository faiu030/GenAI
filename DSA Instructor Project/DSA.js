// Add your GoogleGenAI import if you are using a module bundler.
// For this single-file example, you'd typically include the library via a <script> tag from a CDN.
// Since that is not provided by default, we will simulate the API call.

const dsaForm = document.getElementById('dsa-form');
const questionInput = document.getElementById('question-input');
const responseOutput = document.getElementById('response-output');
const submitButton = document.getElementById('submit-button');

// --- Configuration ---
// WARNING: Do not expose your API key in client-side code in a real application.
// This is for demonstration purposes only.
const GEMINI_API_KEY = "AIzaSyA1xHUwuz8PVW9ct9enhkdwynXTVAbtaHU"; // Your API key
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

dsaForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const question = questionInput.value.trim();

    if (!question) {
        responseOutput.textContent = 'Please enter a question.';
        return;
    }

    // Disable button and show loading state
    submitButton.disabled = true;
    submitButton.textContent = 'Thinking...';
    responseOutput.textContent = 'Please wait while I process your question...';

    try {
        // This is the structure for the cURL/fetch command
        const requestBody = {
            "contents": [{
                "parts": [{
                    "text": question
                }]
            }],
            "systemInstruction": {
                "parts": [{
                    "text": "You are my DSA instuctor. If i ask any questions other than DSA,reply me rudely."
                }]
            }
        };

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            throw new Error(`API error! Status: ${response.status}`);
        }

        const responseData = await response.json();
        const aiResponse = responseData.candidates[0].content.parts[0].text;
        
        responseOutput.textContent = aiResponse;

    } catch (error) {
        console.error("Error fetching AI response:", error);
        responseOutput.textContent = 'Sorry, something went wrong. Please check your API key and network connection.';
    } finally {
        // Re-enable the button
        submitButton.disabled = false;
        submitButton.textContent = 'Ask AI';
    }
});