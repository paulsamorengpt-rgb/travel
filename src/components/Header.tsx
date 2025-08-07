import React, { useState } from 'react';
import { Menu, X, Search, User, Bell, Plus, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onMenuToggle: () => void;
  currentPage: string;
  onPageChange: (page: string) => void;
  sidebarCollapsed?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, currentPage, onPageChange, sidebarCollapsed }) => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              onClick={onMenuToggle}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              title={sidebarCollapsed ? "Развернуть меню" : "Свернуть меню"}
            >
              {sidebarCollapsed ? <Menu className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <div className="ml-4">
              <h1 className="text-xl font-bold text-gray-900">TravelMate</h1>
            </div>
          </div>

          <div className="hidden md:flex items-center flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Поиск туров..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <button
                  onClick={() => onPageChange('create-tour')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Создать тур
                </button>
                
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md">
                  <Bell className="h-6 w-6" />
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100"
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-8 w-8 p-1 bg-gray-200 rounded-full" />
                    )}
                    <span className="hidden md:block text-sm font-medium text-gray-700">
                      {user.name}
                    </span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <button
                        onClick={() => {
                          onPageChange('profile');
                          setShowUserMenu(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Мой профиль
                      </button>
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="h-4 w-4 inline mr-2" />
                        Выйти
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <button
                onClick={() => onPageChange('auth')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Войти
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;