import { useState, useEffect, useRef } from 'react';

function useChatbot() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const mensajesPrevios = useRef(0);
  const botSaludado = useRef(false);
  const esperandoConsultaFinal = useRef(false);

  const appendMessage = (sender, text, formatLinks = false) => {
    setMessages(prevMessages => {
      const newMessage = { sender, text };
      if (formatLinks) {
        // Expresión regular para encontrar tanto [Título](URL) como URL sin título
        // y aplicar formato a los enlaces.
        // Captura [Título](URL) y lo transforma en <a href="URL">Título</a>
        newMessage.text = newMessage.text.replace(/\[([^\]]+)\]\((https?:\/\/[^\s]+)\)/g, '<a href="$2" target="_blank" style="color: #1e90ff;">$1</a>');
        
        // Captura URLs que no están ya dentro de un href="..." y las transforma en <a href="URL">Consultar trámite</a>
        newMessage.text = newMessage.text.replace(/(?<!href=")(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" style="color: #1e90ff;">Consultar trámite</a>');
      }
      return [...prevMessages, newMessage];
    });
    if (sender === 'Asistente') {
      mensajesPrevios.current++;
      if (esperandoConsultaFinal.current) {
        esperandoConsultaFinal.current = false;
      }
    }
  };

  useEffect(() => {
    // Saludo inicial del bot, solo se ejecuta una vez al inicio
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
  }, [messages])
  ;

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

    // *** GTM EVENT - USUARIO ENVÍA MENSAJE ***
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'bot_message_sent',
        message: query,
        source: 'user_input',
      });
    }
    // **********************************

    const despedidasUsuario = ['chau', 'adiós', 'nos vemos', 'hasta luego', 'no, gracias', 'no gracias', 'no necesito nada más', 'nada más'];
    const agradecimientos = ['gracias', 'muchas gracias', 'te agradezco'];
    const mensajeUsuarioLower = query.toLowerCase();

    // Lógica para respuestas predefinidas (despedidas, agradecimientos)
    // Estas son prioridades y no pasan por Gemini si se cumplen
    if (esperandoConsultaFinal.current && despedidasUsuario.some(despedida => mensajeUsuarioLower.includes(despedida))) {
      const finalReply = `Cualquier consulta estoy a disposición. ${obtenerSaludoFinal()}`;
      appendMessage('Asistente', finalReply);
      if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push({ event: 'bot_message_received', message: finalReply, source: 'predefined_despedida' });
      }
      return;
    }

    // Si el usuario se despide pero hay un trámite en el mensaje, prioriza el trámite
    const containsTramiteKeyword = ['dni', 'licencia', 'nacimiento', 'casamiento', 'defunción', 'catastro', 'comercio', 'habilitación', 'multa', 'impuesto', 'rentas', 'permiso'].some(keyword => mensajeUsuarioLower.includes(keyword));

    if (despedidasUsuario.some(despedida => mensajeUsuarioLower.includes(despedida)) && !containsTramiteKeyword && mensajesPrevios.current > 0) {
      const finalReply = `¡Hasta luego! Cualquier consulta estoy a disposición. ${obtenerSaludoFinal()}`;
      appendMessage('Asistente', finalReply);
      if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push({ event: 'bot_message_received', message: finalReply, source: 'predefined_despedida' });
      }
      return;
    }
    // Si contiene palabra clave de trámite, se continúa al flujo de Gemini

    if (agradecimientos.some(agradecimiento => mensajeUsuarioLower.includes(agradecimiento))) {
      const reply = '¡De nada! ¿Puedo ayudarte en algo más?';
      appendMessage('Asistente', reply);
      esperandoConsultaFinal.current = true;
      if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push({ event: 'bot_message_received', message: reply, source: 'predefined_agradecimiento' });
      }
      return;
    }

    try {
      // Obtener la lista de trámites
      const apiKey = process.env.NEXT_PUBLIC_API_KEY; 
      const tramitesResponse = await fetch('https://admin.tramites.riocuarto.gob.ar/api/v1/tramites', {
        headers: {
          'Authorization': 'Bearer ' + apiKey,
          'Content-Type': 'application/json',
        }
      });
      const tramites = await tramitesResponse.json();

      let contextoTramites = "Lista de trámites disponibles:\n";
      tramites.forEach(tramite => {
        // Asegúrate de que las URLs no contengan caracteres especiales si no se codifican.
        // Y añade los parámetros UTM directamente aquí si quieres que Gemini los vea.
        const urlWithUtm = `https://tramites.riocuarto.gob.ar/tramites/${tramite['slug'] ?? 'sin-url'}?utm_source=chatbot&utm_medium=gemini&utm_campaign=tramites`;
        contextoTramites += `${tramite['title'] ?? 'Sin nombre'}: ${urlWithUtm}\n`;
      });

      const geminiApi = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

       const systemInstruction = `
        Eres un asistente virtual de la Municipalidad de Río Cuarto. 
        Tu función es ayudar con trámites municipales de forma clara, sencilla y amable.
        
        **Instrucciones importantes:**
        - Responde siempre de manera concisa y directa.
        - Si la consulta del usuario es vaga o no especifica un trámite claro, pregunta por más detalles. Ejemplo: "Necesito más información para ayudarte con tu trámite. ¿Podrías especificar qué tipo de certificado o gestión necesitas?" o "¿Podrías ser más específico sobre el trámite que te interesa?". No confundas saludos con trámites.
        - Si el usuario pregunta algo que NO está relacionado con trámites municipales, responde educadamente indicando tus limitaciones. Ejemplo: "Mi función es ayudar con trámites de la Municipalidad de Río Cuarto. No puedo responder preguntas sobre otros temas." o "Por el momento, solo puedo ayudarte con información sobre trámites municipales."
        - Cuando menciones un enlace a un trámite, proporciona el título del trámite y luego la URL limpia, sin formato Markdown, corchetes o paréntesis, seguido de los parámetros UTM. Ejemplo: "Certificado de Nacimiento: https://tramites.riocuarto.gob.ar/tramites/certificado-nacimiento?utm_source=chatbot&utm_medium=gemini&utm_campaign=tramites"
        - Al final de cada respuesta, si necesitas más información o quieres guiar al usuario a un siguiente paso, pregunta si quiere saber más cosas del trámite. Por ejemplo, si proporcionaste información general, puedes preguntar: "¿Te gustaría saber los requisitos o el costo de este trámite?" o "¿Hay algo más en lo que pueda ayudarte con esto?". Sé específico con lo que puedes ofrecer a continuación.
        - Si el usuario responde afirmativamente (ej. "Sí", "Claro", "Por favor", "Costo", "Requisitos") a una pregunta de seguimiento que tú hiciste, proporciona directamente la información solicitada sin repetir la pregunta.
        - Si el usuario responde negativamente (ej. "No", "No, gracias", "Nada") a una pregunta de seguimiento, pregunta si puedes ayudarlo con algo más en general.
        - Resume el nombre del trámite, por ejemplo: "Certificado de Nacimiento" en lugar de "Certificado de Nacimiento de la Municipalidad de Río Cuarto" "DNI Extraviado" en lugar de "DNI mayor de edad (robo, extravio, cambio de domicilio, reemplazo DNI tapa verde)".
        - No combines temas en una sola respuesta si el usuario pregunta sobre dos trámites distintos; enfócate en el trámite principal o pregunta cuál prefiere.
        - Si el usuario se despide pero su mensaje contiene una consulta de trámite (ej. "Chau perdi el dni"), ignora la despedida y resuelve el trámite. Luego, puedes despedirte al final de tu respuesta de trámite.
        - NO uses formato Markdown (como negritas, cursivas, listas) ni HTML en tus respuestas, solo texto plano.
        

        Aquí tienes información sobre los trámites disponibles que puedes usar como referencia:
        ${contextoTramites}
      `;

      // Construir el historial para Gemini:
      // Se utiliza una ventana deslizante de los últimos mensajes para el contexto.
      // `messages.slice(-10)` es un ejemplo, ajusta el número según tus necesidades y límites de tokens.
      // Asegúrate de que el historial tenga roles alternados 'user' y 'model'.
      const conversationHistoryForGemini = messages.slice(-10).map(msg => ({
        role: msg.sender === 'Tú' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

      // Añadir la systemInstruction y la query al último mensaje del usuario.
      // Esta es la forma más directa de asegurar que Gemini tenga el contexto y las reglas.
      // El último elemento en `conversationHistoryForGemini` es el mensaje del usuario actual.
      // Modificamos el contenido de ese último mensaje.
      const lastUserMessageIndex = conversationHistoryForGemini.length - 1;
      if (lastUserMessageIndex >= 0 && conversationHistoryForGemini[lastUserMessageIndex].role === 'user') {
          conversationHistoryForGemini[lastUserMessageIndex].parts[0].text = 
            systemInstruction + "\n\n" + "Última consulta del usuario: " + query;
      } else {
          // Esto no debería pasar si `appendMessage('Tú', query)` se llamó antes.
          // Pero si ocurriera, añadir el mensaje como un nuevo turno.
          conversationHistoryForGemini.push({
              role: 'user',
              parts: [{ text: systemInstruction + "\n\n" + "Última consulta del usuario: " + query }]
          });
      }


      const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApi}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: conversationHistoryForGemini // Envía el historial modificado
        })
      });

      const result = await geminiResponse.json();
      let reply = result?.candidates?.[0]?.content?.parts?.[0]?.text ?? 'No se pudo generar una respuesta.';

      // La lógica de eliminación de saludo inicial. Se puede mantener si el modelo
      // a veces introduce saludos a pesar de las instrucciones.
      if (mensajesPrevios.current > 0) {
        reply = reply.replace(/^¡?Hola!?(\s*[,.-])?/i, '').trim();
      }

      appendMessage('Asistente', reply, true); // El bot "envía" su respuesta a la UI

      // *** GTM EVENT - BOT RESPONDE (Desde Gemini) ***
      if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push({
          event: 'bot_message_received',
          message: reply,
          source: 'gemini_api_response',
        });
      }
      // **********************************

    } catch (error) {
      console.error('Error procesando la consulta:', error);
      appendMessage('Asistente', 'Ocurrió un error procesando tu consulta. Por favor, intenta de nuevo más tarde.');
      // *** GTM EVENT - BOT ERROR ***
      if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push({
          event: 'bot_error',
          errorMessage: error.message,
        });
      }
      // ******************************
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