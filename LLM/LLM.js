import { GoogleGenAI } from "@google/genai";
import readlineSync from 'readline-sync';

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({apiKey:"your_api_key"});

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
        {
            role:"user",
            parts:[{text:"Hi iam fayaz"}]
        },
        {
            role:"model",
            parts:[{text:"Hello Fayaz"}]
        },
        {
            role:"user",
            parts:[{text:"what is my name"}]
        }
    ],
  });
  console.log(response.text);
}

main();