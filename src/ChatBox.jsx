import React from 'react';

const ChatBox = ({ messages, error }) => {
  return (
    <>
    <div className="chat-box">
      {messages.slice(1).map((msg, index) => (
        <p key={index} className={msg.role}>
          {msg.role === "assistant" ? `${msg.assistant}: ${msg.content}` : msg.content}
        </p>
      ))}
    </div>
    {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
    </>
  );
};

export default ChatBox;