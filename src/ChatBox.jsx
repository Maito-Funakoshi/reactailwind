import React from 'react';
import { useEffect, useRef } from 'react';
import A from "../images/A.png";
import B from "../images/B.png";
import C from "../images/C.png"; 
import system from "../images/system.png";
import { marked } from 'marked';

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
      const element = document.documentElement;
      let bottom = element.scrollHeight - element.clientHeight;
      if (chatBoxRef.current.clientHeight < document.body.scrollHeight - document.querySelector('h1').clientHeight) {
        bottom = 0;
      }
      window.scrollTo({ top: bottom, behavior: "smooth" });
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
              <div
                className={`${msg.role} ${msg.mode}`}
                dangerouslySetInnerHTML={{ __html: marked(msg.content) }} // markedを使用してHTMLに変換
              ></div>
              {/* <p className={`${msg.role} ${msg.mode}`}>
                {msg.content}
              </p> */}
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