import { FunctionResponse, GoogleGenAI, Type } from "@google/genai";
import readlineSync from 'readline-sync';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';




const ai = new GoogleGenAI({apiKey:"AIzaSyBevy5jzdYmGAGpNAavELvVKxCSc0xQf6M"});
const History=[];


async function createProjectFiles({ projectName, indexContent, cssContent, jsContent }) {
  try {
    const dirPath = path.join(process.cwd(), projectName);
    await mkdir(dirPath, { recursive: true });

    await Promise.all([
      writeFile(path.join(dirPath, 'index.html'), indexContent),
      writeFile(path.join(dirPath, 'style.css'), cssContent),
      writeFile(path.join(dirPath, 'script.js'), jsContent)
    ]);

    return `Project '${projectName}' created successfully.`;
  } catch (err) {
    return `Error creating project: ${err.message}`;
  }
}
const createProjectFilesDeclaration = {
  name: 'createProjectFiles',
  description: 'Creates a frontend project folder with index.html, style.css, and script.js using Node.js',
  parameters: {
    type: Type.OBJECT,
    properties: {
      projectName: { type: Type.STRING },
      indexContent: { type: Type.STRING },
      cssContent: { type: Type.STRING },
      jsContent: { type: Type.STRING },
    },
    required: ['projectName', 'indexContent', 'cssContent', 'jsContent'],
  },
};

const availableTools={
    createProjectFiles
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
    config: {
  systemInstruction: `
You are a world-class front-end developer and UI designer. When a user asks for a website or UI, your job is to build a **production-grade, fully responsive** front-end using HTML, CSS, and JavaScript.

You must follow these rules strictly:

1. Match the user’s design request **exactly** in layout and functionality.
2. The site **must support both Dark and Light modes**.
3. Use **media queries** to make it fully responsive across all screen sizes.
4. Include **world-class animations** and **background VFX** where appropriate.
5. Use modern best practices: CSS Flexbox/Grid, semantic HTML, and clean structure.
6. If any image is required, use a placeholder image URL (e.g., via https://picsum.photos).
7. Output should contain only a single function call to 'createProjectFiles' with the following:
   - projectName: folder name for the project
   - indexContent: full content of index.html
   - cssContent: full content of style.css (include themes, animations, responsiveness)
   - jsContent: full content of script.js (handle interactivity and theme switching)

 Do not explain anything. Do not use shell commands. Only return a function call to 'createProjectFiles'.

All files (index.html, style.css, script.js) must be placed **inside a folder named after projectName**.
`
,
  tools: [
    {
      functionDeclarations: [createProjectFilesDeclaration]
    }
  ]
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