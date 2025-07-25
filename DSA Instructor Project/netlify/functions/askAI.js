// This is your new backend - netlify/functions/askAI.js
exports.handler = async function (event, context) {
    // Get the question from the frontend's request
    const { question } = JSON.parse(event.body);

    // Your secret API key is now stored safely as an environment variable
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

    const requestBody = {
        "contents": [{ "parts": [{ "text": question }] }],
        "systemInstruction": {
            "parts": [{ "text": "You are my DSA instuctor. If i ask any questions other than DSA,reply me rudely." }]
        }
    };

    try {
        const apiResponse = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
        });

        if (!apiResponse.ok) {
            return { statusCode: 500, body: JSON.stringify({ error: 'API request failed' }) };
        }

        const responseData = await apiResponse.json();
        const aiReply = responseData.candidates[0].content.parts[0].text;

        // Send the AI's reply back to the frontend
        return {
            statusCode: 200,
            body: JSON.stringify({ reply: aiReply }),
        };

    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};