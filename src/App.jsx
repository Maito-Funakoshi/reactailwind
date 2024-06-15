import React, { useState } from 'react';
import ChatBox from './ChatBox';
import MessageInput from './MessageInput';
import Header from './Header';
import AssistantResponses from './AssistantResponses'
import './App.css';

function App() {
  //初期設定
  const names = ["Ren", "Haruto", "Mio"];
  const characters = ["INFJ", "ESTJ", "ENTP"];
  // const chat = ["あなたはオープンダイアローグに参加して患者の話を聞いて自己開示を促します。あなたは絶対に短く簡潔的に回答し、一回の回答での文量は３文以内に抑えてください。ユーザの発言に対してあなたも自己開示をし、たまに相手と似た感情を表現して対話を続ける意識を持ち、ユーザの発言に対して「なんで〜」「具体的にはどこが〜」など問題の原因を深掘りする質問をし、たまにユーザと同じ表現を使って返答してください。あなたはフレンドリーな口調でユーザの発言に共感して応答し、決して判断や評価を下してはなりません。"];
  const chat = ["あなたは都内大学生が集まるオープンダイアローグの場にいます。" +
    "**返答は必ず50字以内で行ってください。**" +
    "不完全な主語述語や句読点を抜かず、誤字を含むなど文体で人間らしさを見せ、可能な限りフランクに接してください。"　+
    "みんなで支え合って生きていこう、などの抽象的で行動の伴わない発言や綺麗事は話してはいけません。" +
    "ユーザの発言に対しては、傾聴と対話のテクニックを意識し、共感から始めてください。"
  ]
  const reflect = ["あなたはオープンダイアログのリフレクティングをしています。あなたは絶対に短く簡潔的に回答し、一回の回答での文量は３文以内に抑えてください。あなたは他の人と活発的に議論を交わしてください。ユーザの発言に対して思うことやユーザの悩みの解決策を話してください。"];
  const greetingMessage = ["こんにちは！あなたはこのチャットボットをどのように使いたいですか？"]
  const [messages, setMessages] = useState([
    { role: "system", content: `あなたたちはユーザの発言を起点にして互いに議論を交わす${names.length}人のアシスタントで、名前は${names[0]}、${names[1]}、${names[2]}です。それぞれの人物は一回の発言で120文字まで話すことができます。`},
    { role: "assistant", content: `${greetingMessage}`, name: "system", mode: "chat"}
  ]);
  const [inputAble, setInputAble] = useState(true);
  const [error, setError] = useState(null);
  const [recipients, setRecipients] = useState(
    names.reduce((acc, name) => {
      acc[name] = true;
      return acc;
    }, {})
  );

  //HTML部分
  return (
    <div className="App">
      <Header names = {names} messages = {messages} inputAble = {inputAble} setInputAble = {setInputAble} recipients = {recipients} setRecipients = {setRecipients} />
      <AssistantResponses names = {names}　messages = {messages} setMessages = {setMessages} inputAble = {inputAble} characters = {characters} chat = {chat} reflect = {reflect} recipients = {recipients} setError = {setError} />
      <ChatBox names = {names}　messages = {messages} error = {error} />
      <MessageInput setMessages = {setMessages} inputAble = {inputAble} />
    </div>
  );
}

export default App;