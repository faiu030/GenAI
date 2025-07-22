import { GoogleGenAI } from "@google/genai";
import readlineSync from 'readline-sync';

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({apiKey:"your_api_key"});


const History=[];
async function chatting(userProblem)
{
    History.push({
    role:"user",
    parts:[{text:userProblem}]
  })
const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: History
  });
  console.log(response.text);

  History.push({
    role:"model",
    parts:[{text:response.text}]
  })
}

async function main() {
  var userProblem = readlineSync.question('Ask your query-->');
  await chatting(userProblem);

  main();
}

main();