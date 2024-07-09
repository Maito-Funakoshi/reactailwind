import React, { useState } from 'react';
import sendIcon from "../images/sendIcon.png"

const MessageInput = ({ setMessages, inputAble, setInputAble, reflectingKeyMessages }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setMessages(prevMessages => [...prevMessages, { role: "user", content: input, name:"You", mode:"chat" }]);
      if (reflectingKeyMessages.some(message => input.includes(message))) {
        setInputAble(!inputAble);
      }
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        disabled={!inputAble}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={inputAble ? "メッセージを入力してください" : "リフレクティング中..."}
      />
      <button type="submit"><img src={sendIcon} alt="送信"/></button>
    </form>
  );
};

export default MessageInput;