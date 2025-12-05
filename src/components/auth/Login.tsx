// src/pages/Login.tsx
import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setRole, user } = useAuthStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Простейшая проверка
    if (email && password) {
      // Здесь можно вызвать API для логина
      console.log("Login:", { email, password });
      setRole("expert"); // пример: после логина делаем роль expert
    }
  };

  if (user) return <p className="text-center mt-10">Вы уже вошли!</p>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Вход в ГидроАтлас</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Введите email"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium" htmlFor="password">
              Пароль
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition font-medium"
          >
            Войти
          </button>
        </form>
        <p className="text-center text-xs text-gray-500 mt-4">
          Все права защищены © 2025 ГидроАтлас
        </p>
      </div>
    </div>
  );
}
