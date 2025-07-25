const dsaForm = document.getElementById('dsa-form');
const questionInput = document.getElementById('question-input');
const responseOutput = document.getElementById('response-output');
const submitButton = document.getElementById('submit-button');

dsaForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const question = questionInput.value.trim();
    if (!question) return;

    submitButton.disabled = true;
    submitButton.textContent = 'Thinking...';
    responseOutput.textContent = 'Contacting the AI...';

    try {
        // This is the new, secure way. We call our own backend function.
        const response = await fetch('/.netlify/functions/askAI', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: question }),
        });

        if (!response.ok) {
            throw new Error('The server function failed to respond.');
        }

        const data = await response.json();
        responseOutput.textContent = data.reply;

    } catch (error) {
        responseOutput.textContent = `Error: ${error.message}`;
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Ask AI';
    }
});