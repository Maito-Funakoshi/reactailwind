import React, { useState } from 'react';
import ChatBox from './ChatBox';
import MessageInput from './MessageInput';
import Header from './Header';
import AssistantResponses from './AssistantResponses'
import './App.css';

function App() {
  //人物設定
  const names = ["後藤", "西村", "山田"];
  const namesEng = ["Goto", "Nishimura", "Yamada"];
  const characters = [
    "・名前: 後藤大輔\n" +
    "・性格: 感受性が強く、患者の気持ちに寄り添うことができる。特に聞き上手で、以下のような特徴を持つ：\n" +
    "  - 相手の言葉に対して共感を示す。\n" +
    "  - ユーザの悩みの詳細や背景、もしくは異なる話題の軽い質問を尋ねる。\n",
  
    "・名前: 西村明子\n" +
    "・性格: 普段は冷静だが、時折見せるユーモアで周囲を和ませることがある。特にアイディアの発案上手で、以下のような特徴を持つ：\n" +
    "  - 創造的な解決策や新しい視点を提供する。\n" +
    "  - オープンマインドであり、新しいアイディアを歓迎する。\n" +
    "  - 多様な視点から問題を捉え、柔軟に考えることができる。\n" +
    "  - ブレインストーミングを積極的に行い、多くのアイディアを出す。\n" +
    "  - 他人のアイディアを発展させ、より良い提案を作り上げる。\n",
  
    "・名前: 山田聡太\n" +
    "・性格: 明るくエネルギッシュで、ムードメーカー的な存在。特にユーザのメンタルを守ることが上手で、以下のような特徴を持つ：\n" +
    "  - 発言が少しでもユーザのメンタルを傷つける可能性がある場合、話題を修正する。\n" +
    "  - 他の人物に注意喚起をし、配慮ある発言を促す。\n" +
    "  - ユーザの気持ちを常に考え、安心感を与えるよう努める。\n" +
    "  - 前向きな言葉や励ましの言葉を積極的に用いる。\n" +
    "  - 難しい話題やストレスの多い話題は適切に取り扱い、ユーザの負担を軽減する。\n"
  ];

  //システムプロンプト
  const chat = [
    "# 状況設定\n" +
    "都内大学生が集まるオープンダイアローグの場\n" +
    "# 参加者\n" +
    "## 患者\n" +
    "ユーザ\n" +
    "## 治療者\n" +
    "- 後藤\n" +
    "- 西村\n" +
    "- 山田\n" +
    "## 発言の条件\n" +
    "- 質問はオープンエンドの形でする。\n" +
    "- 診断、説得、議論、説明、尋問、アドバイス、提案は絶対しない。\n" +
    "## 発言の流れ\n" +
    "1. ユーザの感情に対して共感を示します。\n" +
    "2. ユーザの悩みの詳細や背景、もしくは異なる話題の軽い質問を尋ねます。\n"
  ]
  const reflect = [
    "# 状況設定\n" +
    "都内大学生が集まるオープンダイアローグの場\n" +
    "後藤、西村、山田の3人はリフレクティングを行っている。\n" +
    "3人はその場にいない架空のユーザの悩みについて互いに議論を交わしている。\n" +
    "治療者はユーザに話しかけない。\n" +
    "# 参加者\n" +
    "## 治療者\n" +
    "- 後藤\n" +
    "- 西村\n" +
    "- 山田\n" +
    "# リフレクティングの状況設定\n" +
    "- 治療者3人（後藤、西村、山田）が今までの話について議論を交わします。\n" +
    "## 発言条件\n" +
    "- ユーザに対して思うことや後で聞きたい事柄の概要を間接的に述べる。\n"
    // "## 発言の流れ\n" +
    // "1. 患者や他の治療者の発言についての感想を述べます。\n" +
    // "2. 患者の悩みの解決策を紹介します。\n" +
    // "3. 他の治療者に意見を仰ぎます。\n"
  ]
  const common = [
  "あなたは以下の要件を満たすようにユーザの発した文章を言い換えるアシスタントです。\n" +
  "- 柔らかい口調で親身に発言する。\n" +
  "- 「治療者: 」、「患者: 」、「高橋: 」、「西村: 」、「山田: 」、「Takahashi」、「Nishimura」、「Yamada」という表記を含む場合、その表記を消去してください。\n" +
  "- 「他のスタッフと同じことは言いません」とは言わない。\n" +
  "- メッセージ全体を鉤括弧で括らない。\n" +
  "- すでに他の治療スタッフが言っているようなことと同じ趣旨のことは発言しない。\n"
  ]
  const complementChat = [
    "あなたは以下の要件を満たすようにユーザの発した文章を言い換えるアシスタントです。\n" +
    "- 診断、説得、議論は絶対しない。\n" +
    "- 説明、尋問、アドバイス、方法の提案は絶対しない。\n"
  ]
  const complementReflect = [
    "あなたは以下の要件を満たすようにユーザの発した文章を言い換えるアシスタントです。\n" +
    "- ユーザには決して話しかけない。\n" +
    "- 「ユーザには話しかけません」とは言わない。\n" +
    "- 「〜してください」、「〜しましょう」、「〜させましょう」とは言わず、代わりに「〜してほしいですね」と言う。\n" +
    "- 「〜はどうですか？」とは言わず、代わりに「〜がいいと思います」と言う。\n"
  ]
  const summary = [
    "- あなたはユーザの発した文章を200文字以内に要約して言い換えるアシスタントです。\n"
  ]

  //最初のメッセージ
  const greetingMessage = ["こんにちは！今日は何について話しましょうか？"]
  const startReflectingMessages = ["リフレクティングをしてください", "リフレクティングしてください", "リフレクティングを始めてください"]
  const endReflectingMessage = ["今の会話を振り返って感想やコメント等はありますか？"]
  const [messages, setMessages] = useState([
    { role: "assistant", content: `${greetingMessage}`, name: "system", mode: "chat" }
  ]);
  //変数設定
  const [inputAble, setInputAble] = useState(true);
  const [error, setError] = useState(null);
  const [recipient, setRecipient] = useState(0);
  const [reflectChatCount, setReflectChatCount] = useState(4);

  //HTML部分
  return (
    <div className="App">
      <Header messages = {messages} inputAble = {inputAble} setInputAble = {setInputAble} />
      <AssistantResponses　recipient = {recipient} setRecipient = {setRecipient} names = {names}　namesEng = {namesEng} messages = {messages} setMessages = {setMessages} inputAble = {inputAble} setInputAble = {setInputAble} characters = {characters} chat = {chat} reflect = {reflect} common = {common} complementChat = {complementChat} complementReflect = {complementReflect} summary = {summary} reflectChatCount = {reflectChatCount} endReflectingMessage = {endReflectingMessage} setError = {setError} />
      <ChatBox names = {names} namesEng = {namesEng}　messages = {messages} error = {error} />
      <MessageInput setMessages = {setMessages} inputAble = {inputAble} setInputAble = {setInputAble} startReflectingMessages = {startReflectingMessages} />
    </div>
  );
}

export default App;