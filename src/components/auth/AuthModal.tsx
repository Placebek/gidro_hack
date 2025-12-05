// src/components/auth/AuthModal.tsx
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { LogIn, Eye } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useEffect } from "react";

export function AuthModal() {
  const { user, setRole } = useAuthStore();

  useEffect(() => {
    const saved = localStorage.getItem("gidroatlas-auth");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.state?.user) {
        return;
      }
    }
  }, []);

  if (user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
      <Card className="w-80 sm:w-96 shadow-2xl border-0">
        <CardHeader className="text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-linear-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center">
            <span className="text-3xl sm:text-4xl font-semibold">💧</span>
          </div>
          <CardTitle className="text-xl sm:text-2xl">Добро пожаловать в ГидроАтлас</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Выберите режим работы
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <Button
            size="lg"
            variant="outline"
            className="w-full h-12 sm:h-14 text-base cursor-pointer sm:text-lg font-medium border-2 flex items-center justify-between px-4"
            onClick={() => setRole("guest")}
          >
            <Eye className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="flex-1 text-center">Продолжить как гость</span>
            {/* <span className="ml-auto text-xs sm:text-sm opacity-70">Только просмотр</span> */}
          </Button>

          <div className="relative my-2 sm:my-3">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs sm:text-sm uppercase">
              <span className="bg-white dark:bg-gray-950 px-2 text-gray-500">или</span>
            </div>
          </div>

          <Button
            size="lg"
            className="w-full h-12 sm:h-14 text-base sm:text-lg font-medium bg-linear-to-r cursor-pointer  from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 flex items-center flex-row justify-between px-4"
            onClick={() => setRole("expert")}
          >
            <LogIn className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="flex-1 text-center">Войти как эксперт</span>
            {/* <span className="ml-auto text-xs sm:text-sm opacity-90">Полный доступ + приоритеты</span> */}
          </Button>

          <p className="text-center text-xs sm:text-sm text-gray-500 mt-4 sm:mt-6">
            Все права защищены © 2025 ГидроАтлас
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
