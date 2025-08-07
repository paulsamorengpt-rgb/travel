import React, { useState } from 'react';
import { Search, Filter, MapPin, Calendar, Users, Compass } from 'lucide-react';
import TourCard from '../components/TourCard';
import { mockTours } from '../data/mockData';
import { Tour } from '../types';

interface HomePageProps {
  onTourClick: (tour: Tour) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onTourClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    destination: '',
    dateFrom: '',
    dateTo: '',
    priceMax: '',
    difficulty: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);

  const filteredTours = mockTours.filter(tour => {
    const matchesSearch = tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tour.destination.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDestination = !filters.destination || 
                              tour.destination.toLowerCase().includes(filters.destination.toLowerCase());
    
    const matchesDifficulty = filters.difficulty === 'all' || tour.difficulty === filters.difficulty;
    
    const matchesPrice = !filters.priceMax || tour.price <= parseInt(filters.priceMax);

    return matchesSearch && matchesDestination && matchesDifficulty && matchesPrice;
  });

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-4">Найдите идеальных попутчиков</h1>
          <p className="text-xl mb-6 opacity-90">
            Открывайте новые места в компании единомышленников
          </p>
          
          <div className="bg-white rounded-lg p-4 max-w-4xl">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Куда хотите поехать?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Filter className="h-5 w-5 mr-2" />
                Фильтры
              </button>
              
              <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Найти
              </button>
            </div>
          </div>
        </div>
        
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white opacity-10 rounded-full"></div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Направление
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Любое"
                  value={filters.destination}
                  onChange={(e) => setFilters({...filters, destination: e.target.value})}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Дата от
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Максимальная цена
              </label>
              <input
                type="number"
                placeholder="Любая"
                value={filters.priceMax}
                onChange={(e) => setFilters({...filters, priceMax: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Сложность
              </label>
              <select
                value={filters.difficulty}
                onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Любая</option>
                <option value="easy">Легкая</option>
                <option value="medium">Средняя</option>
                <option value="hard">Сложная</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
          <div className="flex items-center">
            <Compass className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-blue-900">150+</p>
              <p className="text-blue-700">Активных туров</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-green-900">2.5k+</p>
              <p className="text-green-700">Участников</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl">
          <div className="flex items-center">
            <MapPin className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-orange-900">50+</p>
              <p className="text-orange-700">Стран и регионов</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tours Grid */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Популярные туры
          </h2>
          <p className="text-gray-600">
            Найдено: {filteredTours.length} туров
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTours.map((tour) => (
            <TourCard key={tour.id} tour={tour} onTourClick={onTourClick} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;