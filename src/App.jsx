import React, { useState } from 'react';
import ChatBox from './ChatBox';
import MessageInput from './MessageInput';
import DownloadLogButton from './DownloadLogButton';
import AssistantResponses from './AssistantResponses'
import './App.css';

function App() {
  //初期設定
  const assistants = ["INFJ", "ESTJ", "ENTP"];
  const [messages, setMessages] = useState([
    { role: "system", content: `あなたたちはユーザの発言を起点にして互いに議論を交わす${assistants.length}人のアシスタントで、名前は${assistants[0]}、${assistants[1]}、${assistants[2]}です。それぞれの人物は一回の発言で120文字まで話すことができます。`}
  ]);
  const [error, setError] = useState(null);

  //HTML部分
  return (
    <div className="App">
      <header className="App-header">
        <h1>Self Disclosure Chatbot</h1>
        <AssistantResponses messages = {messages} setMessages = {setMessages} assistants = {assistants} setError = {setError} />
        <ChatBox messages = {messages} error = {error} />
        <MessageInput setMessages = {setMessages} />
        <DownloadLogButton messages = {messages} />
      </header>
    </div>
  );
}

export default App;