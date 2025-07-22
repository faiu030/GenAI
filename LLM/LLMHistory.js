import { GoogleGenAI } from "@google/genai";
import readlineSync from 'readline-sync';

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({apiKey:"your_api_key"});

const chat = ai.chats.create({
    model: "gemini-2.5-flash",
    history:[]
})


async function main() {
  var userProblem = readlineSync.question('Ask your query-->');
const response = await chat.sendMessage({
    message: userProblem,
  });
  console.log(response.text);

  main();
}

main();