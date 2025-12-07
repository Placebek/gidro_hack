
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { X, FileText, MapPin, AlertCircle, Droplet, Thermometer, Beaker, Download, BarChart3, FileDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { MapObject } from '@/types/maps';
import { getPriorityLevel, priorityColors, isWaterQuality, isRiverLevel } from '../../types/maps';
import axios from 'axios';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { useEffect, useMemo, useState } from 'react';

interface ObjectCardProps {
    selectedObject: MapObject | null,
    setSelectedObject: (obj: null) => void;
    handleOpenPassport: () => void;
}

const mockHistoryData = [
    { date: '2025-11-30', level: 245 },
    { date: '2025-12-01', level: 252 },
    { date: '2025-12-02', level: 248 },
    { date: '2025-12-03', level: 260 },
    { date: '2025-12-04', level: 275 },
    { date: '2025-12-05', level: 268 },
    { date: '2025-12-06', level: 272 },
];

export default function ObjectCardMap({
    selectedObject,
    setSelectedObject,
}: ObjectCardProps) {
    if (!selectedObject) return null;

    const isQuality = isWaterQuality(selectedObject);
    const isRiver = isRiverLevel(selectedObject);
    const [loading, setLoading] = useState(false);
    const [tabValue, setTabValue] = useState<'analysis' | 'chart' | 'export'>('analysis');
    const [dateRange, setDateRange] = useState({ from: '', to: '' });
    const currentLevel = selectedObject.actual_level_cm;
    const dangerLevel = selectedObject.danger_level_cm || 0;
    const isWarning = currentLevel && dangerLevel && currentLevel >= dangerLevel * 0.9;
    const isDanger = currentLevel && dangerLevel && currentLevel >= dangerLevel;

    const priority = getPriorityLevel(selectedObject);

    const API_BASE = 'http://localhost:8000';

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

    useEffect(() => {
        const fetchFullData = async () => {
            if (!selectedObject?.id) return;

            setLoading(true);
            try {
                const numericId = selectedObject.id.toString().match(/\d+$/)?.[0];
                if (!numericId) throw new Error("Не удалось извлечь ID")
                const { data } = await axios.get(`http://localhost:8000/api/object/${numericId}`);
                // Обновляем объект в родителе — теперь он будет с актуальными данными + историей!
                setSelectedObject({
                    ...selectedObject,
                    ...data,
                    history: data.history || [],
                });
            } catch (err: any) {
                console.error('Ошибка загрузки данных объекта:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchFullData();
    }, [selectedObject?.id]); // только при смене объекта

    const getNumericId = (id: string | number) => {
        if (typeof id === 'number') return id; // уже число
        const match = id.match(/\d+$/);        // ищем числа в конце строки
        if (!match) throw new Error(`Невозможно извлечь ID из ${id} `);
        return Number(match[0]);
    };
    // Функция экспорта (пока заглушка, потом подключишь реальный эндпоинт)
    const handleExport = () => {
        if (!dateRange.from || !dateRange.to) {
            alert('Выберите период для экспорта');
            return;
        }
        // Пример: /api/object/123/export?from=2025-11-01&to=2025-12-06
        window.location.href = `${API_BASE} /api/object / ${selectedObject.id}/export?from=${dateRange.from}&to=${dateRange.to}&format=pdf`;
    };

    function analyzeWater(id: number): void {
        throw new Error('Function not implemented.');
    }

    const chartData = useMemo(() => {
        if (!selectedObject.history?.length) return [];

        return selectedObject.history
            .filter(h => h.time.startsWith('08:')) // 08:00, 08:30 и т.д.
            .map(h => ({
                date: h.date,
                level: h.level_cm,
                discharge: h.discharge_m3s,
                temp: h.temperature_C
            }))
            .sort((a, b) => a.date.localeCompare(b.date)); // от старого к новому

    }, [selectedObject.history]);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-white rounded-2xl shadow-2xl p-6 max-w-2xl w-full mx-4 border border-gray-200"
            >
                {/* Заголовок */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900">
                            {isQuality
                                ? selectedObject.description.split('\r')[0]
                                : selectedObject.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                            {isQuality ? (
                                <>
                                    <Beaker className="w-4 h-4" />
                                    Качество воды
                                </>
                            ) : (
                                <>
                                    <Droplet className="w-4 h-4" />
                                    Уровень воды (реальное время)
                                </>
                            )}
                        </p>
                    </div>
                    <button
                        onClick={() => setSelectedObject(null)}
                        className="w-10 h-10 rounded-full hover:bg-gray-100 transition flex items-center justify-center"
                    >
                        <X className="w-6 h-6 text-gray-600" />
                    </button>
                </div>

                {/* Основная информация */}
                <div className=" text-sm">
                    {/* Левая колонка */}
                    {/* <div className="space-y-4">
                        <div>
                            <strong className="text-gray-600">Координаты:</strong>
                            <span className="font-mono text-xs ml-2">
                                {selectedObject.latitude.toFixed(5)}, {selectedObject.longitude.toFixed(5)}
                            </span>
                        </div>

                        {isQuality && (
                            <div>
                                <strong className="text-gray-600">Описание:</strong>
                                <p className="text-xs text-gray-700 mt-1 leading-relaxed">
                                    {selectedObject.description.split('\r\r\n')[0]}
                                </p>
                            </div>
                        )}

                        {isRiver && selectedObject.water_object_code && (
                            <div>
                                <strong className="text-gray-600">Код объекта:</strong>
                                <span className="ml-2 font-medium">{selectedObject.water_object_code}</span>
                            </div>
                        )}
                    </div>

                    Правая колонка */}
                    <div className="space-y-4">
                        {isRiver ? (
                            <Tabs value={tabValue} onValueChange={(value) => setTabValue(value as 'analysis' | 'chart' | 'export')} className="w-full">
                                <TabsList className="grid w-full grid-cols-3 h-12 bg-gray-100 rounded-xl p-1">
                                    <TabsTrigger
                                        value="analysis"
                                        className="data-[state=active]:bg-white cursor-pointer data-[state=active]:shadow-sm rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium"
                                    >
                                        <AlertCircle className="w-4 h-4" />
                                        Анализ
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="chart"
                                        className="data-[state=active]:bg-white cursor-pointer data-[state=active]:shadow-sm rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium"
                                    >
                                        <BarChart3 className="w-4 h-4" />
                                        График
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="export"
                                        className="data-[state=active]:bg-white cursor-pointer data-[state=active]:shadow-sm rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium"
                                    >
                                        <FileDown className="w-4 h-4" />
                                        Экспорт
                                    </TabsTrigger>
                                </TabsList>

                                {/* Анимированный контент */}
                                <div className="mt-6">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={tabValue}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.25, ease: "easeOut" }}
                                        >
                                            {tabValue === "analysis" && (
                                                <TabsContent value="analysis" forceMount className="space-y-3">
                                                    <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-2xl">
                                                        <Droplet className="w-8 h-8 text-blue-600" />
                                                        <p className="text-2xl font-bold text-blue-600">
                                                            {selectedObject.history?.[selectedObject.history.length - 1]?.date ?? "—"}
                                                            <span className="text-lg font-normal">см</span>
                                                        </p>

                                                    </div>

                                                    {selectedObject.danger_level_cm && (
                                                        <div className="flex items-center gap-3 text-red-600 bg-red-50 px-5 py-4 rounded-xl">
                                                            <AlertCircle className="w-6 h-6" />
                                                            <div>
                                                                <strong className="font-semibold">Опасный уровень:</strong>{' '}
                                                                {selectedObject.danger_level_cm} см
                                                            </div>
                                                        </div>
                                                    )}

                                                    {selectedObject.actual_discharge_m3s !== null && (
                                                        <div className="text-gray-700 text-lg">
                                                            <strong>Расход воды:</strong>{' '}
                                                            <span className="font-bold">{selectedObject.actual_discharge_m3s} м³/с</span>
                                                        </div>
                                                    )}

                                                    {selectedObject.water_temperature_C !== null && (
                                                        <div className="flex items-center gap-3 text-orange-600">
                                                            <Thermometer className="w-6 h-6" />
                                                            <span className="text-lg font-semibold">{selectedObject.water_temperature_C} °C</span>
                                                        </div>
                                                    )}

                                                    <button
                                                        onClick={() => analyzeWater(getNumericId(selectedObject.id))}
                                                        className="w-full cursor-pointer mt-6 bg-linear-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition shadow-lg"
                                                    >
                                                        Провести анализ объекта
                                                    </button>
                                                </TabsContent>
                                            )}

                                            {tabValue === "chart" && (
                                                chartData.length > 0 ? (
                                                    <div className="h-96 -mx-8">
                                                        <ResponsiveContainer width="100%" height="100%">
                                                            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                                                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                                                <XAxis
                                                                    dataKey="date"
                                                                    tickFormatter={(v) => format(new Date(v), 'dd MMM')}
                                                                    style={{ fontSize: '13px' }}
                                                                />
                                                                <YAxis label={{ value: 'Уровень (см)', angle: -90, position: 'insideLeft', style: { fontSize: '14px' } }} />
                                                                <Tooltip
                                                                    labelFormatter={(v) => format(new Date(v as string), 'dd MMMM yyyy')}
                                                                    formatter={(value) => [`${value} см`, 'Уровень']}
                                                                />
                                                                {dangerLevel > 0 && (
                                                                    <ReferenceLine y={dangerLevel} stroke="#ef4444" strokeDasharray="6 6" label={{ value: 'ОПАСНЫЙ УРОВЕНЬ', position: 'right' }} />
                                                                )}
                                                                <Line
                                                                    type="monotone"
                                                                    dataKey="level"
                                                                    stroke="#2563eb"
                                                                    strokeWidth={4}
                                                                    dot={{ fill: '#2563eb', r: 6 }}
                                                                    activeDot={{ r: 9 }}
                                                                />
                                                            </LineChart>
                                                        </ResponsiveContainer>
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-20 text-gray-500">
                                                        Нет данных для отображения графика
                                                    </div>
                                                )
                                            )}

                                            {tabValue === "export" && (
                                                <TabsContent value="export" forceMount className="space-y-5">
                                                    <div className="space-y-4">
                                                        <p className="font-medium text-gray-700">Выберите период для отчёта</p>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <input
                                                                type="date"
                                                                className="px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                                                            />
                                                            <input
                                                                type="date"
                                                                className="px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                                                            />
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={handleExport}
                                                        className="w-full bg-linear-to-r from-emerald-500 to-emerald-600 text-white py-4 rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition shadow-lg flex items-center justify-center gap-3"
                                                    >
                                                        <Download className="w-6 h-6" />
                                                        Скачать отчёт в PDF
                                                    </button>

                                                    <button className="w-full border-2 border-gray-300 py-4 rounded-xl font-medium hover:bg-gray-50 transition">
                                                        Скачать в Excel (.xlsx)
                                                    </button>
                                                </TabsContent>
                                            )}
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            </Tabs>
                        ) : (
                            // Качество воды — таблица параметров
                            <div>
                                <strong className="text-gray-700">Параметры качества воды:</strong>
                                {selectedObject.parameters.length === 0 ? (
                                    <p className="text-sm text-gray-500 mt-2">Нет данных</p>
                                ) : (
                                    <div className="mt-3 space-y-2">
                                        {selectedObject.parameters.map((p, i) => {
                                            const exceeds = p.concentration > p.background * 1.1;
                                            return (
                                                <div
                                                    key={i}
                                                    className={`p-3 rounded-lg border ${exceeds ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
                                                        }`}
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-medium">{p.parameter}</span>
                                                        <span className="text-xs text-gray-500">{p.unit}</span>
                                                    </div>
                                                    <div className="flex justify-between mt-1">
                                                        <span className="text-sm">
                                                            Измерено: <strong>{p.concentration}</strong>
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            ПДК: {p.background}
                                                        </span>
                                                    </div>
                                                    {exceeds && (
                                                        <span className="text-xs text-red-600 font-bold mt-1 block">
                                                            Превышение ПДК!
                                                        </span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Приоритет обследования */}
                <div className="mt-6 pt-5 border-t">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Приоритет обследования:</span>
                        <span className={`px-4 py-2 rounded-full font-bold text-sm ${priorityColors[priority]}`}>
                            {priority}
                        </span>
                    </div>
                </div>

                {/* Кнопки */}
                <div className="mt-6 flex gap-3 ">
                    <button
                        onClick={() => openPdf(getNumericId(selectedObject.id.toString()).toString())}
                        className="flex-1 bg-green-200 cursor-pointer text-gray-600 py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-green-300 transition"
                    >
                        <FileText className="w-5 h-5" />
                        Получить паспорт объекта
                    </button>

                    <button className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
