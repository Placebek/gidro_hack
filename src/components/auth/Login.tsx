// src/pages/Login.tsx
import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";



export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setRole, user } = useAuthStore();
  const [show, setShow] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      console.log("Login:", { email, password });
      setRole("expert");
    }
  };

  if (user) return <p className="text-center mt-10">Вы уже вошли!</p>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        {/* Градиентный заголовок */}
        <h1 className="text-6xl font-bold text-center my-6 bg-linear-to-r from-cyan-600 to-blue-800 bg-clip-text text-transparent">
          Вход
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 pl-3  font-medium text-black-500 font-bold" htmlFor="email">
              Email
            </label>
            <div className="relative">
              {/* Иконка внутри input */}
              <Mail className="w-5 h-5 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />

              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Введите email"
                className="w-full border border-gray-300 rounded-md p-2 pl-8 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 pl-3 font-medium text-black-500 font-bold" htmlFor="password">
              Пароль
            </label>
            <div className="relative">
              {/* Иконка замка слева */}
              <Lock className="w-5 h-5 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />

              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль"
                className="w-full border border-gray-300 rounded-md p-2 pl-8 pr-10 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600"
                required
              />

              {/* Иконка Eye справа для показа/скрытия */}
              {show ? (
                <EyeOff
                  className="w-5 h-5 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                  onClick={() => setShow(false)}
                />
              ) : (
                <Eye
                  className="w-5 h-5 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                  onClick={() => setShow(true)}
                />
              )}
            </div>
          </div>

          <button type="submit" className="w-full my-5 text-white font-semibold py-2 px-4 rounded-md 
                      bg-linear-to-r from-cyan-600 to-blue-800 
                      hover:from-cyan-700 hover:to-blue-900 
                      transition">
            Войти
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-3 font-semibold">
          Все права защищены © 2025 GidroAtlas
        </p>
      </div>
    </div>
  );
}
