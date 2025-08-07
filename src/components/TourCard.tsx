import React from 'react';
import { Calendar, MapPin, Users, Star, Heart } from 'lucide-react';
import { Tour } from '../types';

interface TourCardProps {
  tour: Tour;
  onTourClick: (tour: Tour) => void;
}

const TourCard: React.FC<TourCardProps> = ({ tour, onTourClick }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Легкий';
      case 'medium': return 'Средний';
      case 'hard': return 'Сложный';
      default: return difficulty;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden cursor-pointer group">
      <div className="relative" onClick={() => onTourClick(tour)}>
        <img
          src={tour.images[0]}
          alt={tour.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=800';
          }}
        />
        <div className="absolute top-3 right-3">
          <button className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors">
            <Heart className="h-4 w-4 text-gray-600" />
          </button>
        </div>
        <div className="absolute bottom-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(tour.difficulty)}`}>
            {getDifficultyText(tour.difficulty)}
          </span>
        </div>
      </div>
      
      <div className="p-4" onClick={() => onTourClick(tour)}>
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {tour.title}
        </h3>
        
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{tour.destination}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{new Date(tour.startDate).toLocaleDateString('ru-RU')} - {new Date(tour.endDate).toLocaleDateString('ru-RU')}</span>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <img
              src={tour.organizer.avatar}
              alt={tour.organizer.name}
              className="h-8 w-8 rounded-full object-cover mr-2"
            />
            <div>
              <p className="text-sm font-medium text-gray-900">{tour.organizer.name}</p>
              <div className="flex items-center">
                <Star className="h-3 w-3 text-yellow-400 mr-1" />
                <span className="text-xs text-gray-600">{tour.organizer.rating}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-600">
            <Users className="h-4 w-4 mr-1" />
            <span>{tour.currentParticipants}/{tour.maxParticipants}</span>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-gray-900">
              {tour.price.toLocaleString()} ₽
            </p>
            <p className="text-xs text-gray-500">на человека</p>
          </div>
        </div>
        
        <div className="mt-3 flex flex-wrap gap-1">
          {tour.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="inline-block px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-md"
            >
              #{tag}
            </span>
          ))}
          {tour.tags.length > 3 && (
            <span className="inline-block px-2 py-1 text-xs bg-gray-50 text-gray-600 rounded-md">
              +{tour.tags.length - 3}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TourCard;