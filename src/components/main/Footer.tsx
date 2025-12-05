import { MapPin, Phone, Mail, Globe, Facebook, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Логотип и описание */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-linear-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 576 512">
                  <path d="M269.5 69.9c11.1-7.9 25.9-7.9 37 0C329 85.4 356.5 96 384 96c26.9 0 55.4-10.8 77.4-26.1c11.9-8.5 28.1-7.8 39.2 1.7c14.4 11.9 32.5 21 50.6 25.2c17.2 4 27.9 21.2 23.9 38.4s-21.2 27.9-38.4 23.9c-24.5-5.7-44.9-16.5-58.2-25C449.5 149.7 417 160 384 160c-31.9 0-60.6-9.9-80.4-18.9c-19.8 9-48.5 18.9-80.4 18.9c-33 0-65.5-10.3-94.5-25.8c-13.4 8.4-33.7 19.3-58.2 25c-17.2 4-34.4-6.7-38.4-23.9s6.7-34.4 23.9-38.4c18.1-4.2 36.2-13.3 50.6-25.2c11.1-9.5 27.3-10.1 39.2-1.7C136.7 85.2 165.1 96 192 96c27.5 0 55-10.6 77.5-26.1c11.1-7.9 25.9-7.9 37 0z"/>
                </svg>
              </div>
              <span className="text-2xl font-bold text-white">ГидроАтлас</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Национальная платформа мониторинга водных ресурсов и гидротехнических сооружений Республики Казахстан
            </p>
            <div className="flex gap-4 pt-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-cyan-500 transition-all">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-cyan-500 transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-cyan-500 transition-all">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Навигация */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-5">Навигация</h3>
            <ul className="space-y-3">
              <li><a href="#hero-section" className="hover:text-cyan-400 transition">Главная</a></li>
              <li><a href="/map" className="hover:text-cyan-400 transition">Интерактивная карта</a></li>
              <li><a href="#objects-section" className="hover:text-cyan-400 transition">Водные объекты</a></li>
              <li><a href="#prioritization-section" className="hover:text-cyan-400 transition">Приоритизация</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition">Документация</a></li>
            </ul>
          </div>

          {/* Поддержка */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-5">Поддержка</h3>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-cyan-400 transition">Часто задаваемые вопросы</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition">Руководство пользователя</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition">API для разработчиков</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition">Обратная связь</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition">Сообщить об ошибке</a></li>
            </ul>
          </div>

          {/* Контакты */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-5">Контакты</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-cyan-400" />
                <span className="text-sm">gidroatlas.kz</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-cyan-400" />
                <span className="text-sm">support@gidroatlas.kz</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-cyan-400" />
                <span className="text-sm">+7 (7172) 99-99-99</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-cyan-400 mt-1" />
                <span className="text-sm">г. Астана, пр. Кабанбай батыра, 11/5</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Нижняя полоса */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>&copy; 2025 ГидроАтлас. Все права защищены.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-cyan-400 transition">Политика конфиденциальности</a>
            <a href="#" className="hover:text-cyan-400 transition">Условия использования</a>
          </div>
        </div>
      </div>
    </footer>
  );
}