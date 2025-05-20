import React from 'react';

function ChatInput({ inputValue, onInputChange, onSubmit }) {
  return (
    <form id="chat-form" onSubmit={onSubmit}>
      <input
        type="text"
        id="user-input"
        placeholder="Escribe tu consulta..."
        required
        value={inputValue}
        onChange={onInputChange} className='form-control'
      />
      <button className='btn btn-primary' type="submit">Enviar</button>
    </form>
  );
}

export default ChatInput;