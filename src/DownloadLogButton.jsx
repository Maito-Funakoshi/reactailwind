import React from 'react';

const DownloadLogButton = ({ handleGetLog }) => {
  return (
    <button onClick={handleGetLog}>会話ログをダウンロード</button>
  );
};

export default DownloadLogButton;