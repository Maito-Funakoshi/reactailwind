import React from 'react';
import A from "../images/A.png";
import B from "../images/B.png";
import C from "../images/C.png"; 

const ChatBox = ({ messages, error }) => {
  const getImageSrc = (name) => {
    switch (name) {
      case 'A':
        return A;
      case 'B':
        return B;
      case 'C':
        return C;
      default:
        return ''; // デフォルトの画像パス、必要ならば設定
    }
  };

  return (
    <>
    <div className="chat-box">
      {messages.slice(1).map((msg, index) => {
        const imageSrc = getImageSrc(msg.name);
        return (
          <div className={msg.name} key={index}>
            {imageSrc && <img src={imageSrc} alt={msg.name} />}
            <p className={msg.role}>
              {msg.content}
            </p>
          </div>
        );
      })}
    </div>
    {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
    </>
  );
};

export default ChatBox;