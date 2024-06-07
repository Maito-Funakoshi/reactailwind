import React from 'react';

const DownloadLogButton = ({ messages }) => {
  const handleGetLog = () => {
    const log = messages.slice(1).map((msg) => `${msg.role === "assistant" ? `${msg.assistant}: ` : ''}${msg.role === "user" ? 'あなた: ' : ''}${msg.content}`).join('\n');
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
    <button onClick={handleGetLog}>会話ログをダウンロード</button>
  );
};

export default DownloadLogButton;