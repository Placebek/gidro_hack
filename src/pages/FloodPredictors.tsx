// app/flood-predictors/page.tsx
'use client';

import { Calendar, AlertTriangle, Droplets, CloudRain, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const years = [2025, 2024, 2023, 2022, 2021];

export default function FloodPredictorsPage() {
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [activeTab, setActiveTab] = useState<'risk' | 'autumn' | 'winter'>('risk');

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white pt-20">
      {/* Hero */}
      <div className="bg-linear-to-r from-blue-700 to-cyan-600 text-white">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Предикторы весенних паводков
          </h1>
          <p className="text-xl opacity-90 max-w-3xl">
            Прогноз рисков подтопления на основе данных РГП «Казгидромет»
          </p>
        </div>
      </div>

      {/* Выбор года */}
      <div className="max-w-6xl mx-auto px-6 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Выберите год</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  selectedYear === year
                    ? 'bg-blue-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Вкладки */}
      <div className="max-w-6xl mx-auto px-6 mt-12">
        <div className="flex flex-wrap gap-4 mb-10 border-b border-gray-200">
          {[
            { id: 'risk', label: 'Паводкоопасные регионы', icon: AlertTriangle, color: 'text-orange-600' },
            { id: 'autumn', label: 'Осеннее увлажнение', icon: Droplets, color: 'text-amber-600' },
            { id: 'winter', label: 'Осадки за холодный период', icon: CloudRain, color: 'text-blue-600' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-3 px-6 py-4 font-medium text-lg border-b-4 transition-all ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className={`w-6 h-6 ${tab.color}`} />
              {tab.label}
              <ChevronRight className="w-5 h-5 ml-2 opacity-0 group-hover:opacity-100 transition" />
            </button>
          ))}
        </div>

        {/* Контент */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Карта 1 */}
          <div className="group">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-2xl transition">
              <div className="bg-linear-to-r from-orange-500 to-red-500 text-white p-4">
                <h3 className="text-xl font-bold">
                  {activeTab === 'risk' && 'Паводкоопасные регионы'}
                  {activeTab === 'autumn' && 'Сумма осадков за осень'}
                  {activeTab === 'winter' && 'Сумма осадков за холодный период'}
                </h3>
                <p className="text-sm opacity-90 mt-1">По состоянию на 1 марта {selectedYear}</p>
              </div>
              <div className="relative">
                <img
                  src={`src/assets/img/flood-maps/${activeTab}-sum.jpeg`}
                  alt={`Карта ${selectedYear}`}
                  className="w-full h-96 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/flood-maps/placeholder.jpeg';
                  }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Карта 2 — отклонение от нормы */}
          <div className="group">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-2xl transition">
              <div className="bg-linear-to-r from-blue-500 to-cyan-500 text-white p-4">
                <h3 className="text-xl font-bold">
                  {activeTab === 'risk' && 'Уровень риска подтопления'}
                  {activeTab === 'autumn' && 'Отклонение осадков от нормы, %'}
                  {activeTab === 'winter' && 'Отклонение осадков от нормы, %'}
                </h3>
                <p className="text-sm opacity-90 mt-1">По состоянию на 1 марта {selectedYear}</p>
              </div>
              <div className="relative">
                <img 
                  src={`src/assets/img/flood-maps/${activeTab}-anomaly.jpeg`}
                  alt={`Аномалия ${selectedYear}`}
                  className="w-full h-96 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/flood-maps/placeholder.jpeg';
                  }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Легенда для паводкоопасных регионов */}
        {activeTab === 'risk' && (
          <div className="mt-12 bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-orange-600" />
              Легенда: Уровень паводковой опасности
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-orange-500 shadow"></div>
                <div>
                  <p className="font-bold text-lg">Высокий риск</p>
                  <p className="text-sm text-gray-600">Значительное подтопление возможно</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-yellow-500 shadow"></div>
                <div>
                  <p className="font-bold text-lg">Средний риск</p>
                  <p className="text-sm text-gray-600">Локальные подтопления</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-green-500 shadow"></div>
                <div>
                  <p className="font-bold text-lg">Низкий риск</p>
                  <p className="text-sm text-gray-600">Паводок маловероятен</p>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-6">
              Данные РГП «Казгидромет» на 1 марта {selectedYear} года
            </p>
          </div>
        )}

        {/* Подвал */}
        <div className="mt-16 text-center text-gray-500 text-sm">
          <p>Данные предоставлены РГП «Казгидромет»</p>
          <p className="mt-2">Обновление прогноза: 1 февраля и 1 марта ежегодно</p>
        </div>
      </div>
    </div>
  );
}