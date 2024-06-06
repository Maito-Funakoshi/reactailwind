import React, { useState, useEffect } from 'react';
import './App.css';
import { OpenAIClient, AzureKeyCredential } from "@azure/openai";

function App() {
  const endpoint = `https://opendialogue1.openai.azure.com/`;
  const azureApiKey = `e1a905c26e7d418bb8ce8f95518c9f45`;
  const deploymentId = "gpt35turbo";

  const [messages, setMessages] = useState([
    { role: "system", content: "あなたたちはユーザの発言を起点にして互いに議論を交わす4人のアシスタントで、名前はINFJ、ENTP、ISFP、ESTJです。それぞれの人物は一回の発言で120文字まで話すことができます。" }
  ]);
  const [input, setInput] = useState('');
  const [error, setError] = useState(null);

  const assistants = ["INFJ", "ENTP", "ISFP", "ESTJ"];

  const delay = ms => new Promise(res => setTimeout(res, ms));

  useEffect(() => {
    if (messages.length > 1 && messages[messages.length - 1].role === "user") { // ユーザーのメッセージが追加されたとき
      const fetchData = async () => {
        for (let i = 0; i < assistants.length; i++) {
          try {
            const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));
            const assistant = assistants[i];
            const response = await client.getChatCompletions(deploymentId, [
              ...messages,
              { role: "system", content: `あなたの名前は${assistant}で、MBTI診断で${assistant}と診断されるパーソナリティを持ちます。他の3人の人物もそれぞれの名前とMBTI特性を持っており、互いに認識しています。` }
            ], { maxTokens: 256 });

            if (response.choices && response.choices.length > 0) {
              const botMessage = response.choices[0].message.content.trim();
              setMessages(prevMessages => [...prevMessages, { role: "assistant", content: botMessage, assistant }]);
            }

            // 各アシスタントの間に待機時間を追加
            await delay(10000); // 10秒の待機時間
          } catch (err) {
            setError(err);
            console.error("The sample encountered an error:", err);
          }
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
    const log = messages.slice(1).map((msg) => `${msg.role === "assistant" ? `${msg.assistant}: ` : ''}${msg.role === "user" ? 'あなた: ' : ''}${msg.content}`).join('\n');
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
            <p key={index} className={msg.role}>{msg.role === "assistant" ? `${msg.assistant}: ${msg.content}` : msg.content}</p>
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
