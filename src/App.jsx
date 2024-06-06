import React, { useState, useEffect } from 'react';
import './App.css';
import { OpenAIClient, AzureKeyCredential } from "@azure/openai";

function App() {
  const endpoint = `https://opendialogue1.openai.azure.com/`;
  const azureApiKey = `e1a905c26e7d418bb8ce8f95518c9f45`;
  const deploymentId = "gpt35turbo";

  const [messages, setMessages] = useState([
    { role: "system", content: "あなたはプログラミングの先生で、ユーザーはあなたの生徒です。質問に対してユーモアを混ぜて回答してください。" }
  ]);
  const [input, setInput] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (messages.length > 1) { // 初期メッセージを除く
      async function fetchData() {
        try {
          const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));
          const result = await client.getChatCompletions(deploymentId, messages, { maxTokens: 256 });

          if (result.choices && result.choices.length > 0) {
            const botMessage = result.choices[0].message.content;
            setMessages(prevMessages => [...prevMessages, { role: "assistant", content: botMessage }]);
          }
        } catch (err) {
          setError(err);
          console.error("The sample encountered an error:", err);
        }
      }
      fetchData();
    }
  }, [messages]); // messagesが更新されるたびに実行

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setMessages(prevMessages => [...prevMessages, { role: "user", content: input }]);
      setInput('');
    }
  };

  const handleGetLog = () => {
    const log = messages.map((msg) => `${msg.role}: ${msg.content}`).join('\n');
    downloadLogFile(log);
  };

  const downloadLogFile = (log) => {
    const element = document.createElement("a");
    const file = new Blob([log], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "conversation_log.txt";
    document.body.appendChild(element); // Firefoxでは必要
    element.click();
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Self Disclosure Chatbot</h1>
        <div className="chat-box">
          {messages.slice(1).map((msg, index) => (
            <p key={index} className={msg.role}>{msg.content}</p>
          ))}
        </div>
        {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="メッセージを入力してください"
          />
          <button type="submit">送信</button>
        </form>
        <button onClick={handleGetLog}>会話ログをダウンロード</button>
      </header>
    </div>
  );
}

export default App;
