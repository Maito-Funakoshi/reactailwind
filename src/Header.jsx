import React from 'react';

const Header = ({ messages }) => {
  const handleGetLog = () => {
    const log = messages.slice(1).map((msg) => msg.content).join('\n');
    downloadLogFile(log);
  };

  const downloadLogFile = (log) => {
    const element = document.createElement("a");
    const file = new Blob([log], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "conversation_log.txt";
    document.body.appendChild(element);
    element.click();
  };

  return (
    <h1>
      <span id="title">Self Disclosure Chatbot</span>
      <button onClick={handleGetLog}><img src="public/downloadIcon.jpg" alt="ダウンロード" /></button>
    </h1>
  );
};

export default Header;