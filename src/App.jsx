import React, { useState, useEffect } from 'react';
import './App.css';
import ChatBox from './ChatBox';
import MessageInput from './MessageInput';
import DownloadLogButton from './DownloadLogButton';
// import AssistantResponses from './AssistantResponses';


function App() {
  //初期設定
  const endpoint = `https://opendialogue1.openai.azure.com/`;
  const azureApiKey = `e1a905c26e7d418bb8ce8f95518c9f45`;
  const deploymentId = "gpt35turbo";

  const assistants = ["INFJ", "ESTJ", "ENTP"];
  const [messages, setMessages] = useState([
    { role: "system", content: `あなたたちはユーザの発言を起点にして互いに議論を交わす${assistants.length}人のアシスタントで、名前は${assistants[0]}、${assistants[1]}、${assistants[2]}です。それぞれの人物は一回の発言で120文字まで話すことができます。`}
  ]);
  const [error, setError] = useState(null);

  // <AssistantResponses messages = {messages} setMessages = {setMessages} assistants = {assistants} setError = {setError} />
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
  }, [messages]);

  //HTML部分
  return (
    <div className="App">
      <header className="App-header">
        <h1>Self Disclosure Chatbot</h1>
        <ChatBox messages = {messages} error = {error} />
        <MessageInput setMessages = {setMessages} />
        <DownloadLogButton messages = {messages} />
      </header>
    </div>
  );
}

export default App;
