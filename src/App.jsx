import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { OpenAIClient, AzureKeyCredential } from "@azure/openai";

function App() {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const client = new OpenAIClient(
          "https://opendialogue1.openai.azure.com/",
          new AzureKeyCredential("e1a905c26e7d418bb8ce8f95518c9f45")
        );

        const { choices } = await client.getCompletions(
          "gpt35turbo",
          ["Hello, world!"]
        );

        if (choices && choices.length > 0) {
          setResponse(choices[0].text);
        }
      } catch (err) {
        setError("The sample encountered an error:", err);
      }
    }

    fetchData();
  }, []); // 空の依存配列は、この効果がコンポーネントのマウント時にのみ実行されることを意味します

  if (error) {
    console.error(error);
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={reactLogo} className="App-logo" alt="logo" />
        <img src={viteLogo} className="App-logo" alt="logo" />
        <p>
          {response ? response : "Loading..."}
        </p>
        {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
      </header>
    </div>
  );
}

export default App;
