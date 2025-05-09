import React from 'react';

function ChatToggle({ onClick }) {
  return (
    <button id="chat-toggle" onClick={onClick}>
      <img src="./images/chat-icon.png" alt="Chat" style={{ width: '40px', height: '40px' }} />
    </button>
  );
}

export default ChatToggle;