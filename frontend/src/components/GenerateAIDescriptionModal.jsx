import { useState, useEffect } from 'react';
import API from '../api/axios';

// Componente de Spinner para mostrar durante la carga
const Spinner = () => (
  <div className="w-6 h-6 border-4 border-dashed rounded-full animate-spin border-sky-500"></div>
);

const GenerateAIDescriptionModal = ({ isOpen, onClose, onDescriptionGenerated, initialTitle = '' }) => {
  const [keywords, setKeywords] = useState('');
  const [specialNote, setSpecialNote] = useState('');
  const [productTitle, setProductTitle] = useState(initialTitle);
  const [generatedDescription, setGeneratedDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Sincroniza el título del modal si cambia en el formulario principal.
  useEffect(() => {
    if (isOpen) {
      setProductTitle(initialTitle);
    }
  }, [isOpen, initialTitle]);

  if (!isOpen) return null;

  // --- 1. FUNCIÓN PARA REINICIAR EL ESTADO ---
  // Esta función limpia todos los campos del modal.
  const resetModalState = () => {
    setKeywords('');
    setSpecialNote('');
    setGeneratedDescription('');
    setError('');
    setIsLoading(false);
  };

  // --- 2. MANEJADOR DE CIERRE MEJORADO ---
  // Ahora, antes de cerrar, llamamos a la función de reinicio.
  const handleClose = () => {
    resetModalState();
    onClose(); // Llama a la función del componente padre para cerrar el modal.
  };

  const handleGenerate = async () => {
    if (!productTitle) {
      setError('El nombre del producto es obligatorio.');
      return;
    }
    setIsLoading(true);
    setError('');
    setGeneratedDescription('');
    try {
      const response = await API.post('/api/ai/generate-description', {
        title: productTitle,
        keywords,
        specialNote,
      });
      setGeneratedDescription(response.data.description);
    } catch (err) {
      console.error("Error al llamar a la API de IA:", err);
      setError(err.response?.data?.message || 'Ocurrió un error. Revisa la consola.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseDescription = () => {
    onDescriptionGenerated(generatedDescription);
    handleClose(); // Usamos el nuevo manejador para cerrar y limpiar.
  };

  return (
    // --- 3. USAMOS EL NUEVO MANEJADOR EN EL JSX ---
    // Usamos `handleClose` para que cualquier acción de cierre reinicie el estado.
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Generar Descripción con IA ✨</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="productTitle" className="block text-sm font-medium text-gray-700">Nombre del Producto/Servicio *</label>
            <input
              type="text"
              id="productTitle"
              value={productTitle}
              onChange={(e) => setProductTitle(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
              placeholder="Ej: Zapatillas de running ultra ligeras"
            />
          </div>
          <div>
            <label htmlFor="keywords" className="block text-sm font-medium text-gray-700">Palabras Clave (separadas por comas)</label>
            <input
              type="text"
              id="keywords"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
              placeholder="Ej: correr, deporte, amortiguación, maratón"
            />
          </div>
          <div>
            <label htmlFor="specialNote" className="block text-sm font-medium text-gray-700">¿Qué lo hace especial o diferente? (Opcional)</label>
            <input
              type="text"
              id="specialNote"
              value={specialNote}
              onChange={(e) => setSpecialNote(e.target.value)}
              maxLength="150"
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
              placeholder="Ej: Fabricado con materiales reciclados del océano"
            />
          </div>
        </div>
        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        <div className="mt-6 flex justify-between items-center">
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="flex items-center justify-center px-4 py-2 bg-sky-600 text-white font-semibold rounded-md hover:bg-sky-700 disabled:bg-sky-300 disabled:cursor-not-allowed"
          >
            {isLoading ? <Spinner /> : 'Generar'}
          </button>
          <button onClick={handleClose} className="px-4 py-2 text-gray-600 font-semibold rounded-md hover:bg-gray-100">
            Cerrar
          </button>
        </div>
        {generatedDescription && (
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700">Descripción Generada:</label>
            <textarea
              readOnly
              value={generatedDescription}
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm h-40"
            />
            <button
              onClick={handleUseDescription}
              className="mt-2 px-4 py-2 bg-emerald-600 text-white font-semibold rounded-md hover:bg-emerald-700 w-full"
            >
              Usar esta Descripción
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateAIDescriptionModal;
