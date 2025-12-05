// app/objects/page.tsx
'use client';

import { useState, useMemo } from 'react';
import { Search, AlertCircle, Droplet, Beaker, ChevronLeft, ChevronRight } from 'lucide-react';

import waterQualityData from '../data/waterQuality.json';
import riverLevelsData from '../data/riverLevels.json';
import ObjectCard from '../components/map/ObjectCard';

import type { MapObject } from '../types/maps';
import { getPriorityLevel, priorityColors, isWaterQuality, isRiverLevel } from '../types/maps';

export default function ObjectsPage() {
  const waterQualityPoints: MapObject[] = waterQualityData.map((item: any, i) => ({
    ...item,
    id: `quality-${i}`,
  }));

  const riverLevelPoints: MapObject[] = riverLevelsData.map((item: any, i) => ({
    ...item,
    id: `river-${i}`,
  }));

  const allObjects = [...waterQualityPoints, ...riverLevelPoints];

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'quality' | 'river'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | 'Высокий' | 'Средний' | 'Низкий'>('all');
  const [sortBy, setSortBy] = useState<'priority' | 'name' | 'date'>('priority');
  const [page, setPage] = useState(1);
  const [selectedObject, setSelectedObject] = useState<MapObject | null>(null);

  const itemsPerPage = 20;

  const filteredAndSorted = useMemo(() => {
    let filtered = allObjects;

    // Поиск
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(obj => {
        const name = isWaterQuality(obj)
          ? obj.description.toLowerCase()
          : obj.object_name.toLowerCase();
        return name.includes(q);
      });
    }

    // Фильтр по типу
    if (filterType === 'quality') filtered = filtered.filter(isWaterQuality);
    if (filterType === 'river') filtered = filtered.filter(isRiverLevel);

    // Фильтр по приоритету
    if (filterPriority !== 'all') {
      filtered = filtered.filter(obj => getPriorityLevel(obj) === filterPriority);
    }

    // Сортировка
    filtered.sort((a, b) => {
      if (sortBy === 'priority') {
        const order = { Высокий: 3, Средний: 2, Низкий: 1 };
        return order[getPriorityLevel(b)] - order[getPriorityLevel(a)];
      }
      if (sortBy === 'name') {
        const nameA = isWaterQuality(a) ? a.description : a.object_name;
        const nameB = isWaterQuality(b) ? b.description : b.object_name;
        return nameA.localeCompare(nameB);
      }
      if (sortBy === 'date') {
        const dateA = isRiverLevel(a) ? new Date(a.date).getTime() : 0;
        const dateB = isRiverLevel(b) ? new Date(b.date).getTime() : 0;
        return dateB - dateA;
      }
      return 0;
    });

    return filtered;
  }, [allObjects, searchQuery, filterType, filterPriority, sortBy]);

  const totalPages = Math.ceil(filteredAndSorted.length / itemsPerPage);
  const paginated = filteredAndSorted.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleOpenPassport = () => {
    alert('Паспорт объекта будет доступен в полной версии системы');
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Шапка */}
        <div className="bg-white border-b sticky top-0 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Объекты мониторинга</h1>
              <p className="text-sm text-gray-500 mt-1">
                {filteredAndSorted.length} из {allObjects.length} объектов
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Поиск по названию..."
                  className="pl-10 pr-4 py-3 border rounded-xl w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Фильтры */}
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-wrap gap-3">
            <select
              className="px-4 py-2 border rounded-lg bg-white"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
            >
              <option value="all">Все объекты</option>
              <option value="quality">Качество воды</option>
              <option value="river">Уровни воды</option>
            </select>

            <select
              className="px-4 py-2 border rounded-lg bg-white"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as any)}
            >
              <option value="all">Любой приоритет</option>
              <option value="Высокий">Высокий приоритет</option>
              <option value="Средний">Средний</option>
              <option value="Низкий">Низкий</option>
            </select>

            <select
              className="px-4 py-2 border rounded-lg bg-white"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="priority">По приоритету</option>
              <option value="name">По названию</option>
              <option value="date">По дате (новые)</option>
            </select>
          </div>
        </div>

        {/* Таблица */}
        <div className="max-w-7xl mx-auto px-6 pb-10">
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Объект</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Тип</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Ключевые показатели</th>
                  <th className="text-center p-4 text-sm font-medium text-gray-700">Приоритет</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((obj) => {
                  const priority = getPriorityLevel(obj);
                  const isQuality = isWaterQuality(obj);
                  const isRiver = isRiverLevel(obj);

                  return (
                    <tr
                      key={obj.id}
                      onClick={() => setSelectedObject(obj)}
                      className="border-b hover:bg-blue-50 transition cursor-pointer"
                    >
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {isQuality ? obj.description.split('\r')[0] : obj.object_name}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {obj.lat.toFixed(4)}, {obj.lng.toFixed(4)}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          isQuality ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {isQuality ? 'Качество воды' : 'Уровень воды'}
                        </span>
                      </td>
                      <td className="p-4 text-sm">
                        {isQuality ? (
                          obj.parameters.length > 0 ? (
                            <span>
                              {obj.parameters[0].parameter}: <strong>{obj.parameters[0].concentration}</strong> {obj.parameters[0].unit}
                              {obj.parameters.some(p => p.concentration > p.background * 1.1) && (
                                <span className="text-red-600 ml-2">превышение!</span>
                              )}
                            </span>
                          ) : 'Нет данных'
                        ) : (
                          <span>
                            <strong>{obj.actual_level_cm} см</strong>
                            {obj.danger_level_cm && (
                              <span className="text-red-600 ml-2">
                                (опасно: {obj.danger_level_cm} см)
                              </span>
                            )}
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-4 py-1 rounded-full text-white text-xs font-bold ${priorityColors[priority]}`}>
                          {priority}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Пагинация */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" /> Назад
                </button>
                <span className="text-sm text-gray-600">
                  Страница {page} из {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border disabled:opacity-50"
                >
                  Вперед <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Карточка объекта (повторно используем) */}
        <ObjectCard
          selectedObject={selectedObject}
          setSelectedObject={() => setSelectedObject(null)}
          handleOpenPassport={handleOpenPassport}
        />
      </div>
    </>
  );
}