import { useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-toastify';
import API from '../api/axios';

export default function ReviewForm({ targetId, targetType, onSuccess }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica del frontend
    if (rating === 0) {
      toast.warning('Por favor selecciona una valoración');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        valoracion: rating,
        comentario: comment,
        [targetType === 'producto' ? 'id_producto_servicio' : 'id_emprendimiento']: targetId
      };

      await API.post('/api/resenas', payload);
      
      toast.success('¡Reseña publicada con éxito!');
      onSuccess?.(); // Esto recargará las reseñas en el componente padre
      
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error al enviar la reseña';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Selector de estrellas */}
      <div>
        <label className="block mb-2 font-medium">Valoración*</label>
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              onClick={() => !isSubmitting && setRating(star)}
              disabled={isSubmitting}
              className={`focus:outline-none transition-transform ${
                isSubmitting ? 'opacity-50' : 'hover:scale-110'
              }`}
            >
              <StarIcon
                className={`h-8 w-8 ${
                  star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Campo de comentario */}
      <div>
        <label htmlFor="comment" className="block mb-2 font-medium">
          Comentario <span className="text-gray-500">(opcional)</span>
        </label>
        <textarea
          id="comment"
          rows={4}
          value={comment}
          onChange={(e) => !isSubmitting && setComment(e.target.value)}
          disabled={isSubmitting}
          className="w-full px-3 py-2 border rounded-lg disabled:opacity-50"
          placeholder="Ej: 'Me encantó este producto porque...'"
        />
      </div>

      {/* Botón de enviar */}
      <button
        type="submit"
        disabled={isSubmitting || rating === 0}
        className={`w-full py-2 px-4 rounded-lg font-medium text-white ${
          isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
        } transition-colors`}
      >
        {isSubmitting ? (
          <span className="inline-flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Enviando...
          </span>
        ) : (
          'Publicar reseña'
        )}
      </button>
    </form>
  );
}