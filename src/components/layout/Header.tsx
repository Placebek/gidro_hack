import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

export function Header() {
  const { user, logout } = useAuthStore();

  return (
    <header className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur supports-backdrop-filter:bg-white/60">
      <div className="px-6 h-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl font-bold bg-leaner-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
            ГидроАтлас
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Мониторинг водных ресурсов Казахстана
          </span>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm">
                {user.role === "expert" ? "Эксперт" : "Гость"}
              </div>
              <Button size="sm" variant="ghost" onClick={logout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}