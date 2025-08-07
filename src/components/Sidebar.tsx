import React from 'react';
import { 
  Home, 
  Map, 
  User, 
  MessageCircle, 
  Settings, 
  Star,
  Calendar,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, isCollapsed, currentPage, onPageChange }) => {
  const menuItems = [
    { id: 'home', label: 'Главная', icon: Home },
    { id: 'tours', label: 'Туры', icon: Map },
    { id: 'my-tours', label: 'Мои туры', icon: Calendar },
    { id: 'messages', label: 'Сообщения', icon: MessageCircle },
    { id: 'profile', label: 'Профиль', icon: User },
    { id: 'reviews', label: 'Отзывы', icon: Star },
    { id: 'settings', label: 'Настройки', icon: Settings },
  ];

  return (
    <aside className={`fixed inset-y-0 left-0 z-30 ${isCollapsed ? 'w-16' : 'w-64'} bg-white shadow-lg transform transition-all duration-300 ease-in-out ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    } lg:translate-x-0 lg:static lg:inset-0`}>
      <div className="flex flex-col h-full">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className={`flex items-center flex-shrink-0 px-4 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Map className="h-5 w-5 text-white" />
                </div>
              </div>
              {!isCollapsed && (
                <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">TravelMate</p>
                </div>
              )}
            </div>
          </div>
          
          <nav className="mt-8 flex-1 px-2 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`group flex items-center w-full px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    currentPage === item.id
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } ${isCollapsed ? 'justify-center' : ''}`}
                  title={isCollapsed ? item.label : ''}
                >
                  <Icon className={`mr-3 h-5 w-5 ${
                    currentPage === item.id ? 'text-blue-500' : 'text-gray-400'
                  } ${isCollapsed ? 'mr-0' : ''}`} />
                  {!isCollapsed && item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;