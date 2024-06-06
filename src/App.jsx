import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { OpenAIClient, AzureKeyCredential } from "@azure/openai";

function App() {
  // const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const endpoint = `https://opendialogue1.openai.azure.com/`; //エンドポイント
  const azureApiKey = `e1a905c26e7d418bb8ce8f95518c9f45`; //APIキー
  const deploymentId = "gpt35turbo"; //デプロイ名

  async function main(){
      const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));
      const messages = [
          { role: "system", content: "あなたはプログラミングの先生で、ユーザーはあなたの生徒です。質問に対してユーモアを混ぜて回答してください。" },
          { role: "user", content: "JavaとJavaScriptの違いを教えてください。" }
      ];
      
      console.log(`Messages: ${messages.map((m) => m.content).join("\n")}`);
      const events = client.listChatCompletions(deploymentId, messages, { maxTokens: 256 });
      
      let msg = '';
      for await (const event of events) {
          for (const choice of event.choices) {
              const delta = choice.delta?.content;
              if (delta !== undefined) {
                  msg += delta;
                  // console.log(`Chatbot: ${delta}`);
              }
          }
      }

      console.log(msg); //結果を出力
  }

  main().catch((err) => {
    console.error("The sample encountered an error:", err);
  });

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
