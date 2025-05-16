import React, { useState, useEffect, useRef } from 'react';


function ChatBubble({ onOpen, isChatOpen }) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutId = useRef(null);
  const scrollTimeout = useRef(null);
  const sound = useRef(document.getElementById('chatSound'));



  const playSound = () => {
    try {
      sound.current.play();
    } catch (e) {
      console.warn("No se pudo reproducir el sonido:", e);
    }
  };


  useEffect(() => {

    const chatClosed = localStorage.getItem('chatClosed') === 'true';
    if (!isChatOpen && !chatClosed) {
      timeoutId.current = setTimeout(() => {
        setIsVisible(true);
        playSound();
      }, 10000);

      const handleScroll = () => {
        if (isChatOpen || localStorage.getItem('chatClosed') === 'true' || scrollTimeout.current) return;
        scrollTimeout.current = setTimeout(() => {
          setIsVisible(true);
          scrollTimeout.current = null;
        }, 300);
      };

      window.addEventListener('scroll', handleScroll);

      return () => {
        clearTimeout(timeoutId.current);
        if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
        window.removeEventListener('scroll', handleScroll);
      };
    } else {
      setIsVisible(false);
      clearTimeout(timeoutId.current);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    }

    if (isChatOpen) {
      localStorage.removeItem('chatClosed');
    }
  }, [isChatOpen]);

  useEffect(() => {
    if (isVisible && sound.current) {
      const playPromise = sound.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn("Intento de reproducción automática fallido:", error);
          // Puedes intentar alguna otra estrategia aquí si es necesario
        });
      }
    }
  }, [isVisible, sound]);
  
  const handleClose = () => {
    localStorage.setItem('chatClosed', 'true');
    setIsVisible(false);
    if (sound.current) {
      const playPromise = sound.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn("Intento de reproducción al cerrar fallido:", error);
        });
      }
    }
    clearTimeout(timeoutId.current);
  };

  return isVisible ? (
    <div className="floating-chat show">
      
      <img className="avatar" src="/images/logo_avatar.png" alt="Asistente" />
      <div className="message-bubble">
        <button className="close-btn" onClick={handleClose}>&times;</button>
        <p>¡Hola! ¿Tenés dudas sobre un trámite?</p>
        <button onClick={onOpen} style={{ marginTop: '5px' }}>Comenzar</button>
      </div>
      
      
      
      {
        /*Los sonidos no funcionan 
      /* <audio id="chatSound" ref={sound} preload="auto">
        <source src="https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg" type="audio/ogg" />
        <source src="https://cdn.freesound.org/previews/341/341695_5260877-lq.mp3" type="audio/mpeg" />
        Tu navegador no soporta la etiqueta de audio.
      </audio> */}
    </div>
  ) : null;
}

export default ChatBubble;