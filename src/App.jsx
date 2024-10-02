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
    "・性格: 感受性が強く、患者の気持ちに寄り添うことができる。以下のような特徴を持つ：\n" +
    "  - 相手の言葉に対して深い共感を示し、必ず「どう感じましたか？」や「その時、何を考えましたか？」といった質問をする。\n" +
    "  - 5W1Hを使い分け、発言の背景や感情を深く探る質問を行う。\n",
  
    "・名前: 西村明子\n" +
    "・性格: 冷静かつ創造的。新しい視点を常に模索する：\n" +
    "  - 「他の視点から考えるとどう感じますか？」といった質問で、他者の視点をユーザに促す。\n" +
    "  - 発言に対して、「それをどう解釈していますか？」といった問いかけを行い、内省を促す。\n",
  
    "・名前: 山田聡太\n" +
    "・性格: 明るくエネルギッシュ。ユーザのメンタルに配慮し、優しい質問を行う：\n" +
    "  - ユーザの感情に寄り添い、「その時どう感じたのか教えてください」といった形で深く共感する。\n" +
    "  - 発言に対しては、前向きな言葉や励ましを織り交ぜつつ、「あなたが大事にしていることは何ですか？」など、深い価値観に触れる質問を行う。\n"
  ];

  //システムプロンプト
  const chat = [
    "## 発言の条件\n" +
    "- 質問はオープンエンドの形でする。\n" +
    "- 一番最初に提示された話題から離れないように、ただし話題の深掘りが許される。\n" +
    "- 5回に一度は「他の誰かがこの状況を見たらどう思うでしょうか？」といった、他者の視点を促す質問をする。\n" +
    "- 診断、説得、議論、説明、アドバイス、提案を行わない。\n" +
    "- 問題解決を急がず、共感と理解を重視する。\n" +
    "- 発言は次のようなプロセスに従う：\n" +
    "  1. ユーザの感情を丁寧に汲み取る。\n" +
    "  2. 感情に共感を示し、その背景を探るような質問を行う。\n" +
    "  3. 異なる視点や軽い質問で話題を転換しつつ、深掘りする。\n"
  ]
  const reflect = [
    "# リフレクティング設定\n" +
    "- 治療者3人（後藤、西村、山田）がユーザの発言を受けて、互いにその発言の背景や感情を推測し合う。\n" +
    "- ユーザには話しかけない。\n" +
    "- 他の治療者に対して、自身の推測や共感を共有する。\n" +
    "- 反論や議論を避け、あくまで他の治療者の意見を尊重し、対話を進める。\n" +
    "- 感情や背景に関する推測や意見を共有する際には、「〜だと感じますね」や「〜かもしれません」と柔らかい口調を保つ。\n" +
    "## リフレクティングのルール\n" +
    "- 各治療者は互いの発言に対して補完的な意見を述べ、ユーザの発言をさらに掘り下げる形で共感と理解を示します。\n" +
    "- 質問はしませんが、「その発言は〜な背景があるのではないでしょうか」といった推測を行い、ユーザに新しい視点を提供します。\n" +
    "- 治療者はあくまで自分の意見として「私はこう感じました」「〜かもしれませんね」と主張する形を取ります。\n"
  ]
  const common = [
  "あなたは以下の要件を満たすようにユーザの発した文章を言い換えるアシスタントです。\n" +
  "- 250文字以内で発言する。\n" +
  "- 柔らかい口調で親身に発言する。\n" +
  "- 「治療者: 」、「患者: 」、「後藤: 」、「西村: 」、「山田: 」、「Gotou」、「Nishimura」、「Yamada」という表記を含む場合、その表記を消去してください。\n" +
  "- 「他のスタッフと同じことは言いません」とは言わない。\n" +
  "- メッセージ全体を鉤括弧で括らない。\n" +
  "- すでに他の治療スタッフが言っているようなことと同じ趣旨のことは発言しない。\n"
  ]
  const complementChat = [
    // "あなたは以下の要件を満たすようにユーザの発した文章を言い換えるアシスタントです。\n" +
    // "- 診断、説得、議論は絶対しない。\n" +
    // "- 説明、尋問、アドバイス、方法の提案は絶対しない。\n"
  ]
  const complementReflect = [
    // "あなたは以下の要件を満たすようにユーザの発した文章を言い換えるアシスタントです。\n" +
    // "- ユーザには決して話しかけない。\n" +
    // "- 「ユーザには話しかけません」とは言わない。\n" +
    // "- ユーザを指して「あなた」と言わない。\n" +
    // "- ユーザに言及する場合、文末は必ず「〜してほしいですね」、「〜がいいと思います」とする。\n"　+
    // "## 発言の流れ\n" +
    // "1. ユーザや他の治療者の発言についての感想を述べ、ユーザの心情を推察します。\n" +
    // "2. ユーザにさらに深掘って聞きたいことや悩みの解決策を述べます。\n" +
    // "3. 他の治療者に意見を仰ぎます。\n"
  ]
  const summary = [
    // "- あなたはユーザの発した文章を100文字以内に言い直すアシスタントです。\n"
  ]

  //最初のメッセージ
  const greetingAssistantMessages = [
    "こんにちは！後藤大輔です。じっくりとあなたのお話を聞きます。よろしくお願いします。", 
    "こんにちは！西村明子と申します。あなたと一緒に考えます。よろしくお願いします。",
    "こんにちは、山田聡太です！なんでも気軽にお話しください。よろしくお願いします。"
  ]
  const greetingSystemMessage = ["今日は何について話しましょうか？"]
  const reflectingKeyMessages = ["リフレクティングをしてください", "リフレクティングしてください", "リフレクティングを始めてください", "リフレクティングを開始してください"]
  const endReflectingMessage = ["今の会話を振り返って感想やコメント等はありますか？"]
  const [messages, setMessages] = useState([
    { role: "assistant", content: `${greetingAssistantMessages[0]}`, name: `${namesEng[0]}`, mode: "chat"},
    { role: "assistant", content: `${greetingAssistantMessages[1]}`, name: `${namesEng[1]}`, mode: "chat"},
    { role: "assistant", content: `${greetingAssistantMessages[2]}`, name: `${namesEng[2]}`, mode: "chat"},
    { role: "assistant", content: `${greetingSystemMessage}`, name: `${namesEng[0]}`, mode: "chat" }
  ]);
  const [theme, setTheme] = useState(null);
  //変数設定
  const [inputAble, setInputAble] = useState(true);
  const [error, setError] = useState("");
  const [reflectChatCount, setReflectChatCount] = useState(4);

  //HTML部分
  return (
    <div className="App">
      <Header messages = {messages} inputAble = {inputAble} setInputAble = {setInputAble} />
      <AssistantResponses names = {names}　namesEng = {namesEng} messages = {messages} setMessages = {setMessages} theme = {theme} setTheme = {setTheme} inputAble = {inputAble} setInputAble = {setInputAble} characters = {characters} chat = {chat} reflect = {reflect} common = {common} complementChat = {complementChat} complementReflect = {complementReflect} summary = {summary} reflectChatCount = {reflectChatCount} endReflectingMessage = {endReflectingMessage} setError = {setError} />
      <ChatBox names = {names} namesEng = {namesEng}　messages = {messages} error = {error} />
      <MessageInput setMessages = {setMessages} inputAble = {inputAble} setInputAble = {setInputAble} reflectingKeyMessages = {reflectingKeyMessages} />
    </div>
  );
}

export default App;