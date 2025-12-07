'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import {
  X, AlertCircle, Droplet, Thermometer, Download, BarChart3, FileDown, FileText, RefreshCw
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import axios from 'axios';

interface HistoryPoint {
  date: string;
  time: string;
  level_cm: number;
  discharge_m3s?: number;
  temperature_C?: number | null;
}

interface MapObject {
  id: number;
  object_name: string;
  region: string;
  resource_type: string;
  technical_condition: number;
  latitude: number;
  longitude: number;
  danger_level_cm?: number;
  actual_level_cm?: number;
  actual_discharge_m3s?: number;
  water_temperature_C?: number | null;
  pdf_url?: string;
  passport_date?: string | null;
  history: HistoryPoint[];
}

interface ObjectCardProps {
  selectedObject: MapObject | null;
  setSelectedObject: (obj: MapObject | null) => void;
  onClose?: () => void;
}

export default function ObjectCardMap({ selectedObject, setSelectedObject, onClose }: ObjectCardProps) {
  const [tabValue, setTabValue] = useState<'analysis' | 'chart' | 'export'>('analysis');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [loading, setLoading] = useState(false);

  if (!selectedObject) return null;

  // Загружаем свежие данные при открытии
  useEffect(() => {
    const fetchFullData = async () => {
      if (!selectedObject?.id) return;

      debugger
      setLoading(true);
      try {
        const { data } = await axios.get(`http://localhost:8000/api/object/${selectedObject.id}`);
        // Обновляем объект в родителе — теперь он будет с актуальными данными + историей!
        setSelectedObject({
          ...selectedObject,
          ...data,
          history: data.history || selectedObject.history || [],
          actual_level_cm: data.actual_level_cm ?? selectedObject.actual_level_cm,
          actual_discharge_m3s: data.actual_discharge_m3s ?? selectedObject.actual_discharge_m3s,
          water_temperature_C: data.water_temperature_C ?? selectedObject.water_temperature_C,
          pdf_url: data.pdf_url || selectedObject.pdf_url,
        });
      } catch (err: any) {
        console.error('Ошибка загрузки данных объекта:', err);
        // Можно показать уведомление
      } finally {
        setLoading(false);
      }
    };

    fetchFullData();
  }, [selectedObject?.id]); // только при смене объекта

  // График — только утренние замеры
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

  const currentLevel = selectedObject.actual_level_cm;
  const dangerLevel = selectedObject.danger_level_cm || 0;
  const isWarning = currentLevel && dangerLevel && currentLevel >= dangerLevel * 0.9;
  const isDanger = currentLevel && dangerLevel && currentLevel >= dangerLevel;

  const handleExport = () => {
    if (!dateRange.from || !dateRange.to) {
      alert('Выберите период');
      return;
    }
    window.open(
      `http://localhost:8000/api/object/${selectedObject.id}/export?from=${dateRange.from}&to=${dateRange.to}&format=pdf`,
      '_blank'
    );
  };

  const openPassport = () => {
    if (selectedObject.pdf_url) {
      window.open(selectedObject.pdf_url, '_blank');
    } else {
      alert('Паспорт объекта недоступен');
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed inset-x-4 bottom-8 mx-auto max-w-4xl z-50"
      >
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Хедер */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-700 px-8 py-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-3xl font-bold">{selectedObject.object_name}</h3>
                <p className="text-indigo-100 mt-2 flex items-center gap-3">
                  {selectedObject.region} · {selectedObject.resource_type}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {loading && <RefreshCw className="w-5 h-5 animate-spin" />}
                <button
                  onClick={() => {
                    setSelectedObject(null);
                    onClose?.();
                  }}
                  className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition"
                >
                  <X className="w-7 h-7" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Вкладки */}
            <Tabs value={tabValue} onValueChange={(v) => setTabValue(v as any)} className="w-full">
              <TabsList className="grid w-full grid-cols-3 h-14 bg-gray-100 rounded-2xl p-2 mb-8">
                <TabsTrigger value="analysis" className="data-[state=active]:bg-white data-[state=active]:shadow-lg rounded-xl font-semibold transition-all">
                  <AlertCircle className="w-5 h-5 mr-2" /> Анализ
                </TabsTrigger>
                <TabsTrigger value="chart" className="data-[state=active]:bg-white data-[state=active]:shadow-lg rounded-xl font-semibold transition-all">
                  <BarChart3 className="w-5 h-5 mr-2" /> График
                </TabsTrigger>
                <TabsTrigger value="export" className="data-[state=active]:bg-white data-[state=active]:shadow-lg rounded-xl font-semibold transition-all">
                  <FileDown className="w-5 h-5 mr-2" /> Экспорт
                </TabsTrigger>
              </TabsList>

              {/* Содержимое */}
              <div className="min-h-[400px]">
                {tabValue === 'analysis' && (
                  <div className="space-y-6">
                    <div className={`p-8 rounded-3xl border-4 text-center ${isDanger ? 'bg-red-50 border-red-400' : isWarning ? 'bg-amber-50 border-amber-400' : 'bg-blue-50 border-blue-400'}`}>
                      <Droplet className={`w-20 h-20 mx-auto mb-4 ${isDanger ? 'text-red-600' : isWarning ? 'text-amber-600' : 'text-blue-600'}`} />
                      <p className="text-lg text-gray-700">Текущий уровень воды</p>
                      <p className={`text-6xl font-bold mt-3 ${isDanger ? 'text-red-600' : isWarning ? 'text-amber-600' : 'text-blue-600'}`}>
                        {currentLevel || '—'} <span className="text-2xl font-normal">см</span>
                      </p>
                      {dangerLevel > 0 && (
                        <p className="text-sm text-gray-600 mt-4">
                          Опасный уровень: <strong className="text-red-600">{dangerLevel} см</strong>
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-6 text-center">
                      {selectedObject.actual_discharge_m3s !== undefined && (
                        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-6 rounded-2xl">
                          <p className="text-gray-600">Расход воды</p>
                          <p className="text-3xl font-bold text-cyan-700 mt-2">
                            {selectedObject.actual_discharge_m3s} <span className="text-lg font-normal">м³/с</span>
                          </p>
                        </div>
                      )}
                      {selectedObject.water_temperature_C !== null && (
                        <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-2xl">
                          <p className="text-gray-600">Температура воды</p>
                          <p className="text-3xl font-bold text-orange-600 mt-2">
                            {selectedObject.water_temperature_C} °C
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {tabValue === 'chart' && (
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

                {tabValue === 'export' && (
                  <div className="space-y-8">
                    <div>
                      <p className="text-lg font-medium text-gray-700 mb-4">Выберите период для экспорта</p>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm text-gray-600 mb-2">С даты</label>
                          <input
                            type="date"
                            className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none transition"
                            onChange={(e) => setDateRange(p => ({ ...p, from: e.target.value }))}
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-2">По дату</label>
                          <input
                            type="date"
                            className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none transition"
                            onChange={(e) => setDateRange(p => ({ ...p, to: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleExport}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-5 rounded-2xl font-bold text-lg shadow-xl transition flex items-center justify-center gap-4"
                    >
                      <Download className="w-7 h-7" />
                      Скачать отчёт в PDF
                    </button>
                  </div>
                )}
              </div>
            </Tabs>

            {/* Кнопка паспорта */}
            <button
              onClick={openPassport}
              className="mt-8 w-full bg-gray-900 hover:bg-gray-800 text-white py-5 rounded-2xl font-bold text-lg shadow-xl transition flex items-center justify-center gap-4"
            >
              <FileText className="w-7 h-7" />
              Открыть технический паспорт
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}