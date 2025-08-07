import React, { useState } from 'react';
import { X, Calendar, Users, CreditCard, Phone, AlertTriangle, Check } from 'lucide-react';
import { Tour, TourDate, BookingRequest } from '../types';

interface BookingModalProps {
  tour: Tour;
  isOpen: boolean;
  onClose: () => void;
  onBookingComplete: (booking: BookingRequest) => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ tour, isOpen, onClose, onBookingComplete }) => {
  const [selectedDateId, setSelectedDateId] = useState<string>('');
  const [participantsCount, setParticipantsCount] = useState(1);
  const [contactInfo, setContactInfo] = useState({
    phone: '',
    emergencyContact: '',
    specialRequests: ''
  });
  const [currentStep, setCurrentStep] = useState<'dates' | 'details' | 'confirmation'>('dates');

  if (!isOpen) return null;

  const selectedDate = tour.dates.find(date => date.id === selectedDateId);
  const availableDates = tour.dates.filter(date => date.status === 'available' && date.currentParticipants < date.maxParticipants);
  const totalPrice = selectedDate ? selectedDate.price * participantsCount : 0;
  const maxAvailableParticipants = selectedDate ? selectedDate.maxParticipants - selectedDate.currentParticipants : 0;

  const handleDateSelect = (dateId: string) => {
    setSelectedDateId(dateId);
    setCurrentStep('details');
  };

  const handleDetailsSubmit = () => {
    if (!contactInfo.phone || !contactInfo.emergencyContact) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }
    setCurrentStep('confirmation');
  };

  const handleBookingConfirm = () => {
    if (!selectedDate) return;

    const booking: BookingRequest = {
      tourId: tour.id,
      tourDateId: selectedDate.id,
      participantsCount,
      totalPrice,
      contactInfo
    };

    onBookingComplete(booking);
  };

  const getDurationDays = (startDate: string, endDate: string) => {
    return Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Бронирование тура</h2>
              <p className="text-gray-600 mt-1">{tour.title}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center mt-6 space-x-4">
            <div className={`flex items-center ${currentStep === 'dates' ? 'text-blue-600' : currentStep === 'details' || currentStep === 'confirmation' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === 'dates' ? 'bg-blue-100 text-blue-600' : 
                currentStep === 'details' || currentStep === 'confirmation' ? 'bg-green-100 text-green-600' : 
                'bg-gray-100 text-gray-400'
              }`}>
                {currentStep === 'details' || currentStep === 'confirmation' ? <Check className="h-4 w-4" /> : '1'}
              </div>
              <span className="ml-2 text-sm font-medium">Выбор даты</span>
            </div>
            
            <div className={`w-8 h-0.5 ${currentStep === 'details' || currentStep === 'confirmation' ? 'bg-green-600' : 'bg-gray-300'}`}></div>
            
            <div className={`flex items-center ${currentStep === 'details' ? 'text-blue-600' : currentStep === 'confirmation' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === 'details' ? 'bg-blue-100 text-blue-600' : 
                currentStep === 'confirmation' ? 'bg-green-100 text-green-600' : 
                'bg-gray-100 text-gray-400'
              }`}>
                {currentStep === 'confirmation' ? <Check className="h-4 w-4" /> : '2'}
              </div>
              <span className="ml-2 text-sm font-medium">Детали</span>
            </div>
            
            <div className={`w-8 h-0.5 ${currentStep === 'confirmation' ? 'bg-green-600' : 'bg-gray-300'}`}></div>
            
            <div className={`flex items-center ${currentStep === 'confirmation' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === 'confirmation' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
              }`}>
                3
              </div>
              <span className="ml-2 text-sm font-medium">Подтверждение</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Step 1: Date Selection */}
          {currentStep === 'dates' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Выберите дату тура</h3>
              
              {availableDates.length === 0 ? (
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                  <p className="text-gray-600">К сожалению, на данный момент нет доступных дат для этого тура.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {availableDates.map((date) => (
                    <div
                      key={date.id}
                      onClick={() => handleDateSelect(date.id)}
                      className="border border-gray-200 rounded-xl p-4 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <Calendar className="h-5 w-5 text-blue-500 mr-2" />
                            <span className="font-medium text-gray-900">
                              {formatDate(date.startDate)} - {formatDate(date.endDate)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>{getDurationDays(date.startDate, date.endDate)} дней</span>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              <span>{date.currentParticipants}/{date.maxParticipants} мест</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-gray-900">
                            {date.price.toLocaleString()} ₽
                          </p>
                          <p className="text-sm text-gray-500">за человека</p>
                        </div>
                      </div>
                      
                      {/* Availability indicator */}
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
              )}
            </div>
          )}

          {/* Step 2: Details */}
          {currentStep === 'details' && selectedDate && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h4 className="font-medium text-blue-900 mb-2">Выбранная дата</h4>
                <p className="text-blue-800">
                  {formatDate(selectedDate.startDate)} - {formatDate(selectedDate.endDate)}
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  {getDurationDays(selectedDate.startDate, selectedDate.endDate)} дней • {selectedDate.price.toLocaleString()} ₽ за человека
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Количество участников
                </label>
                <select
                  value={participantsCount}
                  onChange={(e) => setParticipantsCount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {Array.from({ length: maxAvailableParticipants }, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'человек' : num < 5 ? 'человека' : 'человек'}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-500 mt-1">
                  Доступно мест: {maxAvailableParticipants}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Телефон для связи *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="tel"
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                    placeholder="+7 (999) 123-45-67"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Контакт для экстренной связи *
                </label>
                <input
                  type="text"
                  value={contactInfo.emergencyContact}
                  onChange={(e) => setContactInfo({ ...contactInfo, emergencyContact: e.target.value })}
                  placeholder="Имя и телефон близкого человека"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Особые пожелания
                </label>
                <textarea
                  value={contactInfo.specialRequests}
                  onChange={(e) => setContactInfo({ ...contactInfo, specialRequests: e.target.value })}
                  placeholder="Диетические ограничения, медицинские особенности, другие пожелания..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Стоимость за человека:</span>
                  <span className="font-medium">{selectedDate.price.toLocaleString()} ₽</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Количество участников:</span>
                  <span className="font-medium">{participantsCount}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Итого:</span>
                    <span className="text-xl font-bold text-blue-600">{totalPrice.toLocaleString()} ₽</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setCurrentStep('dates')}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Назад
                </button>
                <button
                  onClick={handleDetailsSubmit}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Продолжить
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {currentStep === 'confirmation' && selectedDate && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Подтверждение бронирования</h3>
                <p className="text-gray-600">Проверьте данные перед переходом к оплате</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Детали тура</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Тур:</span>
                      <span className="font-medium">{tour.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Даты:</span>
                      <span className="font-medium">
                        {formatDate(selectedDate.startDate)} - {formatDate(selectedDate.endDate)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Участников:</span>
                      <span className="font-medium">{participantsCount}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Контактная информация</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Телефон:</span>
                      <span className="font-medium">{contactInfo.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Экстренный контакт:</span>
                      <span className="font-medium">{contactInfo.emergencyContact}</span>
                    </div>
                    {contactInfo.specialRequests && (
                      <div>
                        <span className="text-gray-600">Особые пожелания:</span>
                        <p className="font-medium mt-1">{contactInfo.specialRequests}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Итого к оплате:</span>
                    <span className="text-2xl font-bold text-blue-600">{totalPrice.toLocaleString()} ₽</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Важная информация:</p>
                    <ul className="space-y-1 text-blue-700">
                      <li>• После подтверждения у вас будет 24 часа для оплаты</li>
                      <li>• Бронирование без оплаты будет автоматически отменено</li>
                      <li>• Организатор свяжется с вами в течение 2 часов</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setCurrentStep('details')}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Назад
                </button>
                <button
                  onClick={handleBookingConfirm}
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <CreditCard className="h-5 w-5 mr-2" />
                  Перейти к оплате
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;