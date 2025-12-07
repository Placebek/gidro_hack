// app/login/page.tsx  (или src/pages/Login.tsx)
'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, User, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:8000/api/auth/login', {
        username,
        password,
      });

      const { access_token, role, username: name } = res.data;

      // Сохраняем в localStorage
      localStorage.setItem('token', access_token);
      localStorage.setItem('role', role);
      localStorage.setItem('username', name || username);

      // Небольшая задержка, чтобы пользователь увидел успех
      setTimeout(() => {
        router('/objects');
      }, 800);
    } catch (err: any) {
      setError('Неверный логин или пароль');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Красивый фон с волнами */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-cyan-500 via-blue-600 to-indigo-700" />
        <svg
          className="absolute bottom-0 left-0 w-full h-96 text-cyan-400/20"
          preserveAspectRatio="none"
          viewBox="0 0 1440 320"
        >
          <path
            fill="currentColor"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,144C960,149,1056,139,1152,122.7C1248,107,1344,85,1392,74.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
        <svg
          className="absolute top-20 right-0 w-96 h-96 text-blue-400/10"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="currentColor"
            d="M44.7,-76.6C58.8,-69.5,71.6,-59.7,78.3,-46.3C85.1,-32.9,85.8,-19.5,82.5,-6.8C79.2,5.9,71.9,18.2,64.9,29.5C57.9,40.8,51.2,51.1,40.6,59.8C30,68.5,15.5,75.6,0.8,74.5C-13.9,73.4,-27.8,64.1,-40.6,55.3C-53.4,46.5,-65.1,38.2,-71.5,27.1C-77.9,16,-79,2.2,-77.1,-11.3C-75.2,-24.8,-70.3,-37.8,-62.3,-48.8C-54.3,-59.8,-43.2,-68.8,-31.3,-75.3C-19.4,-81.8,-6.5,-85.8,6.5,-85.1C19.5,-84.4,39,-79,44.7,-76.6Z"
            transform="translate(100 100)"
          />
        </svg>
      </div>

      {/* Форма входа */}
      <div className="relative flex items-center justify-center min-h-screen px-4">
        <div className="bg-white/95 backdrop-blur-lg p-10 rounded-20 rounded-3xl shadow-2xl w-full max-w-md border border-white/20">
          <div className="text-center mb-10">
            <h1 className="text-5xl font-bold bg-linear-to-r from-cyan-600 to-blue-800 bg-clip-text text-transparent">
              ГидроАтлас
            </h1>
            <p className="text-gray-600 mt-3 text-lg">Вход в систему</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Логин
              </label>
              <div className="relative mt-2">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Введите логин"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Пароль */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Пароль
              </label>
              <div className="relative mt-2">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Введите пароль"
                  className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Кнопка */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 bg-linear-to-r from-cyan-600 to-blue-700 text-white font-bold text-lg rounded-xl hover:from-cyan-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Вход...
                </>
              ) : (
                'Войти в систему'
              )}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-8">
            © 2025 ГидроАтлас • Все права защищены
          </p>
        </div>
      </div>
    </>
  );
}