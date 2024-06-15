import React, { useState } from 'react';
import sendIcon from "../images/sendIcon.png"

const MessageInput = ({ setMessages, inputAble, recipients, setRecipients }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setMessages(prevMessages => [...prevMessages, { role: "user", content: input, name:"you" }]);
      setInput('');
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    if (name === 'all') {
      setRecipients({
        all: checked,
        A: checked,
        B: checked,
        C: checked,
      });
    } else {
      setRecipients(prevRecipients => ({
        ...prevRecipients,
        [name]: checked,
        all: false,
      }));
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
      <div>
        <div>返信が欲しい相手</div>
        <label>
          <input
            type="checkbox"
            name="all"
            checked={recipients.all}
            onChange={handleCheckboxChange}
          />
          全員
        </label>
        <label>
          <input
            type="checkbox"
            name="A"
            checked={recipients.A}
            onChange={handleCheckboxChange}
          />
          A
        </label>
        <label>
          <input
            type="checkbox"
            name="B"
            checked={recipients.B}
            onChange={handleCheckboxChange}
          />
          B
        </label>
        <label>
          <input
            type="checkbox"
            name="C"
            checked={recipients.C}
            onChange={handleCheckboxChange}
          />
          C
        </label>
      </div>
      <button type="submit"><img src={sendIcon} alt="送信"/></button>
    </form>
  );
};

export default MessageInput;