'use client';

import { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import L from 'leaflet';
import { format } from 'date-fns';
import { Search, Filter, X, FileText, MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Исправление иконок Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface WaterObject {
  id: string;
  name: string;
  region: string;
  type: 'озеро' | 'водохранилище' | 'канал';
  waterType: 'пресная' | 'непресная';
  hasFauna: boolean;
  passportDate: string; // ISO date
  condition: 1 | 2 | 3 | 4 | 5;
  lat: number;
  lon: number;
  passportUrl?: string;
}

// Пример данных (замени на реальные)
const mockData: WaterObject[] = [
  {
    id: '1',
    name: 'Озеро Балхаш',
    region: 'Алматинская область',
    type: 'озеро',
    waterType: 'пресная',
    hasFauna: true,
    passportDate: '2018-05-15',
    condition: 2,
    lat: 46.5,
    lon: 74.5,
  },
  {
    id: '2',
    name: 'Капшагайское водохранилище',
    region: 'Алматинская область',
    type: 'водохранилище',
    waterType: 'пресная',
    hasFauna: true,
    passportDate: '2015-03-20',
    condition: 4,
    lat: 43.85,
    lon: 77.2,
  },
  {
    id: '3',
    name: 'Канал Иртыш-Караганда',
    region: 'Карагандинская область',
    type: 'канал',
    waterType: 'пресная',
    hasFauna: false,
    passportDate: '2012-11-10',
    condition: 5,
    lat: 49.8,
    lon: 73.1,
  },
  // добавь ещё...
];

const conditionColors = {
  1: '#10B981', // зелёный
  2: '#84CC16', // салатовый
  3: '#FACC15', // жёлтый
  4: '#FB923C', // оранжевый
  5: '#EF4444', // красный
};

const priorityColors = {
  Высокий: 'bg-red-500',
  Средний: 'bg-yellow-500',
  Низкий: 'bg-green-500',
};

export default function MapPage() {
  const [objects] = useState<WaterObject[]>(mockData);
  const [selectedObject, setSelectedObject] = useState<WaterObject | null>(null);
  const [filters, setFilters] = useState({
    region: '',
    type: '',
    waterType: '',
    hasFauna: '',
    condition: '',
    dateFrom: '',
    dateTo: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Расчёт приоритета
  const calculatePriority = (obj: WaterObject) => {
    const yearsOld = new Date().getFullYear() - new Date(obj.passportDate).getFullYear();
    const score = (6 - obj.condition) * 3 + yearsOld;
    if (score >= 12) return { score, level: 'Высокий' as const };
    if (score >= 6) return { score, level: 'Средний' as const };
    return { score, level: 'Низкий' as const };
  };

  // Фильтрация
  const filteredObjects = useMemo(() => {
    return objects.filter(obj => {
      if (filters.region && obj.region !== filters.region) return false;
      if (filters.type && obj.type !== filters.type) return false;
      if (filters.waterType && obj.waterType !== filters.waterType) return false;
      if (filters.hasFauna && (obj.hasFauna ? 'да' : 'нет') !== filters.hasFauna) return false;
      if (filters.condition && obj.condition !== Number(filters.condition)) return false;
      if (filters.dateFrom && new Date(obj.passportDate) < new Date(filters.dateFrom)) return false;
      if (filters.dateTo && new Date(obj.passportDate) > new Date(filters.dateTo)) return false;
      if (searchQuery && !obj.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [objects, filters, searchQuery]);

  // Центрирование на объекте
  function FlyToMarker({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
      if (center) map.flyTo(center, 10, { duration: 1.5 });
    }, [center, map]);
    return null;
  }

  return (
    <>
      <div className="relative h-screen flex ">
        {/* Карта */}
        <div className="flex-1 relative">
          <MapContainer
            center={[48.0, 68.0]}
            zoom={5}
            className="h-full w-full z-10"
            style={{ background: '#f0f7ff' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap'
            />

            {filteredObjects.map(obj => {
            //   const priority = calculatePriority(obj);
              const icon = L.divIcon({
                html: `<div class="w-8 h-8 rounded-full border-3 border-white shadow-lg flex items-center justify-center text-white font-bold text-xs" style="background-color: ${conditionColors[obj.condition]}">
                  <span>${obj.condition}</span>
                </div>`,
                className: 'custom-marker',
                iconSize: [32, 32],
                iconAnchor: [16, 32],
              });

              return (
                <Marker
                  key={obj.id}
                  position={[obj.lat, obj.lon]}
                  icon={icon}
                  eventHandlers={{
                    click: () => setSelectedObject(obj),
                  }}
                >
                  <Popup>
                    <div className="text-center">
                      <p className="font-bold">{obj.name}</p>
                      <p className="text-sm text-gray-600">{obj.region}</p>
                    </div>
                  </Popup>
                </Marker>
              );
            })}

            {selectedObject && (
              <FlyToMarker center={[selectedObject.lat, selectedObject.lon]} />
            )}
          </MapContainer>

          {/* Поиск */}
          <div className="absolute top-4 left-4 z-40 bg-white rounded-xl shadow-lg p-3 flex gap-2 items-center w-96">
            <Search className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Поиск по названию..."
              className="flex-1 outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Кнопка фильтров */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="absolute top-4 right-4 z-40 bg-white rounded-xl shadow-lg p-4 hover:bg-gray-50 transition"
          >
            <Filter className="w-6 h-6" />
          </button>
        </div>

        {/* Боковая панель: фильтры + приоритизация */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              className="w-96 bg-white shadow-2xl z-20 overflow-y-auto"
            >
              <div className="p-6 border-b sticky top-0 bg-white z-40">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">Фильтры и приоритизация</h2>
                  <button onClick={() => setShowFilters(false)}>
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Фильтры */}
                <div className="space-y-4">
                  <select
                    className="w-full p-3 border rounded-lg"
                    onChange={(e) => setFilters({ ...filters, region: e.target.value })}
                  >
                    <option value="">Все области</option>
                    <option>Алматинская область</option>
                    <option>Карагандинская область</option>
                  </select>

                  <select
                    className="w-full p-3 border rounded-lg"
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  >
                    <option value="">Тип ресурса</option>
                    <option value="озеро">Озеро</option>
                    <option value="водохранилище">Водохранилище</option>
                    <option value="канал">Канал</option>
                  </select>

                  <select
                    className="w-full p-3 border rounded-lg"
                    onChange={(e) => setFilters({ ...filters, condition: e.target.value })}
                  >
                    <option value="">Состояние</option>
                    {[1,2,3,4,5].map(n => (
                      <option key={n} value={n}>Категория {n}</option>
                    ))}
                  </select>
                </div>

                {/* Приоритизация */}
                <div>
                  <h3 className="font-bold text-lg mb-4">Приоритет обследования</h3>
                  <div className="space-y-3">
                    {filteredObjects
                      .map(obj => ({ obj, priority: calculatePriority(obj) }))
                      .sort((a, b) => b.priority.score - a.priority.score)
                      .slice(0, 10)
                      .map(({ obj, priority }) => (
                        <div
                          key={obj.id}
                          className="p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition"
                          onClick={() => {
                            setSelectedObject(obj);
                            setShowFilters(false);
                          }}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{obj.name}</p>
                              <p className="text-sm text-gray-600">{obj.region}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-white text-xs font-bold ${priorityColors[priority.level]}`}>
                              {priority.level}
                            </span>
                          </div>
                          <div className="mt-2 text-xs text-gray-500">
                            Состояние: {obj.condition} • Паспорт: {new Date(obj.passportDate).getFullYear()}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Карточка объекта */}
        <AnimatePresence>
          {selectedObject && (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30 bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold">{selectedObject.name}</h3>
                <button onClick={() => setSelectedObject(null)}>
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><strong>Область:</strong> {selectedObject.region}</div>
                <div><strong>Тип:</strong> {selectedObject.type}</div>
                <div><strong>Вода:</strong> {selectedObject.waterType}</div>
                <div><strong>Фауна:</strong> {selectedObject.hasFauna ? 'Есть' : 'Нет'}</div>
                <div><strong>Состояние:</strong> 
                  <span className="ml-2 px-3 py-1 rounded-full text-white" style={{ backgroundColor: conditionColors[selectedObject.condition] }}>
                    Категория {selectedObject.condition}
                  </span>
                </div>
                <div><strong>Паспорт:</strong> {format(new Date(selectedObject.passportDate), 'dd.MM.yyyy')}</div>
              </div>

              <div className="mt-6 flex gap-3">
                <button className="flex-1 bg-[#2B80FF] text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2">
                  <FileText className="w-5 h-5" />
                  Открыть паспорт
                </button>
                <button className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition">
                  <MapPin className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}