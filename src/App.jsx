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
  const common = ["あなたはオープンダイアローグに参加して患者の話を聞いて自己開示を促します。ユーザの発言に対してあなたも自己開示をし、相手と似た経験や感情を表現して対話を続ける意識を持って返答してください。あなたはフレンドリーな口調でユーザの発言に共感して応答し、決して判断や評価を下してはなりません。あなたは一回の発言につき120文字まで話すことができます。"];
  const greetingMessages = ["こんにちは！あなたはこのチャットボットをどのように使いたいですか？"]
  const [messages, setMessages] = useState([
    { role: "system", content: `あなたたちはユーザの発言を起点にして互いに議論を交わす${names.length}人のアシスタントで、名前は${names[0]}、${names[1]}、${names[2]}です。それぞれの人物は一回の発言で120文字まで話すことができます。`},
    { role: "system", content: `${greetingMessages}`}
  ]);
  const [inputAble, setInputAble] = useState(true);
  const [error, setError] = useState(null);

  //HTML部分
  return (
    <div className="App">
      <Header messages = {messages} inputAble = {inputAble} setInputAble = {setInputAble} />
      <AssistantResponses messages = {messages} setMessages = {setMessages} inputAble = {inputAble} names = {names} characters = {characters} common = {common} setError = {setError} />
      <ChatBox messages = {messages} error = {error} />
      <MessageInput setMessages = {setMessages} inputAble = {inputAble} />
    </div>
  );
}

export default App;