'use client';

import React from 'react';
import ChatBox from './ChatBox';
import ChatInput from './ChatInput';
import useChatbot from 'app/hooks/useChatbot';

function ChatWindow({ isOpen, onClose }) {
  const { messages, inputValue, handleInputChange, handleSubmit } = useChatbot();

  if (!isOpen) {
    return null;
  }

  return (
    <div id="chat-container">
      {/* Componente ChatHeader definido directamente aquí */}
      <div id="chat-header">
        Asistente virtual
        <button onClick={onClose}>&times;</button>
      </div>
      
      

      <ChatBox messages={messages} />
      <ChatInput inputValue={inputValue} onInputChange={handleInputChange} onSubmit={handleSubmit} />
    </div>
  );
}



export default ChatWindow;