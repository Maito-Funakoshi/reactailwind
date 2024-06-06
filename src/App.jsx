import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { OpenAIClient, AzureKeyCredential } from "@azure/openai"

function App() {
  const [count, setCount] = useState(0)

  async function main(){
    const client = new OpenAIClient(
    "https://opendialogue1.openai.azure.com/",
    new AzureKeyCredential("e1a905c26e7d418bb8ce8f95518c9f45"));
  
    const { choices } = await client.getCompletions(
      "gpt35turbo", // assumes a matching model deployment or model name
      ["Hello, world!"]);
  
    for (const choice of choices) {
      console.log(choice.text);
    }
  }
  
  main().catch((err) => {
    console.error("The sample encountered an error:", err);
  });

  return (
    <>
      {/* <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p> */}
      
    </>
  )
}

export default App
