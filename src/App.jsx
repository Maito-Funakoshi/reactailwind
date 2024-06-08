import React, { useState } from 'react';
import ChatBox from './ChatBox';
import MessageInput from './MessageInput';
import Header from './Header';
import AssistantResponses from './AssistantResponses'
import './App.css';

function App() {
  //初期設定
  const names = ["A", "B", "C"];
  const characters = ["INFJ", "ESTJ", "ENTP"];
  const [messages, setMessages] = useState([
    { role: "system", content: `あなたたちはユーザの発言を起点にして互いに議論を交わす${names.length}人のアシスタントで、名前は${names[0]}、${names[1]}、${names[2]}です。それぞれの人物は一回の発言で120文字まで話すことができます。`}
  ]);
  const [error, setError] = useState(null);

  //HTML部分
  return (
    <div className="App">
      <header className="App-header">
        <Header messages = {messages} />
        <AssistantResponses messages = {messages} setMessages = {setMessages} characters = {characters} names = {names} setError = {setError} />
        <ChatBox messages = {messages} error = {error} />
        <MessageInput setMessages = {setMessages} />
      </header>
    </div>
  );
}

export default App;