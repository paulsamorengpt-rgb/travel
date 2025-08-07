import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import AuthForm from './components/AuthForm';
import HomePage from './pages/HomePage';
import TourDetailPage from './pages/TourDetailPage';
import { Tour } from './types';

const AppContent: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const { user } = useAuth();

  const handleMenuToggle = () => {
    if (window.innerWidth >= 1024) {
      // На десктопе переключаем сворачивание
      setSidebarCollapsed(!sidebarCollapsed);
    } else {
      // На мобильных устройствах переключаем видимость
      setSidebarOpen(!sidebarOpen);
    }
  };

  const handlePageChange = (page: string) => {
    if (page === 'auth') {
      setShowAuthForm(true);
      return;
    }
    
    if ((page === 'profile' || page === 'create-tour' || page === 'my-tours' || page === 'messages') && !user) {
      setShowAuthForm(true);
      return;
    }
    
    setCurrentPage(page);
    setSidebarOpen(false);
    setSelectedTour(null);
  };

  const handleTourClick = (tour: Tour) => {
    setSelectedTour(tour);
    setCurrentPage('tour-detail');
  };

  const handleBackFromTour = () => {
    setSelectedTour(null);
    setCurrentPage('home');
  };

  const renderCurrentPage = () => {
    if (selectedTour && currentPage === 'tour-detail') {
      return <TourDetailPage tour={selectedTour} onBack={handleBackFromTour} />;
    }

    switch (currentPage) {
      case 'home':
      case 'tours':
        return <HomePage onTourClick={handleTourClick} />;
      case 'profile':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Мой профиль</h2>
            <p className="text-gray-600">Страница профиля в разработке</p>
          </div>
        );
      case 'create-tour':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Создание тура</h2>
            <p className="text-gray-600">Форма создания тура в разработке</p>
          </div>
        );
      case 'my-tours':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Мои туры</h2>
            <p className="text-gray-600">Список ваших туров в разработке</p>
          </div>
        );
      case 'messages':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Сообщения</h2>
            <p className="text-gray-600">Система сообщений в разработке</p>
          </div>
        );
      case 'reviews':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Отзывы</h2>
            <p className="text-gray-600">Страница отзывов в разработке</p>
          </div>
        );
      case 'settings':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Настройки</h2>
            <p className="text-gray-600">Страница настроек в разработке</p>
          </div>
        );
      default:
        return <HomePage onTourClick={handleTourClick} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onMenuToggle={handleMenuToggle}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        sidebarCollapsed={sidebarCollapsed}
      />
      
      <div className="flex">
        <Sidebar
          isOpen={sidebarOpen}
          isCollapsed={sidebarCollapsed}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
        
        <main className={`flex-1 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'} p-6 transition-all duration-300`}>
          <div className="max-w-7xl mx-auto">
            {renderCurrentPage()}
          </div>
        </main>
      </div>
      
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {showAuthForm && (
        <AuthForm onClose={() => setShowAuthForm(false)} />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;