import React from 'react';
import downloadIcon from "../images/downloadIcon.png"

const Header = ({ messages, inputAble, setInputAble, recipients, setRecipients}) => {
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setRecipients(prevRecipients => ({
      ...prevRecipients,
      [name]: checked,
    }));
  };

  const toggleSwitch = () => {
    setInputAble(!inputAble);
  };

  const handleGetLog = () => {
    const log = messages.slice(1).map((msg) =>msg.name + ": " + msg.content).join('\n');
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
        <span id="title">SDC</span>
        <div class="recipients">
        　　<label>
          　　<input
            　　type="checkbox"
            　　name="A"
            　　checked={recipients.A}
            　　onChange={handleCheckboxChange}
          　　/>
          　　A
        　　</label>
        　　<label>
          　　<input
            　　type="checkbox"
            　　name="B"
            　　checked={recipients.B}
            　　onChange={handleCheckboxChange}
          　　/>
          　　B
        　　</label>
        　　<label>
          　　<input
            　　type="checkbox"
            　　name="C"
            　　checked={recipients.C}
            　　onChange={handleCheckboxChange}
          　　/>
          　　C
        　　</label>
      　</div>
        <div className={`switch_outer ${inputAble ? 'active' : ''}`} onClick={toggleSwitch}>
          <div className={`toggle_switch ${inputAble ? 'active' : ''}`}></div>
        </div>
        <button onClick={handleGetLog}><img src={downloadIcon} alt="ダウンロード" /></button>
      </h1>
    </header>
  );
};

export default Header;