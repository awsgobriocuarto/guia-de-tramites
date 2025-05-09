import React, { useEffect, useRef } from 'react';



function ChatBox({ messages, isAssistantLoading }) {
  const chatBoxRef = useRef(null);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div id="chat-box" ref={chatBoxRef}>
      {messages.map((msg, index) => (
        <div key={index} className={msg.sender === 'Asistente' ? 'message assistant-message' : 'message user-message'}>
          {msg.sender === 'Asistente' && (
            <img className="avatar-assistant" src="/images/logo_avatar.png" alt="Asistente" />
          )}
          {msg.sender !== 'Asistente' && (
            <img className="avatar-user" src="./images/usuario-avatar.png" alt="Tú" />
          )}
          <div className="message-content">
            {msg.sender !== 'Asistente' && <strong>{msg.sender}:</strong>}
            <span dangerouslySetInnerHTML={{ __html: msg.text }} />
          </div>
        </div>
      ))}
      
      
    </div>
  );
}

export default ChatBox;