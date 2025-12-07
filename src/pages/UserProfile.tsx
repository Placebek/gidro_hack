import { useState } from 'react';
import { 
  User, MapPin, FileText, Bell, Bookmark, Eye, Filter, TrendingUp, Calendar, Clock, ChevronRight, X 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { StatsCard } from './components/StatsCard';
import { ActivityItem } from './components/ActivityItem';
import { SavedItem } from './components/SavedItem';
import { AlertCard } from './components/AlertCard';
import { ReportCard } from './components/ReportCard';

export function UserProfile() {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [userData, setUserData] = useState({
    name: "Ермекұлы Сәкен",
    role: "Эксперт",
    email: "aleksey.ivanov@gidroatlas.ru",
    department: "Отдел технического надзора",
    region: "Центральный федеральный округ",
    joinDate: "Январь 2023",
    avatar: "АИ"
  });

  const stats = [
    { icon: Eye, label: "Просмотрено объектов", value: "247", trend: "+12 за неделю", color: "blue" as const },
    { icon: MapPin, label: "Регионов исследовано", value: "18", trend: "6 федеральных округов", color: "cyan" as const },
    { icon: Bookmark, label: "Сохраненных паспортов", value: "34", trend: "5 требуют внимания", color: "indigo" as const },
    { icon: Bell, label: "Активных оповещений", value: "8", trend: "2 критических", color: "orange" as const }
  ];

  const recentActivity = [
    { type: "view" as const, name: "Волжская ГЭС", location: "Волгоградская обл.", time: "2 часа назад", condition: "good" as const },
    { type: "save" as const, name: "Саратовская ГЭС", location: "Саратовская обл.", time: "5 часов назад", condition: "satisfactory" as const },
    { type: "report" as const, name: "Отчет по ЦФО - Ноябрь 2025", location: "18 объектов", time: "1 день назад", condition: null },
    { type: "view" as const, name: "Рыбинское водохранилище", location: "Ярославская обл.", time: "2 дня назад", condition: "critical" as const },
    { type: "filter" as const, name: "Критические объекты ЦФО", location: "Фильтр создан", time: "3 дня назад", condition: null }
  ];

  const savedStructures = [
    { name: "Волжская ГЭС", type: "Гидроэлектростанция", region: "Волгоградская обл.", condition: "good" as const, lastInspection: "15.11.2025" },
    { name: "Саратовская ГЭС", type: "Гидроэлектростанция", region: "Саратовская обл.", condition: "satisfactory" as const, lastInspection: "10.11.2025" },
    { name: "Куйбышевская ГЭС", type: "Гидроэлектростанция", region: "Самарская обл.", condition: "critical" as const, lastInspection: "08.11.2025" },
    { name: "Чебоксарская ГЭС", type: "Гидроэлектростанция", region: "Чувашская Республика", condition: "good" as const, lastInspection: "12.11.2025" }
  ];

  const alerts = [
    { title: "Критическое состояние", structure: "Куйбышевская ГЭС", priority: "critical" as const, date: "05.12.2025" },
    { title: "Требуется инспекция", structure: "Нижнекамская ГЭС", priority: "high" as const, date: "04.12.2025" },
    { title: "Обновление паспорта", structure: "Волжская ГЭС", priority: "medium" as const, date: "03.12.2025" }
  ];

  const reports = [
    { title: "Технический отчет ЦФО", date: "Ноябрь 2025", objects: 18, status: "completed" as const },
    { title: "Анализ критических объектов", date: "Октябрь 2025", objects: 7, status: "completed" as const },
    { title: "Квартальный отчет Q3", date: "Сентябрь 2025", objects: 42, status: "completed" as const }
  ];

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setUserData({
      ...userData,
      name: formData.get("name") as string || userData.name,
      role: formData.get("role") as string || userData.role,
      email: formData.get("email") as string || userData.email,
      department: formData.get("department") as string || userData.department,
      region: formData.get("region") as string || userData.region,
    });
    setIsEditOpen(false);
  };

  return (
    <div className="max-w-7xl pt-30 mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-[#2B80FF] via-blue-500 to-cyan-400"></div>
        <div className="px-8 pb-8">
          <div className="flex items-start gap-6 -mt-16">
            <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-[#2B80FF] to-cyan-500 flex items-center justify-center text-white shadow-lg border-4 border-white">
              <span className="text-4xl">{userData.avatar}</span>
            </div>
            <div className="flex-1 mt-16">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-slate-900 mb-1 text-3xl font-bold">{userData.name}</h1>
                  <div className="flex items-center gap-3 text-slate-600 mb-2">
                    <span className="px-3 py-1 bg-blue-50 text-[#2B80FF] rounded-full text-sm font-medium">{userData.role}</span>
                    <span className="text-sm">{userData.department}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      <span>{userData.region}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>На платформе с {userData.joinDate}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditOpen(true)}
                  className="px-6 mt-8 py-3 bg-blue-50 hover:bg-blue-100 cursor-pointer text-[#2B80FF] font-medium rounded-xl transition-all hover:scale-105"
                >
                  Редактировать профиль
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#2B80FF]" />
                <h2 className="text-slate-900 font-semibold">Последняя активность</h2>
              </div>
              <button className="text-sm text-[#2B80FF] hover:text-blue-600 flex items-center gap-1">
                Показать все <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <ActivityItem key={index} {...activity} />
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-[#2B80FF]" />
                <h2 className="text-slate-900 font-semibold">Сохраненные паспорта</h2>
              </div>
              <button className="text-sm text-[#2B80FF] hover:text-blue-600 flex items-center gap-1">
                Управление <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              {savedStructures.map((structure, index) => (
                <SavedItem key={index} {...structure} />
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#2B80FF]" />
                <h2 className="text-slate-900 font-semibold">Мои отчеты</h2>
              </div>
              <button className="text-sm text-[#2B80FF] hover:text-blue-600 flex items-center gap-1">
                Создать новый <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              {reports.map((report, index) => (
                <ReportCard key={index} {...report} />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Bell className="w-5 h-5 text-[#2B80FF]" />
              <h2 className="text-slate-900 font-semibold">Активные оповещения</h2>
            </div>
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <AlertCard key={index} {...alert} />
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Filter className="w-5 h-5 text-[#2B80FF]" />
              <h2 className="text-slate-900 font-semibold">Мои фильтры</h2>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors">
                <div className="text-sm text-slate-900 mb-1">Критические объекты ЦФО</div>
                <div className="text-xs text-slate-500">7 объектов</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors">
                <div className="text-sm text-slate-900 mb-1">ГЭС Волжского каскада</div>
                <div className="text-xs text-slate-500">12 объектов</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors">
                <div className="text-sm text-slate-900 mb-1">Требуют инспекции</div>
                <div className="text-xs text-slate-500">15 объектов</div>
              </div>
              <button className="w-full p-3 border-2 border-dashed border-slate-200 rounded-lg text-sm text-slate-500 hover:border-[#2B80FF] hover:text-[#2B80FF] transition-colors">
                + Создать фильтр
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#DDF3FF] to-blue-50 rounded-xl shadow-sm border border-blue-200/60 p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-[#2B80FF]" />
              <h3 className="text-slate-900 font-semibold">Приоритетная информация</h3>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-white/80 rounded-lg">
                <div className="text-sm text-slate-900 mb-1">3 объекта требуют внимания</div>
                <div className="text-xs text-slate-600">Истекает срок инспекции</div>
              </div>
              <div className="p-3 bg-white/80 rounded-lg">
                <div className="text-sm text-slate-900 mb-1">Новые данные доступны</div>
                <div className="text-xs text-slate-600">8 обновленных паспортов</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* КРАСИВОЕ КОМПАКТНОЕ МОДАЛЬНОЕ ОКНО */}
      <AnimatePresence>
        {isEditOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsEditOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-md"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-[#2B80FF] to-cyan-400 rounded-3xl opacity-25 blur-xl" />

              <div className="relative bg-white/96 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/70 overflow-hidden">
                <div className="relative bg-gradient-to-r from-[#2B80FF] via-blue-500 to-cyan-400 p-5 pb-7">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
                  <button
                    onClick={() => setIsEditOpen(false)}
                    className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all hover:scale-110"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-white text-xl font-semibold">Редактировать профиль</h2>
                      <p className="text-blue-100 text-sm">Обновите данные</p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSave} className="p-6 space-y-4">
                  {[
                    { label: "Полное имя", name: "name", ph: "Алексей Иванов" },
                    { label: "Должность", name: "role", ph: "Эксперт" },
                    { label: "Email", name: "email", ph: "email@gidroatlas.ru", type: "email" },
                    { label: "Отдел", name: "department", ph: "Отдел технического надзора" },
                    { label: "Регион", name: "region", ph: "Центральный федеральный округ" }
                  ].map((f) => (
                    <div key={f.name} className="space-y-1.5">
                      <label className="text-xs text-slate-600 font-medium ml-1">{f.label}</label>
                      <input
                        type={f.type || "text"}
                        name={f.name}
                        defaultValue={userData[f.name as keyof typeof userData]}
                        className="w-full px-4 py-3 bg-slate-50/70 border border-slate-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B80FF]/30 focus:border-[#2B80FF] transition-all text-slate-900 placeholder:text-slate-400"
                        placeholder={f.ph}
                      />
                    </div>
                  ))}

                  <div className="flex gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setIsEditOpen(false)}
                      className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-all hover:scale-[1.02] active:scale-98"
                    >
                      Отмена
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-gradient-to-r from-[#2B80FF] to-blue-500 hover:from-[#1d6ef0] hover:to-blue-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:scale-[1.02] active:scale-98"
                    >
                      Сохранить
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}