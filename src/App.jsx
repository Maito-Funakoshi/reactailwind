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
  const chat = ["あなたはオープンダイアローグに参加して患者の話を聞いて自己開示を促します。あなたは絶対に短く簡潔的に回答し、一回の回答での文量は３文以内に抑えてください。ユーザの発言に対してあなたも自己開示をし、相手と似た感情を表現して対話を続ける意識を持ち、ユーザの発言に対して「なんで〜」「具体的にはどこが〜」など情報の深掘りを促す質問をし、たまにユーザと同じ表現を使って返答してください。あなたはフレンドリーな口調でユーザの発言に共感して応答し、決して判断や評価を下してはなりません。"];
  const reflect = ["あなたはオープンダイアログのリフレクティングをしています。あなたは絶対に短く簡潔的に回答し、一回の回答での文量は３文以内に抑えてください。あなたは他の人と活発的に議論を交わしてください。ユーザの発言に対して思うことやユーザの悩みの解決策を話してください。"];
  const greetingMessage = ["こんにちは！あなたはこのチャットボットをどのように使いたいですか？"]
  const [messages, setMessages] = useState([
    { role: "system", content: `あなたたちはユーザの発言を起点にして互いに議論を交わす${names.length}人のアシスタントで、名前は${names[0]}、${names[1]}、${names[2]}です。それぞれの人物は一回の発言で120文字まで話すことができます。`},
    { role: "assistant", content: `${greetingMessage}`}
  ]);
  const [inputAble, setInputAble] = useState(true);
  const [error, setError] = useState(null);

  //HTML部分
  return (
    <div className="App">
      <Header messages = {messages} inputAble = {inputAble} setInputAble = {setInputAble} />
      <AssistantResponses messages = {messages} setMessages = {setMessages} inputAble = {inputAble} names = {names} characters = {characters} chat = {chat} reflect = {reflect} setError = {setError} />
      <ChatBox messages = {messages} error = {error} />
      <MessageInput setMessages = {setMessages} inputAble = {inputAble} />
    </div>
  );
}

export default App;