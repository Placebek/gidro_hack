// components/map/Sidebar.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';
import debounce from 'lodash.debounce';
import type { MapObject } from '@/types/maps';
import { getPriorityLevel, priorityColors, isWaterQuality, isRiverLevel } from '../../types/maps';

interface Region { id: number; region: string }
interface ResourceType { id: number; name: string }
interface WaterType { id: number; name: string }

interface SidebarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  filters: { type: 'all' | 'quality' | 'river'; priority: 'all' | 'Высокий' | 'Средний' | 'Низкий' };
  setFilters: (f: SidebarProps['filters']) => void;

  selectedRegion: number | 'all';
  setSelectedRegion: (v: number | 'all') => void;

  selectedResourceType: number | 'all';
  setSelectedResourceType: (v: number | 'all') => void;

  selectedWaterType: number | 'all';
  setSelectedWaterType: (v: number | 'all') => void;

  hasFauna: 'all' | 'yes' | 'no';
  setHasFauna: (v: 'all' | 'yes' | 'no') => void;

//   passportDateRange: { from: string; to: string };
//   setPassportDateRange: (v: { from: string; to: string }) => void;

  conditionCategory: 'all' | 1 | 2 | 3 | 4 | 5;
  setConditionCategory: (v: 'all' | 1 | 2 | 3 | 4 | 5) => void;

  sortedFilteredObjects: MapObject[];
  setSelectedObject: (obj: MapObject | null) => void;
}

export default function Sidebar({
  searchQuery,
  setSearchQuery,
  filters,
  setFilters,
  selectedRegion,
  setSelectedRegion,
  selectedResourceType,
  setSelectedResourceType,
  selectedWaterType,
  setSelectedWaterType,
  hasFauna,
  setHasFauna,
  conditionCategory,
  setConditionCategory,
  sortedFilteredObjects,
  setSelectedObject,
}: SidebarProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);

  const [regions, setRegions] = useState<Region[]>([]);
  const [resourceTypes, setResourceTypes] = useState<ResourceType[]>([]);
  const [waterTypes, setWaterTypes] = useState<WaterType[]>([]);

  // Загрузка справочников
  useEffect(() => {
    Promise.all([
      fetch('http://localhost:8000/api/region/regions').then(r => r.json()),
      fetch('http://localhost:8000/api/resource/resource-types').then(r => r.json()),
      fetch('http://localhost:8000/api/water/water-types').then(r => r.json()),
    ])
      .then(([reg, res, wat]) => {
        setRegions(reg.regions || []);
        setResourceTypes(res.resource_types || []);
        setWaterTypes(wat.water_types || []);
      })
      .catch(console.error);
  }, []);

  // Debounce для поиска
  const debouncedSetSearchQuery = useCallback(
    debounce((value: string) => setSearchQuery(value), 300),
    [setSearchQuery]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSetSearchQuery(e.target.value);
  };

  // Сброс всех фильтров
  const resetFilters = () => {
    setSearchQuery('');
    setFilters({ type: 'all', priority: 'all' });
    setSelectedRegion('all');
    setSelectedResourceType('all');
    setSelectedWaterType('all');
    setHasFauna('all');
    setConditionCategory('all');
  };

  return (
    <div className="w-96 h-screen fixed left-0 top-0 bg-white shadow-2xl overflow-y-auto z-30 pt-16 pb-24">
      <div className="p-6 space-y-7">
        {/* Заголовок + счётчик */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">ГидроАтлас</h2>
          <span className="text-sm text-gray-500 font-medium">
            {sortedFilteredObjects.length} объектов
          </span>
        </div>

        {/* Поиск */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск по названию..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            defaultValue={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        {/* Фильтры */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className="flex items-center gap-2 font-medium text-gray-700 hover:text-gray-900 transition"
            >
              <Filter className="w-4 h-4" />
              Фильтры
            </button>
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Сбросить
            </button>
          </div>

          {isFiltersOpen && (
            <div className="space-y-5 pb-4 border-b animate-in slide-in-from-top-2 duration-300">
              {/* Тип данных */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Тип данных</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['all', 'quality', 'river'] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setFilters({ ...filters, type: t })}
                      className={`py-2.5 px-3 rounded-lg text-sm font-medium transition ${
                        filters.type === t
                          ? t === 'all' ? 'bg-gray-800 text-white' :
                            t === 'quality' ? 'bg-emerald-600 text-white' :
                            'bg-blue-600 text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {t === 'all' ? 'Все' : t === 'quality' ? 'Качество' : 'Уровень'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Область */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Область</label>
                <select
                  value={selectedRegion}
                  onChange={e => setSelectedRegion(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Все области</option>
                  {regions.map(r => (
                    <option key={r.id} value={r.id}>{r.region}</option>
                  ))}
                </select>
              </div>

              {/* Тип ресурса */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Тип ресурса</label>
                <select
                  value={selectedResourceType}
                  onChange={e => setSelectedResourceType(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Все типы</option>
                  {resourceTypes.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              {/* Тип воды + Фауна + Состояние */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Тип воды</label>
                  <select
                    value={selectedWaterType}
                    onChange={e => setSelectedWaterType(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Все</option>
                    {waterTypes.map(w => (
                      <option key={w.id} value={w.id}>{w.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Фауна</label>
                  <select
                    value={hasFauna}
                    onChange={e => setHasFauna(e.target.value as any)}
                    className="w-full border border-gray-300 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Все</option>
                    <option value="yes">Есть</option>
                    <option value="no">Нет</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Состояние</label>
                <select
                  value={conditionCategory}
                  onChange={e => setConditionCategory(e.target.value === 'all' ? 'all' : Number(e.target.value) as any)}
                  className="w-full border border-gray-300 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Все категории</option>
                  {[1,2,3,4,5].map(n => (
                    <option key={n} value={n}>Категория {n}</option>
                  ))}
                </select>
              </div>

              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Дата паспорта</label>
                <div className="flex gap-2">
                  <input type="date" value={passportDateRange.from} onChange={e => setPassportDateRange({ ...passportDateRange, from: e.target.value })} className="flex-1 border border-gray-300 rounded-lg py-2 px-3 text-sm" />
                  <input type="date" value={passportDateRange.to} onChange={e => setPassportDateRange({ ...passportDateRange, to: e.target.value })} className="flex-1 border border-gray-300 rounded-lg py-2 px-3 text-sm" />
                </div>
              </div> */}
            </div>
          )}
        </div>

        {/* Список объектов */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Приоритет обследования</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {sortedFilteredObjects.length === 0 ? (
              <p className="text-center text-gray-500 py-12">Объекты не найдены</p>
            ) : (
              sortedFilteredObjects.map(obj => {
                const priority = getPriorityLevel(obj);
                const name = 'name' in obj ? obj.name : ('description' in obj ? obj.description.split('\r')[0] : 'Без названия');

                return (
                  <div
                    key={obj.id}
                    onClick={() => setSelectedObject(obj)}
                    className="p-4 bg-gray-50 hover:bg-gray-100 rounded-xl cursor-pointer transition-all border border-gray-200 hover:border-blue-400 hover:shadow-md"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 leading-tight">{name}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {isWaterQuality(obj) ? 'Качество воды' : 'Гидропост'}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-white text-xs font-bold ${priorityColors[priority]}`}>
                        {priority}
                      </span>
                    </div>

                    <div className="mt-3 text-xs text-gray-600">
                      {isRiverLevel(obj) ? (
                        <>Уровень: <strong>{obj.actual_level_cm} см</strong></>
                      ) : (
                        <>Параметров: {obj.parameters?.length || 0}</>
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