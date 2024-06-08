import React, { useState, useEffect } from 'react';

const ChatBox = ({ messages, error }) => {
  const [displayedMessages, setDisplayedMessages] = useState([]);

  useEffect(() => {
    if (messages.length > 1) {
      const lastMessage = messages[messages.length - 1];
      const newMessage = { ...lastMessage, content: '' };
      setDisplayedMessages([...displayedMessages, newMessage]);

      let charIndex = 0;
      const intervalId = setInterval(() => {
        if (charIndex < lastMessage.content.length) {
          setDisplayedMessages((prev) => {
            const updatedMessages = [...prev];
            updatedMessages[updatedMessages.length - 1].content += lastMessage.content[charIndex];
            return updatedMessages;
          });
          charIndex++;
        } else {
          clearInterval(intervalId);
        }
      }, 50); // 文字表示の速度を設定

      return () => clearInterval(intervalId);
    }
  }, [messages]);

  return (
    <>
      <div className="chat-box">
        {displayedMessages.slice(1).map((msg, index) => (
          <p key={index} className={msg.role}>
            {msg.content}
          </p>
        ))}
      </div>
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
    </>
  );
};

export default ChatBox;
