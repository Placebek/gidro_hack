'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Search, ChevronLeft, ChevronRight, AlertTriangle, ArrowUpDown, MapPin } from 'lucide-react';
import ObjectCard from '../components/map/ObjectCard';
import type { MapObject } from '@/types/maps';

const API_BASE = 'http://localhost:8000';

interface Region {
    id: number;
    region: string;
}

interface ResourceType {
    id: number;
    name: string;
}

interface WaterType {
    id: number;
    name: 'пресная' | 'непресная';
}

interface WaterObject {
    id: string;
    name: string;
    region: string;
    resource_type: 'озеро' | 'канал' | 'водохранилище';
    water_type: 'пресная' | 'непресная';
    fauna: boolean;
    passport_date: string;
    technical_condition: 1 | 2 | 3 | 4 | 5;
    latitude: number;
    longitude: number;
    pdf_url?: string;
    priority_score?: number;
}

interface ApiResponse {
    items: MapObject[];
    total: number;
    page: number;
    size: number;
    pages: number;
}

export default function ObjectsPage() {
    const [objects, setObjects] = useState<WaterObject[]>([]);
    const [total, setTotal] = useState(0);
    const [pages, setPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [loadingFilters, setLoadingFilters] = useState(true);

    const [selectedObject, setSelectedObject] = useState<WaterObject | null>(null);


    const openPdf = (id: string) => {
        axios.get(`${API_BASE}/api/object/${id}/passport-pdf`, { responseType: 'blob' })
            .then((response) => {
                const file = new Blob([response.data], { type: 'application/pdf' });
                const fileURL = URL.createObjectURL(file);
                window.open(fileURL);
            })
            .catch((error) => {
                console.error('Ошибка при открытии PDF:', error);
                alert('Не удалось открыть паспорт объекта.');
            });
    }
    // Фильтры и состояние
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [sortField, setSortField] = useState<string>('priority_score');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const [regionId, setRegionId] = useState<number | null>(null);
    const [resourceTypeId, setResourceTypeId] = useState<number | null>(null);
    const [waterTypeId, setWaterTypeId] = useState<number | null>(null);
    const [conditionFilter, setConditionFilter] = useState<number | null>(null);

    // Справочники
    const [regions, setRegions] = useState<Region[]>([]);
    const [resourceTypes, setResourceTypes] = useState<ResourceType[]>([]);
    const [waterTypes, setWaterTypes] = useState<WaterType[]>([]);

    const size = 20;

    // === Загрузка справочников ===
    // === Загрузка справочников (гарантированно работает) ===
    useEffect(() => {
        async function loadFilters() {
            try {
                setLoadingFilters(true);

                const [regRes, resTypeRes, waterTypeRes] = await Promise.all([
                    axios.get(`${API_BASE}/api/region/regions`),
                    axios.get(`${API_BASE}/api/resource/resource-types`),
                    axios.get(`${API_BASE}/api/water/water-types`),
                ]);

                // Универсальная функция вытаскивания массива из любого ответа
                const extractArray = (data: any, possibleKeys: string[]) => {
                    if (Array.isArray(data)) return data;
                    for (const key of possibleKeys) {
                        if (data[key] && Array.isArray(data[key])) return data[key];
                    }
                    return [];
                };

                setRegions(extractArray(regRes.data, ['regions', 'data', 'items']));
                setResourceTypes(extractArray(resTypeRes.data, ['resource_types', 'data', 'items']));
                setWaterTypes(extractArray(waterTypeRes.data, ['water_types', 'data', 'items']));

            } catch (err: any) {
                console.error('Ошибка загрузки справочников:', err.response?.data || err.message);
                // На случай ошибки — пустые массивы, чтобы UI не упал
                setRegions([]);
                setResourceTypes([]);
                setWaterTypes([]);
            } finally {
                setLoadingFilters(false);
            }
        }

        loadFilters();
    }, []);

    // === Расчёт приоритета ===
    const calculatePriority = (condition: number, passportDate: string): number => {
        const years = new Date().getFullYear() - new Date(passportDate).getFullYear();
        return (6 - condition) * 3 + Math.max(0, years);
    };

    const getPriorityLevel = (score: number): 'Высокий' | 'Средний' | 'Низкий' => {
        if (score >= 12) return 'Высокий';
        if (score >= 6) return 'Средний';
        return 'Низкий';
    };

    const getConditionColor = (condition: number) => {
        const colors = ['bg-green-500', 'bg-lime-500', 'bg-yellow-500', 'bg-orange-500', 'bg-red-600'];
        return colors.reverse()[condition - 1];
    };

    const getPriorityColor = (level: string) => {
        return level === 'Высокий' ? 'bg-red-600' :
            level === 'Средний' ? 'bg-amber-500' :
                'bg-green-600';
    };

    // === Основной запрос с фильтрами ===
    const fetchObjects = useCallback(async () => {
        setLoading(true);
        try {
            const params: any = {
                page,
                size,
                name_contains: searchQuery || null,
                region_id: regionId,
                resource_type_id: resourceTypeId,
                water_type_id: waterTypeId,
                min_danger_level: conditionFilter,
                sort: sortField,
                order: sortOrder,
            };

            // Убираем null/undefined
            Object.keys(params).forEach(key => {
                if (params[key] === null || params[key] === undefined) delete params[key];
            });

            const res = await axios.get<ApiResponse>(`${API_BASE}/api/object/all`, { params });
            function randomInt(min: number, max: number) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }
            const enriched = res.data.items.map((item: any) => ({
                ...item,
                id: String(item.id),
                priority_score: calculatePriority(item.technical_condition, item.passport_date || '2023-01-01'),
            }));

            setObjects(enriched);
            setTotal(res.data.total);
            setPages(res.data.pages);
        } catch (err) {
            console.error(err);
            alert('Ошибка загрузки объектов');
            setObjects([]);
        } finally {
            setLoading(false);
        }
    }, [page, searchQuery, regionId, resourceTypeId, waterTypeId, conditionFilter, sortField, sortOrder]);

    // === Запрос при изменении любого параметра ===
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchObjects();
        }, searchQuery ? 400 : 0); // debounce только для поиска

        return () => clearTimeout(timer);
    }, [fetchObjects, searchQuery]);

    // Сброс страницы при фильтрах
    useEffect(() => {
        setPage(1);
    }, [searchQuery, regionId, resourceTypeId, waterTypeId, conditionFilter]);

    const toggleSort = (field: string) => {
        if (sortField === field) {
            setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('desc');
        }
        setPage(1);
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            {/* Header */}
            <div className="bg-white border-b top-0 z-50 shadow-lg">
                <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900">ГидроАтлас — Приоритизация</h1>
                        <p className="text-lg text-gray-600 mt-2">
                            Всего объектов: <strong>{total}</strong> | Показано: <strong>{objects.length}</strong>
                        </p>
                    </div>

                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Поиск по названию..."
                            className="w-full pl-12 pr-6 py-4 text-lg border rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Фильтры */}
            <div className="max-w-7xl mx-auto px-6 py-6">
                <div className="bg-white rounded-2xl shadow-md border p-6">
                    <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
                        <MapPin className="w-5 h-5" /> Фильтры и сортировка
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        <select
                            value={regionId || ''}
                            onChange={(e) => setRegionId(e.target.value ? Number(e.target.value) : null)}
                            className="px-5 py-3 border rounded-xl bg-gray-50"
                            disabled={loadingFilters}
                        >
                            <option value="">Все области</option>
                            {regions.map(r => (
                                <option key={r.id} value={r.id}>{r.region}</option>
                            ))}
                        </select>

                        <select
                            value={resourceTypeId || ''}
                            onChange={(e) => setResourceTypeId(e.target.value ? Number(e.target.value) : null)}
                            className="px-5 py-3 border rounded-xl bg-gray-50"
                        >
                            <option value="">Тип ресурса</option>
                            {resourceTypes.map(t => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>

                        <select
                            value={waterTypeId || ''}
                            onChange={(e) => setWaterTypeId(e.target.value ? Number(e.target.value) : null)}
                            className="px-5 py-3 border rounded-xl bg-gray-50"
                        >
                            <option value="">Тип воды</option>
                            {waterTypes.map(t => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>

                        <select
                            value={conditionFilter || ''}
                            onChange={(e) => setConditionFilter(e.target.value ? Number(e.target.value) : null)}
                            className="px-5 py-3 border rounded-xl bg-gray-50"
                        >
                            <option value="">Состояние</option>
                            {[1, 2, 3, 4, 5].map(n => (
                                <option key={n} value={n}>Категория {n}</option>
                            ))}
                        </select>

                        <button
                            onClick={() => {
                                setRegionId(null);
                                setResourceTypeId(null);
                                setWaterTypeId(null);
                                setConditionFilter(null);
                                setSearchQuery('');
                            }}
                            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-xl transition"
                        >
                            Сбросить
                        </button>
                    </div>
                </div>
            </div>

            {/* Таблица */}
            <div className="max-w-7xl mx-auto px-6 pb-12">
                <div className="bg-white rounded-2xl shadow-xl border overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-linear-to-r from-indigo-700 to-blue-800 text-white">
                            <tr>
                                <th className="p-6 text-left font-medium cursor-pointer hover:bg-white/10 transition" onClick={() => toggleSort('name')}>
                                    Название <ArrowUpDown className="inline ml-2 w-4 h-4" />
                                </th>
                                <th className="p-6 text-left font-medium cursor-pointer hover:bg-white/10" onClick={() => toggleSort('region')}>
                                    Область
                                </th>
                                <th className="p-6 text-left">Тип</th>
                                <th className="p-6 text-center cursor-pointer" onClick={() => toggleSort('technical_condition')}>
                                    Состояние
                                </th>
                                <th className="p-6 text-center cursor-pointer" onClick={() => toggleSort('priority_score')}>
                                    Приоритет обследования <ArrowUpDown className="inline ml-2 w-4 h-4" />
                                </th>
                                <th className="p-6 text-center">Паспорт</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                Array(10).fill(0).map((_, i) => (
                                    <tr key={i}>
                                        <td colSpan={6} className="p-8">
                                            <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : objects.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12 text-gray-500">
                                        Объекты не найдены
                                    </td>
                                </tr>
                            ) : (
                                objects.map(obj => {
                                    const level = getPriorityLevel(obj.priority_score || 0);
                                    return (
                                        <tr
                                            key={obj.id}
                                            onClick={() => setSelectedObject(obj)}
                                            className="hover:bg-blue-50 transition cursor-pointer"
                                        >
                                            <td className="p-6">
                                                <p className="font-semibold text-gray-900">{obj.name}</p>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {obj.latitude.toFixed(4)}, {obj.longitude.toFixed(4)}
                                                </p>
                                            </td>
                                            <td className="p-6 text-gray-700">{obj.region}</td>
                                            <td className="p-6">
                                                <span className="px-4 py-1.5 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                                                    {obj.resource_type}
                                                </span>
                                            </td>
                                            <td className="p-6 text-center">
                                                <div className={`w-14 h-14 mx-auto rounded-full ${getConditionColor(obj.technical_condition)} text-white text-xl font-bold flex items-center justify-center shadow-lg`}>
                                                    {obj.technical_condition}
                                                </div>
                                            </td>
                                            <td className="p-6 text-center">
                                                <div>
                                                    <span className={`px-6 py-2.5 rounded-full text-white font-bold ${getPriorityColor(level)} shadow-md`}>
                                                        {level}
                                                        {level === 'Высокий' && <AlertTriangle className="inline ml-2 w-5 h-5" />}
                                                    </span>
                                                    <p className="text-xs text-gray-500 mt-2">Score: {obj.priority_score}</p>
                                                </div>
                                            </td>
                                            <td className="p-6 text-center ">
                                                <button
                                                    onClick={() => {
                                                       openPdf(obj.id)
                                                    }}
                                                    className="text-blue-600 cursor-pointer font-medium hover:underline"
                                                >
                                                    Открыть PDF →
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>

                    {/* Пагинация */}
                    {pages > 1 && (
                        <div className="flex justify-center items-center gap-8 py-6 border-t bg-gray-50">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1 || loading}
                                className="flex items-center gap-3 px-6 py-3 bg-white border rounded-xl disabled:opacity-50 hover:shadow-md transition"
                            >
                                <ChevronLeft className="w-5 h-5" /> Назад
                            </button>
                            <span className="text-lg font-medium">
                                Страница <strong>{page}</strong> из <strong>{pages}</strong>
                            </span>
                            <button
                                onClick={() => setPage(p => Math.min(pages, p + 1))}
                                disabled={page === pages || loading}
                                className="flex items-center gap-3 px-6 py-3 bg-white border rounded-xl disabled:opacity-50 hover:shadow-md transition"
                            >
                                Вперед <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <ObjectCard
                selectedObject={selectedObject}
                setSelectedObject={setSelectedObject}
                onUpdate={fetchObjects} // обновить список
                onDelete={fetchObjects}  // обновить список после удаления
            />
        </div>
    );
}