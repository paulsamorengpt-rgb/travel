import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Star, 
  Heart,
  Share2,
  Car,
  Home,
  Utensils,
  ArrowLeft,
  MessageCircle,
  Shield,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  Info
} from 'lucide-react';
import { Tour, User, BookingRequest } from '../types';
import { useAuth } from '../context/AuthContext';
import BookingModal from '../components/BookingModal';
import PaymentModal from '../components/PaymentModal';

interface TourDetailPageProps {
  tour: Tour;
  onBack: () => void;
}

const TourDetailPage: React.FC<TourDetailPageProps> = ({ tour, onBack }) => {
  const { user } = useAuth();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinMessage, setJoinMessage] = useState('');
  const [showFullGallery, setShowFullGallery] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<BookingRequest | null>(null);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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

  const mockParticipants: User[] = [
    {
      id: '1',
      name: 'Анна Петрова',
      email: 'anna@example.com',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      rating: 4.8,
      reviewsCount: 23,
      location: 'Москва',
      joinedDate: '2023-01-15',
      verified: true
    },
    {
      id: '2',
      name: 'Михаил Иванов',
      email: 'michael@example.com',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
      rating: 4.6,
      reviewsCount: 18,
      location: 'Санкт-Петербург',
      joinedDate: '2022-08-22',
      verified: true
    }
  ];

  const tourIncludes = [
    'Проживание в указанных местах',
    'Трансфер по программе',
    'Услуги гида-проводника',
    'Входные билеты в музеи',
    'Страховка от несчастных случаев'
  ];

  const tourExcludes = [
    'Авиабилеты до места начала тура',
    'Личные расходы',
    'Дополнительные экскурсии',
    'Алкогольные напитки',
    'Чаевые'
  ];

  const handleJoinTour = () => {
    if (!user) {
      alert('Для участия в туре необходимо войти в аккаунт');
      return;
    }
    setShowBookingModal(true);
  };

  const handleBookingComplete = (booking: BookingRequest) => {
    setCurrentBooking(booking);
    setShowBookingModal(false);
    setShowPaymentModal(true);
  };

  const handlePaymentComplete = () => {
    setShowPaymentModal(false);
    setCurrentBooking(null);
    alert('Бронирование успешно завершено! Организатор свяжется с вами в ближайшее время.');
  };

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % tour.images.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + tour.images.length) % tour.images.length);
  };

  const getEarliestDate = () => tour.dates.find(date => date.status === 'available');
  const earliestDate = getEarliestDate();
  const tourDuration = earliestDate ? Math.ceil((new Date(earliestDate.endDate).getTime() - new Date(earliestDate.startDate).getTime()) / (1000 * 60 * 60 * 24)) : 0;
  const availableDates = tour.dates.filter(date => date.status === 'available' && date.currentParticipants < date.maxParticipants);
  const totalCurrentParticipants = tour.dates.reduce((sum, date) => sum + date.currentParticipants, 0);
  const totalMaxParticipants = tour.dates.reduce((sum, date) => sum + date.maxParticipants, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span className="hidden sm:inline">Назад к турам</span>
            </button>
            
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-600 hover:text-red-500 transition-colors rounded-full hover:bg-red-50">
                <Heart className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-blue-500 transition-colors rounded-full hover:bg-blue-50">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Image Gallery */}
        <div className="mb-8">
          <div className="relative">
            <div className="relative w-full h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden bg-gray-200">
              <img
                src={tour.images[activeImageIndex]}
                alt={tour.title}
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=800';
                }}
              />
            </div>
            
            {/* Navigation arrows */}
            {tour.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all"
                >
                  <ChevronLeft className="h-6 w-6 text-gray-800" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all"
                >
                  <ChevronRight className="h-6 w-6 text-gray-800" />
                </button>
              </>
            )}

            {/* Image counter */}
            <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
              {activeImageIndex + 1} / {tour.images.length}
            </div>

            {/* View all photos button */}
            <button
              onClick={() => setShowFullGallery(true)}
              className="absolute bottom-4 left-4 bg-white bg-opacity-90 hover:bg-opacity-100 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            >
              Все фото ({tour.images.length})
            </button>
          </div>

          {/* Thumbnail strip */}
          {tour.images.length > 1 && (
            <div className="flex space-x-2 mt-4 overflow-x-auto pb-2">
              {tour.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    index === activeImageIndex ? 'border-blue-500' : 'border-transparent'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${tour.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=800';
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-8">
            {/* Title and Basic Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">{tour.title}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-blue-500" />
                      <span>{tour.destination}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-green-500" />
                      <span>
                        {tour.dates.length > 1 
                          ? `${tour.dates.length} дат доступно`
                          : earliestDate 
                            ? `${new Date(earliestDate.startDate).toLocaleDateString('ru-RU')} - ${new Date(earliestDate.endDate).toLocaleDateString('ru-RU')}`
                            : 'Даты уточняются'
                        }
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-orange-500" />
                      <span>{tourDuration} дней</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(tour.difficulty)}`}>
                    {getDifficultyText(tour.difficulty)}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {tour.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm border border-blue-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Users className="h-5 w-5 text-blue-500" />
                  </div>
                  <p className="text-sm text-gray-600">Участники</p>
                  <p className="font-semibold">{totalCurrentParticipants}/{totalMaxParticipants}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Clock className="h-5 w-5 text-green-500" />
                  </div>
                  <p className="text-sm text-gray-600">Длительность</p>
                  <p className="font-semibold">{tourDuration} дней</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <DollarSign className="h-5 w-5 text-orange-500" />
                  </div>
                  <p className="text-sm text-gray-600">Цена</p>
                  <p className="font-semibold">от {Math.min(...tour.dates.map(d => d.price)).toLocaleString()} ₽</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Star className="h-5 w-5 text-yellow-500" />
                  </div>
                  <p className="text-sm text-gray-600">Рейтинг</p>
                  <p className="font-semibold">{tour.organizer.rating}</p>
                </div>
              </div>
            </div>

            {/* Available Dates */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                Доступные даты
              </h3>
              <div className="space-y-4">
                {tour.dates.map((date) => (
                  <div
                    key={date.id}
                    className={`border rounded-xl p-4 ${
                      date.status === 'available' && date.currentParticipants < date.maxParticipants
                        ? 'border-green-200 bg-green-50'
                        : date.status === 'full' || date.currentParticipants >= date.maxParticipants
                        ? 'border-red-200 bg-red-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className="font-medium text-gray-900">
                            {new Date(date.startDate).toLocaleDateString('ru-RU', {
                              day: 'numeric',
                              month: 'long'
                            })} - {new Date(date.endDate).toLocaleDateString('ru-RU', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </span>
                          <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${
                            date.status === 'available' && date.currentParticipants < date.maxParticipants
                              ? 'bg-green-100 text-green-800'
                              : date.status === 'full' || date.currentParticipants >= date.maxParticipants
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {date.status === 'available' && date.currentParticipants < date.maxParticipants
                              ? 'Доступно'
                              : date.status === 'full' || date.currentParticipants >= date.maxParticipants
                              ? 'Мест нет'
                              : 'Отменено'
                            }
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>
                            {Math.ceil((new Date(date.endDate).getTime() - new Date(date.startDate).getTime()) / (1000 * 60 * 60 * 24))} дней
                          </span>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            <span>{date.currentParticipants}/{date.maxParticipants} мест</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          {date.price.toLocaleString()} ₽
                        </p>
                        <p className="text-sm text-gray-500">за человека</p>
                      </div>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Заполненность</span>
                        <span>{Math.round((date.currentParticipants / date.maxParticipants) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            date.currentParticipants / date.maxParticipants > 0.8 ? 'bg-red-500' :
                            date.currentParticipants / date.maxParticipants > 0.6 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${(date.currentParticipants / date.maxParticipants) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Info className="h-5 w-5 mr-2 text-blue-500" />
                Описание тура
              </h2>
              <p className="text-gray-700 leading-relaxed">{tour.description}</p>
            </div>

            {/* What's Included / Excluded */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Check className="h-5 w-5 mr-2 text-green-500" />
                  Включено в стоимость
                </h3>
                <ul className="space-y-3">
                  {tourIncludes.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-4 w-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{item}</span>
                    </li>
                  ))}
                  {tour.meals && (
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">Питание по программе</span>
                    </li>
                  )}
                </ul>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <X className="h-5 w-5 mr-2 text-red-500" />
                  Не включено в стоимость
                </h3>
                <ul className="space-y-3">
                  {tourExcludes.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <X className="h-4 w-4 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{item}</span>
                    </li>
                  ))}
                  {!tour.meals && (
                    <li className="flex items-start">
                      <X className="h-4 w-4 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">Питание</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* Tour Details */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Детали тура</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                    <Car className="h-5 w-5 mr-2 text-blue-500" />
                    Транспорт
                  </h4>
                  <div className="space-y-2">
                    {tour.transport.map((item, index) => (
                      <div key={index} className="flex items-center p-2 bg-blue-50 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        <span className="text-gray-700 capitalize">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                    <Home className="h-5 w-5 mr-2 text-green-500" />
                    Проживание
                  </h4>
                  <div className="space-y-2">
                    {tour.accommodation.map((item, index) => (
                      <div key={index} className="flex items-center p-2 bg-green-50 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-gray-700 capitalize">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-orange-50 rounded-xl border border-orange-200">
                <h4 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
                  <Utensils className="h-5 w-5 mr-2 text-orange-500" />
                  Питание
                </h4>
                <p className="text-gray-700">
                  {tour.meals ? 
                    'Трёхразовое питание включено в стоимость тура. Учитываются диетические предпочтения участников.' : 
                    'Питание организуется самостоятельно. В программе предусмотрены остановки в кафе и ресторанах.'
                  }
                </p>
              </div>
            </div>

            {/* Participants */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Участники ({mockParticipants.length} из {tour.maxParticipants})
              </h3>
              <div className="space-y-4">
                {mockParticipants.map((participant) => (
                  <div key={participant.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center">
                      <img
                        src={participant.avatar}
                        alt={participant.name}
                        className="h-12 w-12 rounded-full object-cover mr-4"
                      />
                      <div>
                        <div className="flex items-center">
                          <h4 className="font-medium text-gray-900">{participant.name}</h4>
                          {participant.verified && (
                            <Shield className="h-4 w-4 text-blue-500 ml-2" />
                          )}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Star className="h-3 w-3 text-yellow-400 mr-1" />
                          <span>{participant.rating}</span>
                          <span className="mx-2">•</span>
                          <span>{participant.location}</span>
                        </div>
                      </div>
                    </div>
                    <button className="p-2 text-gray-600 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors">
                      <MessageCircle className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                
                {/* Empty slots */}
                {Array.from({ length: tour.maxParticipants - tour.currentParticipants }, (_, index) => (
                  <div key={`empty-${index}`} className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-xl">
                    <div className="h-12 w-12 rounded-full bg-gray-200 mr-4 flex items-center justify-center">
                      <Users className="h-6 w-6 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">Свободное место</p>
                      <p className="text-sm text-gray-400">Ждём нового участника</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Sticky Sidebar Container */}
            <div className="sticky top-24 space-y-6">
              {/* Price and Join */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border">
                <div className="text-center mb-6">
                  <p className="text-3xl font-bold text-gray-900 mb-1">
                    {tour.price.toLocaleString()} ₽
                  </p>
                  <p className="text-gray-600">за человека</p>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Свободных мест:</span>
                    <span className="font-semibold text-green-600">
                      {totalMaxParticipants - totalCurrentParticipants}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Длительность:</span>
                    <span className="font-semibold">{tourDuration} дней</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Начало тура:</span>
                    <span className="font-semibold">
                      {earliestDate ? new Date(earliestDate.startDate).toLocaleDateString('ru-RU') : 'Уточняется'}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleJoinTour}
                    disabled={availableDates.length === 0}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {availableDates.length === 0 ? 'Мест нет' : 'Забронировать место'}
                  </button>
                  
                  <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                    Написать организатору
                  </button>
                </div>
              </div>

              {/* Organizer */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Организатор</h3>
                <div className="flex items-center mb-4">
                  <img
                    src={tour.organizer.avatar}
                    alt={tour.organizer.name}
                    className="h-16 w-16 rounded-full object-cover mr-4"
                  />
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <h4 className="font-semibold text-gray-900">{tour.organizer.name}</h4>
                      {tour.organizer.verified && (
                        <Shield className="h-4 w-4 text-blue-500 ml-2" />
                      )}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="font-medium">{tour.organizer.rating}</span>
                      <span className="mx-1">•</span>
                      <span>{tour.organizer.reviewsCount} отзывов</span>
                    </div>
                    <p className="text-sm text-gray-600">{tour.organizer.location}</p>
                  </div>
                </div>
                
                {tour.organizer.bio && (
                  <p className="text-gray-700 text-sm mb-4 leading-relaxed">{tour.organizer.bio}</p>
                )}
                
                <button className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                  Посмотреть профиль
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Gallery Modal */}
      {showFullGallery && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50">
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setShowFullGallery(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <X className="h-8 w-8" />
            </button>
            
            <div className="relative">
              <img
                src={tour.images[activeImageIndex]}
                alt={tour.title}
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
              />
              
              {tour.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-40 rounded-full p-3 text-white transition-all"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-40 rounded-full p-3 text-white transition-all"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
              
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 text-white px-4 py-2 rounded-full">
                {activeImageIndex + 1} / {tour.images.length}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      <BookingModal
        tour={tour}
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        onBookingComplete={handleBookingComplete}
      />

      {/* Payment Modal */}
      {currentBooking && (
        <PaymentModal
          booking={currentBooking}
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onPaymentComplete={handlePaymentComplete}
        />
      )}
    </div>
  );
};

export default TourDetailPage;