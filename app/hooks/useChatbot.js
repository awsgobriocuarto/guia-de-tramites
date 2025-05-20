import { useState, useEffect, useRef } from 'react';

function useChatbot() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const mensajesPrevios = useRef(0);
  const botSaludado = useRef(false);
  const esperandoConsultaFinal = useRef(false); // Nuevo estado para rastrear la pregunta final

  const appendMessage = (sender, text, formatLinks = false) => {
    setMessages(prevMessages => {
      const newMessage = { sender, text };
      if (formatLinks) {
        newMessage.text = text.replace(/\[([^\]]+)\]\((https?:\/\/[^\s]+)\)/g, '<a href="$2" target="_blank" style="color: #1e90ff;">$1</a>');
        newMessage.text = newMessage.text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" style="color: #1e90ff;">$1</a>');
      }
      return [...prevMessages, newMessage];
    });
    if (sender === 'Asistente') {
      mensajesPrevios.current++;
      if (esperandoConsultaFinal.current) {
        esperandoConsultaFinal.current = false; // Resetear después de la respuesta final
      }
    }
  };

  useEffect(() => {
    if (messages.length === 0 && !botSaludado.current) {
      const now = new Date();
      const hour = now.getHours();
      let saludoInicial = '¡Hola!';
      if (hour >= 6 && hour < 12) {
        saludoInicial = '¡Buen día!';
      } else if (hour >= 12 && hour < 20) {
        saludoInicial = '¡Buenas tardes!';
      } else {
        saludoInicial = '¡Buenas noches!';
      }
      appendMessage('Asistente', `${saludoInicial} ¿En qué trámite de la Municipalidad de Río Cuarto puedo ayudarte hoy?`);
      botSaludado.current = true;
    }
  }, [messages]);

  const obtenerSaludoFinal = () => {
    const now = new Date();
    const hour = now.getHours();
    if (hour >= 6 && hour < 12) {
      return '¡Que tengas un buen día!';
    } else if (hour >= 12 && hour < 20) {
      return '¡Que tengas una buena tarde!';
    } else {
      return '¡Que tengas una buena noche!';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const query = inputValue.trim();
    if (!query) return;

    appendMessage('Tú', query);
    setInputValue('');

    const despedidasUsuario = ['chau', 'adiós', 'nos vemos', 'hasta luego', 'no, gracias', 'no gracias', 'no necesito nada más', 'nada más'];
    const agradecimientos = ['gracias', 'muchas gracias', 'te agradezco'];
    const mensajeUsuario = query.toLowerCase();

    if (esperandoConsultaFinal.current && despedidasUsuario.some(despedida => mensajeUsuario.includes(despedida))) {
      appendMessage('Asistente', `Cualquier consulta estoy a disposición. ${obtenerSaludoFinal()}`);
      return;
    }

    if (despedidasUsuario.some(despedida => mensajeUsuario.includes(despedida)) && mensajesPrevios.current > 0) {
      appendMessage('Asistente', `¡Hasta luego! Cualquier consulta estoy a disposición. ${obtenerSaludoFinal()}`);
      return;
    }

    if (agradecimientos.some(agradecimiento => mensajeUsuario.includes(agradecimiento))) {
      appendMessage('Asistente', '¡De nada! ¿Puedo ayudarte en algo más?');
      esperandoConsultaFinal.current = true; // Establecer el estado para la respuesta final
      return;
    }

    try {
      const apiKey = process.env.NEXT_PUBLIC_API_KEY;
      const tramitesResponse = await fetch('https://admin.tramites.riocuarto.gob.ar/api/v1/tramites', {
        headers: {
          'Authorization': 'Bearer ' + apiKey,
          'Content-Type': 'application/json',
        }
      });
      const tramites = await tramitesResponse.json();

      let contexto = "Lista de trámites disponibles:\n";
      tramites.forEach(tramite => {
        contexto += `${tramite['title'] ?? 'Sin nombre'}: https://tramites.riocuarto.gob.ar/tramites/${tramite['slug'] ?? 'Sin URL'}\n`;
      });

      const prompt = `
        Eres un asistente virtual de la Municipalidad de Río Cuarto. 
        Tu función es ayudar con trámites municipales de forma clara, sencilla y amable.
        **Instrucciones importantes para refinar la respuesta:**
        - Si la consulta del usuario es vaga o no especifica un trámite claro, responde preguntando por más detalles. Por ejemplo: "Necesito más información para ayudarte con tu trámite. ¿Podrías especificar qué tipo de certificado o gestión necesitas?" o "¿Podrías ser más específico sobre el trámite que te interesa?".
        - Si el usuario pregunta algo que NO está relacionado con trámites municipales, responde de forma educada indicando tus limitaciones. Por ejemplo: "Mi función es ayudar con trámites de la Municipalidad de Río Cuarto. No puedo responder preguntas sobre otros temas." o "Por el momento, solo puedo ayudarte con información sobre trámites municipales."
        - Si mencionas enlaces, NO uses formato Markdown ni paréntesis ni corchetes. Solo muestra directamente el enlace limpio, así: https://tramites.riocuarto.gob.ar/tramite
        - Solo puedes saludar (Hola, Buen día, etc.) en la PRIMERA respuesta. Luego responde sin saludos ni expresiones similares.
        - Cuando el usuario responda "no, gracias" o similar a la pregunta "¿Puedo ayudarte en algo más?", despídete amablemente con un saludo según la hora del día (mañana, tarde, noche) y la frase "Cualquier consulta estoy a disposición.".
        Aquí tienes información sobre los trámites disponibles:
        ${contexto}

        Consulta del usuario: ${query}
      `;

      const geminiApi = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApi}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        })
      });

      const result = await geminiResponse.json();
      let reply = result?.candidates?.[0]?.content?.parts?.[0]?.text ?? 'No se pudo generar una respuesta.';

      if (mensajesPrevios.current > 0) {
        reply = reply.replace(/^¡?Hola!?(\s*[,.-])?/i, '').trim();
      }

      appendMessage('Asistente', reply, true);
    } catch (error) {
      console.error('Error:', error);
      appendMessage('Asistente', 'Ocurrió un error procesando tu consulta.');
    } finally {
      // No necesitas nada especial aquí por ahora
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  return {
    messages,
    inputValue,
    handleInputChange,
    handleSubmit,
  };
}

export default useChatbot;