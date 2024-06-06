import { useState, useEffect } from 'react';
import './App.css';
import OpenAI from "openai";

function App() {
  const resource = 'opendialogue1';
  const model = 'gpt35turbo'; // デプロイした名前

  const apiVersion = '2023-02-01';
  const apiKey = `e1a905c26e7d418bb8ce8f95518c9f45`;

  // Azure OpenAI requires a custom baseURL, api-version query param, and api-key header.
  const openai = new OpenAI({
    apiKey,
    baseURL: `https://${resource}.openai.azure.com/openai/deployments/${model}`,
    defaultQuery: { 'api-version': apiVersion },
    defaultHeaders: { 'api-key': apiKey },
  });

  const [response, setResponse] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const completion = await openai.chat.completions.create({
          messages: [{ role: 'user', content: 'あなたの名前は?' }],
          model: model,
        });
        
        setResponse(completion.choices[0].message.content);
      } catch (err) {
        setError(err);
        console.error(err);
      }
    }

    fetchData();
  }, []); // 空の依存配列で初回マウント時のみ実行

  return (
    <div className="App">
      <header className="App-header">
        <h1>Chatbot Response</h1>
        {response ? <p>{response}</p> : <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
      </header>
    </div>
  );
}

export default App;
