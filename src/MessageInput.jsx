import React from 'react';

const MessageInput = ({ setMessages }) => {
  const [input, setInput] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setMessages(prevMessages => [...prevMessages, { role: "user", content: input }]);
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="メッセージを入力してください"
      />
      <button type="submit">送信</button>
    </form>
  );
};

export default MessageInput;