import { useState, useEffect } from 'react';
import './App.css';
import { OpenAIClient, AzureKeyCredential } from "@azure/openai";

function App() {
  const endpoint = `https://opendialogue1.openai.azure.com/`;
  const azureApiKey = `e1a905c26e7d418bb8ce8f95518c9f45`;
  const deploymentId = "gpt35turbo";

  const [response, setResponse] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));
        const messages = [
          { role: "system", content: "あなたはプログラミングの先生で、ユーザーはあなたの生徒です。質問に対してユーモアを混ぜて回答してください。" },
          { role: "user", content: "JavaとJavaScriptの違いを教えてください。" }
        ];
        
        console.log(`Messages: ${messages.map((m) => m.content).join("\n")}`);
        const events = client.getChatCompletions(deploymentId, messages, { maxTokens: 256 });
        
        let msg = '';
        for await (const event of events) {
          for (const choice of event.choices) {
            const delta = choice.delta?.content;
            if (delta !== undefined) {
              msg += delta;
            }
          }
        }

        setResponse(msg);
      } catch (err) {
        setError(err);
        console.error("The sample encountered an error:", err);
      }
    }

    fetchData();
  }, []); // 空の依存配列は、この効果がコンポーネントのマウント時にのみ実行されることを意味します

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
