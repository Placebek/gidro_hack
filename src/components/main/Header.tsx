// components/layout/Header.tsx
'use client';

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, LogOut, User, Settings, ChevronDown, Loader2 } from 'lucide-react';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const router = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUsername = localStorage.getItem('username');
    const savedRole = localStorage.getItem('role');

    if (token && savedUsername) {
      setIsLoggedIn(true);
      setUsername(savedUsername);
      setRole(savedRole || 'Пользователь');
    }
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    setIsDropdownOpen(false);
    router('/login');
  };

  if (isLoading) {
    return (
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50 flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-200 z-50 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Логотип */}
        <Link to="/" className="flex items-center gap-4 group">
          <div className="w-12 h-12 bg-linear-to-br from-cyan-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
            <svg
              className="w-7 h-7 text-white"
              viewBox="0 0 576 512"
              fill="currentColor"
            >
              <path d="M269.5 69.9c11.1-7.9 25.9-7.9 37 0C329 85.4 356.5 96 384 96c26.9 0 55.4-10.8 77.4-26.1l0 0c11.9-8.5 28.1-7.8 39.2 1.7c14.4 11.9 32.5 21 50.6 25.2c17.2 4 27.9 21.2 23.9 38.4s-21.2 27.9-38.4 23.9c-24.5-5.7-44.9-16.5-58.2-25C449.5 149.7 417 160 384 160c-31.9 0-60.6-9.9-80.4-18.9c-5.8-2.7-11.1-5.3-15.6-7.7c-4.5 2.4-9.7 5.1-15.6 7.7c-19.8 9-48.5 18.9-80.4 18.9c-33 0-65.5-10.3-94.5-25.8c-13.4 8.4-33.7 19.3-58.2 25c-17.2 4-34.4-6.7-38.4-23.9s6.7-34.4 23.9-38.4C42.8 92.6 61 83.5 75.3 71.6c11.1-9.5 27.3-10.1 39.2-1.7l0 0C136.7 85.2 165.1 96 192 96c27.5 0 55-10.6 77.5-26.1zm37 288C329 373.4 356.5 384 384 384c26.9 0 55.4-10.8 77.4-26.1l0 0c11.9-8.5 28.1-7.8 39.2 1.7c14.4 11.9 32.5 21 50.6 25.2c17.2 4 27.9 21.2 23.9 38.4s-21.2 27.9-38.4 23.9c-24.5-5.7-44.9-16.5-58.2-25C449.5 437.7 417 448 384 448c-31.9 0-60.6-9.9-80.4-18.9c-5.8-2.7-11.1-5.3-15.6-7.7c-4.5 2.4-9.7 5.1-15.6 7.7c-19.8 9-48.5 18.9-80.4 18.9c-33 0-65.5-10.3-94.5-25.8c-13.4 8.4-33.7 19.3-58.2 25c-17.2 4-34.4-6.7-38.4-23.9s6.7-34.4 23.9-38.4c18.1-4.2 36.2-13.3 50.6-25.2c11.1-9.4 27.3-10.1 39.2-1.7l0 0C136.7 373.2 165.1 384 192 384c27.5 0 55-10.6 77.5-26.1c11.1-7.9 25.9-7.9 37 0zm0-144C329 229.4 356.5 240 384 240c26.9 0 55.4-10.8 77.4-26.1l0 0c11.9-8.5 28.1-7.8 39.2 1.7c14.4 11.9 32.5 21 50.6 25.2c17.2 4 27.9 21.2 23.9 38.4s-21.2 27.9-38.4 23.9c-24.5-5.7-44.9-16.5-58.2-25C449.5 293.7 417 304 384 304c-31.9 0-60.6-9.9-80.4-18.9c-5.8-2.7-11.1-5.3-15.6-7.7c-4.5 2.4-9.7 5.1-15.6 7.7c-19.8 9-48.5 18.9-80.4 18.9c-33 0-65.5-10.3-94.5-25.8c-13.4 8.4-33.7 19.3-58.2 25c-17.2 4-34.4-6.7-38.4-23.9s6.7-34.4 23.9-38.4c18.1-4.2 36.2-13.3 50.6-25.2c11.1-9.5 27.3-10.1 39.2-1.7l0 0C136.7 229.2 165.1 240 192 240c27.5 0 55-10.6 77.5-26.1c11.1-7.9 25.9-7.9 37 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">ГидроАтлас</h1>
            <p className="text-xs text-gray-500">Водные ресурсы Казахстана</p>
          </div>
        </Link>

        {/* Навигация */}
        <nav className="hidden md:flex items-center gap-10">
          <Link to="/map" className="text-cyan-600 font-semibold hover:text-cyan-700 transition">
            Карта
          </Link>
          <Link to="/objects" className="text-gray-600 hover:text-cyan-600 transition font-medium">
            Объекты
          </Link>
          <Link to="/flood-predictors" className="text-gray-600 hover:text-cyan-600 transition font-medium">
            Прогноз паводков
          </Link>
        </nav>

        {/* Правая часть: Вход / Профиль */}
        <div className="relative">
          {isLoggedIn ? (
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 px-5 py-3 bg-linear-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
            >
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <span className="font-medium">{username}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl font-medium"
            >
              <LogIn className="w-5 h-5" />
              Войти
            </Link>
          )}

          {/* Выпадающее меню */}
          {isDropdownOpen && isLoggedIn && (
            <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-in slide-in-from-top-2 duration-200">
              <div className="p-4 bg-linear-to-r from-cyan-500 to-blue-600 text-white">
                <p className="font-semibold">{username}</p>
                <p className="text-sm opacity-90 capitalize">{role}</p>
              </div>
              <div className="py-2">
                <Link
                  to="/profile"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition"
                >
                  <User className="w-5 h-5 text-gray-600" />
                  <span>Мой профиль</span>
                </Link>
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    alert('Настройки в разработке');
                  }}
                  className="w-full flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition text-left"
                >
                  <Settings className="w-5 h-5 text-gray-600" />
                  <span>Настройки</span>
                </button>
                <hr className="my-2 border-gray-200" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-5 py-3 hover:bg-red-50 text-red-600 transition"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Выйти</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}