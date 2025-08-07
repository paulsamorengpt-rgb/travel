import React, { useState } from 'react';
import { X, CreditCard, Shield, Lock, Check, AlertCircle } from 'lucide-react';
import { BookingRequest } from '../types';

interface PaymentModalProps {
  booking: BookingRequest;
  isOpen: boolean;
  onClose: () => void;
  onPaymentComplete: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ booking, isOpen, onClose, onPaymentComplete }) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'sbp'>('card');
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'method' | 'details' | 'processing' | 'success'>('method');

  if (!isOpen) return null;

  const handleCardNumberChange = (value: string) => {
    // Remove all non-digits and format with spaces
    const digits = value.replace(/\D/g, '');
    const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardData({ ...cardData, number: formatted });
  };

  const handleExpiryChange = (value: string) => {
    // Format as MM/YY
    const digits = value.replace(/\D/g, '');
    let formatted = digits;
    if (digits.length >= 2) {
      formatted = digits.slice(0, 2) + '/' + digits.slice(2, 4);
    }
    setCardData({ ...cardData, expiry: formatted });
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    setPaymentStep('processing');
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setPaymentStep('success');
    setIsProcessing(false);
    
    // Auto close after success
    setTimeout(() => {
      onPaymentComplete();
    }, 2000);
  };

  const isCardValid = cardData.number.replace(/\s/g, '').length === 16 && 
                     cardData.expiry.length === 5 && 
                     cardData.cvv.length === 3 && 
                     cardData.name.length > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Оплата тура</h2>
            {paymentStep !== 'processing' && (
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            )}
          </div>
        </div>

        <div className="p-6">
          {/* Payment Method Selection */}
          {paymentStep === 'method' && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-medium text-gray-900 mb-2">К оплате</h3>
                <p className="text-2xl font-bold text-blue-600">{booking.totalPrice.toLocaleString()} ₽</p>
                <p className="text-sm text-gray-600 mt-1">
                  {booking.participantsCount} {booking.participantsCount === 1 ? 'участник' : 'участника'}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Способ оплаты</h3>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'card')}
                      className="mr-3"
                    />
                    <CreditCard className="h-6 w-6 text-blue-600 mr-3" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Банковская карта</p>
                      <p className="text-sm text-gray-600">Visa, MasterCard, МИР</p>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="sbp"
                      checked={paymentMethod === 'sbp'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'sbp')}
                      className="mr-3"
                    />
                    <div className="h-6 w-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded mr-3 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">СБП</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Система быстрых платежей</p>
                      <p className="text-sm text-gray-600">Оплата через банковское приложение</p>
                    </div>
                  </label>
                </div>
              </div>

              <button
                onClick={() => setPaymentStep('details')}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                Продолжить
              </button>
            </div>
          )}

          {/* Payment Details */}
          {paymentStep === 'details' && (
            <div className="space-y-6">
              {paymentMethod === 'card' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Номер карты
                    </label>
                    <input
                      type="text"
                      value={cardData.number}
                      onChange={(e) => handleCardNumberChange(e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Срок действия
                      </label>
                      <input
                        type="text"
                        value={cardData.expiry}
                        onChange={(e) => handleExpiryChange(e.target.value)}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        value={cardData.cvv}
                        onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, '') })}
                        placeholder="123"
                        maxLength={3}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Имя держателя карты
                    </label>
                    <input
                      type="text"
                      value={cardData.name}
                      onChange={(e) => setCardData({ ...cardData, name: e.target.value.toUpperCase() })}
                      placeholder="IVAN PETROV"
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    />
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-xl font-bold">СБП</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Оплата через СБП</h3>
                  <p className="text-gray-600 mb-4">
                    После нажатия кнопки "Оплатить" вы будете перенаправлены в ваше банковское приложение
                  </p>
                </div>
              )}

              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-green-600 mr-3" />
                  <div className="text-sm text-green-800">
                    <p className="font-medium">Безопасная оплата</p>
                    <p>Ваши данные защищены SSL-шифрованием</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Итого к оплате:</span>
                  <span className="text-xl font-bold text-blue-600">{booking.totalPrice.toLocaleString()} ₽</span>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setPaymentStep('method')}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Назад
                </button>
                <button
                  onClick={handlePayment}
                  disabled={paymentMethod === 'card' && !isCardValid}
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Оплатить {booking.totalPrice.toLocaleString()} ₽
                </button>
              </div>
            </div>
          )}

          {/* Processing */}
          {paymentStep === 'processing' && (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Обработка платежа</h3>
              <p className="text-gray-600">Пожалуйста, не закрывайте окно</p>
            </div>
          )}

          {/* Success */}
          {paymentStep === 'success' && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Оплата прошла успешно!</h3>
              <p className="text-gray-600 mb-4">
                Ваше бронирование подтверждено. Организатор свяжется с вами в ближайшее время.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-green-800">
                    <p>Детали бронирования отправлены на вашу электронную почту</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;