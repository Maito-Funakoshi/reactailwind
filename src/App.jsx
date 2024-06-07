import React, { useState, useEffect } from 'react';
import ChatBox from './ChatBox';
import MessageInput from './MessageInput';
import DownloadLogButton from './DownloadLogButton';
import './App.css';
import { OpenAIClient, AzureKeyCredential } from "@azure/openai";

function App() {
  //AzureOpenAIの設定
  const endpoint = `https://opendialogue1.openai.azure.com/`;
  const azureApiKey = `e1a905c26e7d418bb8ce8f95518c9f45`;
  const deploymentId = "gpt35turbo";

  //初期設定
  const assistants = ["INFJ", "ESTJ", "ENTP"];
  const [messages, setMessages] = useState([
    { role: "system", content: `あなたたちはユーザの発言を起点にして互いに議論を交わす${assistants.length}人のアシスタントで、名前は${assistants[0]}、${assistants[1]}、${assistants[2]}です。それぞれの人物は一回の発言で120文字まで話すことができます。`}
  ]);
  const [input, setInput] = useState('');
  const [error, setError] = useState(null);

  //返答作成部分
  useEffect(() => {
    if (messages.length > 1 && messages[messages.length - 1].role === "user") {
      const fetchData = async () => {
        for (let i = 0; i < assistants.length; i++) {
          try {
            const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));
            const assistant = assistants[i];
            const response = await client.getChatCompletions(deploymentId, [
              ...messages,
              { role: "system", content: `あなたの名前は${assistant}で、MBTI診断で${assistant}と診断されるパーソナリティを持ちます。他の${assistants.length - 1}人の人物もそれぞれの名前とMBTI特性を持っており、互いに認識しています。${assistant}として回答してください。` }
            ], { maxTokens: 256 });

            if (response.choices && response.choices.length > 0) {
              const botMessage = response.choices[0].message.content.trim();
              setMessages(prevMessages => [...prevMessages, { role: "assistant", content: botMessage, assistant }]);
            }

          } catch (err) {
            setError(err);
            console.error("The sample encountered an error:", err);
          }
        }
      }
      fetchData();
    }
  }, [messages]); // messagesが更新されるたびに実行

  //会話ログ取得
  const handleGetLog = () => {
    const log = messages.slice(1).map((msg) => `${msg.role === "assistant" ? `${msg.assistant}: ` : ''}${msg.role === "user" ? 'あなた: ' : ''}${msg.content}`).join('\n');
    downloadLogFile(log);
  };

  //会話ログをelement.downloadファイルとしてダウンロード
  const downloadLogFile = (log) => {
    const element = document.createElement("a");
    const file = new Blob([log], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "conversation_log.txt";
    document.body.appendChild(element); // Firefoxでは必要
    element.click();
  };

  //HTML部分
  return (
    <div className="App">
      <header className="App-header">
        <h1>Self Disclosure Chatbot</h1>
        <ChatBox messages = {messages} />
        {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
        <MessageInput input = {input} setInput = {setInput} setMessages = {setMessage} />
        <DownloadLogButton handleGetLog = {handleGetLog} />
      </header>
    </div>
  );
}

export default App;
