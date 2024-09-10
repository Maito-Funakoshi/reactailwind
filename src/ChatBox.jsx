import React from 'react';
import { useEffect, useRef } from 'react';
import A from "../images/A.png";
import B from "../images/B.png";
import C from "../images/C.png"; 
import system from "../images/system.png";

const ChatBox = ({ names, namesEng, messages, error }) => {
  const getName = (nameEng) => {
    switch (nameEng) {
      case namesEng[0]:
        return names[0];
      case namesEng[1]:
        return names[1];
      case namesEng[2]:
        return names[2];
      default:
        return '';
    }
  };

  const getImageSrc = (nameEng) => {
    switch (nameEng) {
      case namesEng[0]:
        return A;
      case namesEng[1]:
        return B;
      case namesEng[2]:
        return C;
      case 'system':
        return system;
      default:
        return '';
    }
  };

  const chatBoxRef = useRef(null);

  useEffect(() => {
    if (chatBoxRef.current) {
      const chatBox = chatBoxRef.current;
      
      // スクロール位置を取得
      const scrollTop = chatBox.scrollTop;
      const scrollHeight = chatBox.scrollHeight;
      const clientHeight = chatBox.clientHeight;

      // 現在のスクロール位置が下から近いかどうかを判定
      if (scrollHeight - (scrollTop + clientHeight) < 100) {  // 100px以内の誤差を許容
        // メッセージが下に隠れた場合にのみスクロール
        chatBox.scrollTo({ top: scrollHeight, behavior: 'smooth' });
      }
    }
  }, [messages]);

  return (
    <>
    <div className="chat-box" ref={chatBoxRef}>
      {messages.map((msg, index) => {
        const name = getName(msg.name);
        const imageSrc = getImageSrc(msg.name);
        return (
          <div className={msg.name} key={index}>
            {imageSrc && <img src={imageSrc} alt={msg.name} />}
            <div className="message">
              {name && <p className="recipient">{name}</p>}
              <p className={`${msg.role} ${msg.mode}`}>
                {msg.content}
              </p>
            </div>
          </div>
        );
      })}
    </div>
    {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
    </>
  );
};

export default ChatBox;