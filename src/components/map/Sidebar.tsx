// components/map/Sidebar.tsx
'use client';

import { Search, Filter } from 'lucide-react';
import { useState } from 'react';

import type { MapObject } from '@/types/maps';
import { getPriorityLevel, priorityColors, isWaterQuality, isRiverLevel } from '../../types/maps';

interface SidebarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filters: {
    type: 'all' | 'quality' | 'river';
    priority: 'all' | 'Высокий' | 'Средний' | 'Низкий';
  };
  setFilters: (f: SidebarProps['filters']) => void;
  sortedFilteredObjects: MapObject[];
  setSelectedObject: (obj: MapObject | null) => void;
}

export default function Sidebar({
  searchQuery,
  setSearchQuery,
  filters,
  setFilters,
  sortedFilteredObjects,
  setSelectedObject,
}: SidebarProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);

  return (
    <div className="w-96 h-screen fixed left-0 top-0 bg-white shadow-2xl overflow-y-auto z-30 pt-16 pb-24">
      <div className="p-6 space-y-7">
        {/* Заголовок */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">ГидраАтлас</h2>
          <span className="text-sm text-gray-500">
            {sortedFilteredObjects.length} объектов
          </span>
        </div>

        {/* Поиск */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск по названию..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Фильтры */}
        <div className="space-y-4">
          <button
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
          >
            <span className="font-medium flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Фильтры
            </span>
            <span className="text-xs text-gray-500">
              {isFiltersOpen ? 'Скрыть' : 'Показать'}
            </span>
          </button>

          {isFiltersOpen && (
            <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
              {/* Тип объекта */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Тип данных
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setFilters({ ...filters, type: 'all' })}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition ${
                      filters.type === 'all'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    Все
                  </button>
                  <button
                    onClick={() => setFilters({ ...filters, type: 'quality'})}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition ${
                      filters.type === 'quality'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    Качество
                  </button>
                  <button
                    onClick={() => setFilters({ ...filters, type: 'river' })}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition ${
                      filters.type === 'river'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    Уровень
                  </button>
                </div>
              </div>

              {/* Приоритет */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Приоритет
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setFilters({ ...filters, priority: 'all' })}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition ${
                      filters.priority === 'all'
                        ? 'bg-gray-800 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    Все
                  </button>
                  <button
                    onClick={() => setFilters({ ...filters, priority: 'Высокий' })}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition ${
                      filters.priority === 'Высокий'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    Высокий
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Список объектов */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Приоритет обследования
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {sortedFilteredObjects.length === 0 ? (
              <p className="text-center text-gray-500 py-12">
                Объекты не найдены
              </p>
            ) : (
              sortedFilteredObjects.map((obj) => {
                const priority = getPriorityLevel(obj);
                const name = isWaterQuality(obj)
                  ? obj.description.split('\r')[0]
                  : obj.object_name;

                return (
                  <div
                    key={obj.id}
                    onClick={() => setSelectedObject(obj)}
                    className="p-4 bg-gray-50 hover:bg-gray-100 rounded-xl cursor-pointer transition-all border border-gray-200 hover:border-blue-400 hover:shadow-md"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 leading-tight">
                          {name}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {isWaterQuality(obj) ? 'Качество воды' : 'Уровень воды'}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-white text-xs font-bold ${priorityColors[priority]}`}
                      >
                        {priority}
                      </span>
                    </div>

                    <div className="mt-3 text-xs text-gray-600">
                      {isRiverLevel(obj) ? (
                        <>
                          Уровень: <strong>{obj.actual_level_cm} см</strong>
                          {obj.danger_level_cm && (
                            <span className="text-red-600">
                              {' '}
                              (опасно: {obj.danger_level_cm})
                            </span>
                          )}
                        </>
                      ) : (
                        <>
                          {obj.parameters.length > 0
                            ? `${obj.parameters[0].parameter}: ${obj.parameters[0].concentration} ${obj.parameters[0].unit}`
                            : 'Нет данных'}
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}