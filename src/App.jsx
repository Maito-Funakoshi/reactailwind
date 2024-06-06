import { useState, useEffect } from 'react';
import './App.css';
import OpenAI from "openai";

function App() {
  const resource = 'opendialogue1';
  const model = 'gpt35turbo'; //デプロイした名前

  const apiVersion = '2024-02-01';
  const apiKey = `e1a905c26e7d418bb8ce8f95518c9f45`;

  // Azure OpenAI requires a custom baseURL, api-version query param, and api-key header.
  const openai = new OpenAI({
    apiKey,
    baseURL: `https://${resource}.openai.azure.com/openai/deployments/${model}`,
    defaultQuery: { 'api-version': apiVersion },
    defaultHeaders: { 'api-key': apiKey },
  });

  async function main() {
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: 'あなたの名前は?' }],
      model: model,
    });
    
    console.log(completion.choices[0].message.content);
  }
    

  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });

  return (
    <div className="App">
      <header className="App-header">
      </header>
    </div>
  );
}

export default App;
