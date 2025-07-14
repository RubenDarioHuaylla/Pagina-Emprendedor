const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateDescription = async (req, res) => {
  try {
    const { title, keywords, specialNote } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'El título es obligatorio.' });
    }

    // --- PROMPT MEJORADO ---
    // Le damos instrucciones mucho más estrictas sobre el formato de salida.
    const prompt = `
    Eres un redactor especializado en comercio electrónico. Tu tarea es crear una descripción breve y persuasiva para un producto o servicio que se publicará en una plataforma web. Esta descripción se mostrará a posibles compradores, por lo que debe ser atractiva, clara y confiable.

    ✦ Requisitos de redacción (sigue estrictamente estas instrucciones):
    1. Redacta en lenguaje natural y comercial, pensando en el cliente final.
    2. Usa un tono amigable y profesional.
    3. El texto debe tener entre **1 y 2 párrafos cortos** (máximo 120 palabras).
    4. Integra las palabras clave de forma **natural**, sin forzarlas.
    5. Si se proporciona una "Nota Especial", úsala como un diferenciador clave del producto.
    6. No incluyas títulos, subtítulos ni encabezados.
    7. No uses viñetas, guiones, asteriscos, ni ningún formato especial (texto plano únicamente).
    8. No comiences con frases como "Aquí tienes la descripción" ni des contexto fuera del texto final.

    ✦ Información del producto:
    - Nombre del producto o servicio: "${title}"
    - Palabras clave: "${keywords || 'No especificadas'}"
    - Diferenciador especial: "${specialNote || 'No especificado'}"

    Escribe ahora la descripción exacta que aparecerá en la página del producto.
    `;


    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    // Limpieza final para asegurar que no haya Markdown.
    let description = response.text().replace(/[*#]/g, '').trim();

    res.status(200).json({ description });

  } catch (error) {
    console.error('[ERROR] Falló la operación en el controlador de IA:', error);
    res.status(500).json({ message: 'Error interno del servidor al contactar la IA.' });
  }
};

module.exports = {
  generateDescription,
};
