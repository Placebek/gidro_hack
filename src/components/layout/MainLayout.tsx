import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Menu } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useState } from "react";
import { cn } from "../../lib/utils";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // на десктопе открыта сразу

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-50 dark:bg-gray-950 flex flex-col">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={cn(
            "transition-all duration-300 ease-in-out bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800",
            sidebarOpen ? "w-80" : "w-0"
          )}
        >
          <div className={cn("h-full overflow-hidden", !sidebarOpen && "opacity-0")}>
            <Sidebar />
          </div>
        </div>

        {/* Кнопка открытия на мобильных + для красоты */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute top-20 left-4 z-50 transition-all",
            sidebarOpen && "left-80"
          )}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Основной контент (карта) */}
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}