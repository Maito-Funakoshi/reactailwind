import React from 'react';
import downloadIcon from "../images/downloadIcon.png"

const Header = ({ messages, inputAble, setInputAble}) => {
  const reflect = () => {
    setInputAble(!inputAble);
  };

  const handleGetLog = () => {
    const log = messages.map((msg) =>msg.name + ": " + msg.content).join('\n');
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
    <header className="App-header">
      <h1>
        <span id="title">ODC</span>
        {/* <div className={`switch_outer ${inputAble ? 'active' : ''}`} onClick={reflect}>
          <div className={`toggle_switch ${inputAble ? 'active' : ''}`}></div>
        </div> */}
        <button className="reflect-btn" onClick={reflect}>
          リフレクティング
        </button>
        {/* <button className="download" onClick={handleGetLog}><img src={downloadIcon} alt="ダウンロード" /></button> */}
      </h1>
    </header>
  );
};

export default Header;