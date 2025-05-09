'use client';

import React, { useState } from 'react';
import ChatToggle from './ChatToggle';
import ChatWindow from './ChatWindow';
import ChatBubble from './ChatBubble';




function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleToggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleOpenChatFromBubble = () => {
    setIsChatOpen(true);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
    localStorage.setItem('chatClosed', 'true'); // Guardar que el chat se cerró desde la ventana
  };

  return (
    <div>
      <ChatToggle onClick={handleToggleChat} />
      <ChatWindow isOpen={isChatOpen} onClose={handleCloseChat} />
      <ChatBubble onOpen={handleOpenChatFromBubble} isChatOpen={isChatOpen} /> {/* Pasamos isChatOpen como prop */}
    </div>
  );
}

export default App;