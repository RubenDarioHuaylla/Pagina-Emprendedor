import { Link } from 'react-router-dom';
import StarRating from './StarRating';

export default function BusinessCard({ id, name, category, rating, description, logo }) {
  return (
    <Link 
      to={`/emprendimientos/${id}`}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
    >
      <div className="h-48 bg-gray-200 flex items-center justify-center">
        {logo ? (
          <img src={logo} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-400">Imagen no disponible</span>
        )}
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{name}</h3>
          <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded">
            {category}
          </span>
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
        <div className="flex items-center">
          <StarRating rating={rating} />
          <span className="text-gray-500 text-sm ml-2">({rating.toFixed(1)})</span>
        </div>
        <button className="mt-4 w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg text-sm font-medium transition-colors">
          Ver detalles
        </button>
      </div>
    </Link>
  );
}    