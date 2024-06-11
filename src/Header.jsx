import React, {useState} from 'react';
import downloadIcon from "../images/downloadIcon.png"

const Header = ({ messages }) => {
  const [inputAble, setInputAble] = useState(true);

  const toggleSwitch = () => {
    setInputAble(!inputAble);
  };



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
    <header className="App-header">
      <h1>
        <span id="title">Self Disclosure Chatbot</span>
        <div className={`switch_outer ${inputAble ? 'active' : ''}`} onClick={toggleSwitch}>
          <div className={`toggle_switch ${inputAble ? 'active' : ''}`}></div>
        </div>
        <button onClick={handleGetLog}><img src={downloadIcon} alt="ダウンロード" /></button>
      </h1>
    </header>
  );
};

export default Header;