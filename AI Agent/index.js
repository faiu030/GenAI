import { FunctionResponse, GoogleGenAI, Type } from "@google/genai";
import { availableMemory } from "process";
import readlineSync from 'readline-sync';


const ai = new GoogleGenAI({apiKey:"AIzaSyBevy5jzdYmGAGpNAavELvVKxCSc0xQf6M"});
const History=[];
function sum({num1,num2})
{
    return num1+num2;
}
const sumDeclaration = {
  name: 'sum',
  description: 'Gets the sum of two numbers.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      num1: {
        type: Type.NUMBER,
        description: 'This is the first integer num1',
      },
      num2: {
        type: Type.NUMBER,
        description: 'This is the second integer num1',
      },
    },
    required: ['num1','num2'],
  },
};
function isPrime({num})
{
    if(num<2) return false;
    for(let i=2;i*i<=num;i++)
    {
        if(num%i==0) return false;
    }
    return true;
}
const isPrimeDeclaration = {
  name: 'isPrime',
  description: 'Tells you the given number is prime or not',
  parameters: {
    type: Type.OBJECT,
    properties: {
      num: {
        type: Type.NUMBER,
        description: 'This is the number to checked is prime or not',
      },
      
    },
    required: ['num'],
  },
};

async function getCryptoPrice({coin})
{
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd`;
  const response = await fetch(url);
  const data = await response.json();
  if (!data[coin] || !data[coin].usd) {
    return `Sorry, I couldn't find the price for ${coin}.`;
  }
  return `The current price of ${coin} is $${data[coin].usd}`;
}
const getCryptoPriceDeclaration = {
  name: 'getCryptoPrice',
  description: 'Tells you the current price of the crypto coin',
  parameters: {
    type: Type.OBJECT,
    properties: {
      coin: {
        type: Type.STRING,
        description: 'This is the coin . ex :bitcoin',
      },
      
    },
    required: ['coin'],
  },
};

const availableTools={
    sum:sum,
    isPrime:isPrime,
    getCryptoPrice:getCryptoPrice
}
async function runAgent(userProblem)
{
    History.push({
    role:"user",
    parts:[{text:userProblem}]
  })
while(true)
{
const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: History,
    config:
    {
        tools: [{
            functionDeclarations: [sumDeclaration,isPrimeDeclaration,getCryptoPriceDeclaration]
        }],
    }
  });

  if(response.functionCalls && response.functionCalls.length>0)
  {


    const {name,args}= response.functionCalls[0];
    const functionCall = availableTools[name];
    console.log(functionCall);
    const functionCallResponse = await (functionCall(args)); 

    const function_response_part = {
        name: name,
        response: { functionCallResponse }
    }
    History.push(
        {
            role:'model',
            parts:[{
                functionCall:response.functionCalls[0]
            }]
        }
    )

History.push(
        {
            role:'user',
            parts:[{
                functionResponse:function_response_part
            }]
        }
    )


  }
  else
  {
    History.push({
    role:"model",
    parts:[{text:response.text}]
    })
    console.log(response.text);
    break;
  }
}

  
}


async function main()
{
    var userProblem = readlineSync.question('Ask your query-->');
    await runAgent(userProblem);
    main();
}
main();