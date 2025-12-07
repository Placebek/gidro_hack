'use client';

import { Calendar, AlertTriangle, Droplets, CloudRain } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const years = [2025, 2024, 2023, 2022, 2021];

export default function FloodPredictorsPage() {
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [activeTab, setActiveTab] = useState<'risk' | 'autumn' | 'winter'>('risk');

  // Лоадер контента при переключении
  const [loadingContent, setLoadingContent] = useState(false);

  // Лоадер изображений карт
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const tabs = [
    { id: 'risk', label: 'Паводкоопасные регионы', icon: AlertTriangle, color: 'text-orange-600' },
    { id: 'autumn', label: 'Осеннее увлажнение', icon: Droplets, color: 'text-amber-600' },
    { id: 'winter', label: 'Осадки за холодный период', icon: CloudRain, color: 'text-blue-600' },
  ];

  // Включаем лоадер при смене вкладки или года
  useEffect(() => {
    setLoadingContent(true);
    setImagesLoaded(false);

    const timer = setTimeout(() => {
      setLoadingContent(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [activeTab, selectedYear]);

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white pt-20">
      {/* HERO */}
      <motion.div
        className="bg-linear-to-r from-blue-700 to-cyan-600 text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Предикторы весенних паводков</h1>
          <p className="text-xl opacity-90 max-w-3xl">
            Прогноз рисков подтопления на основе данных РГП «Казгидромет»
          </p>
        </div>
      </motion.div>

      {/* ВЫБОР ГОДА */}
      <div className="max-w-6xl mx-auto px-6 -mt-8 relative z-10">
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Выберите год</h2>
          </div>

          <div className="flex flex-wrap gap-3">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-6 py-3 rounded-xl font-medium transition-all transform ${
                  selectedYear === year
                    ? 'bg-blue-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:scale-105'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-12">
        {/* ВКЛАДКИ */}
        <div className="flex flex-wrap gap-8 mb-10 border-b-2 border-gray-200 pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-3 px-6 py-4 font-semibold text-lg transition-all relative group ${
                activeTab === tab.id ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className={`w-7 h-7 ${tab.color}`} />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full"
                  layoutId="underline"
                />
              )}
            </button>
          ))}
        </div>

        {/* ЛОАДЕР КОНТЕНТА */}
        {loadingContent && (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
          </div>
        )}

        {/* ОСНОВНОЙ КОНТЕНТ */}
        <AnimatePresence mode="wait">
          {!loadingContent && (
            <motion.div
              key={activeTab + selectedYear}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {activeTab === 'risk' ? (
                <RiskMap selectedYear={selectedYear} imagesLoaded={imagesLoaded} setImagesLoaded={setImagesLoaded} />
              ) : (
                <SeasonMaps activeTab={activeTab} selectedYear={selectedYear} setImagesLoaded={setImagesLoaded} />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ЛЕГЕНДА */}
        {activeTab === 'risk' && !loadingContent && <Legend selectedYear={selectedYear} />}

        {/* ПОДВАЛ */}
        <div className="mt-20 text-center text-gray-600">
          <p className="text-lg">Данные предоставлены РГП «Казгидромет»</p>
          <p className="mt-3 opacity-80">Обновление прогноза: 1 февраля и 1 марта ежегодно</p>
        </div>
      </div>
    </div>
  );
}

/* ========== КОМПОНЕНТЫ ========== */

function RiskMap({ selectedYear, imagesLoaded, setImagesLoaded }: any) {
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div className="group" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 hover:shadow-3xl">
          <div className="bg-linear-to-r from-orange-600 to-red-600 text-white p-6">
            <h3 className="text-2xl font-bold">Уровень паводковой опасности</h3>
            <p className="text-lg opacity-90 mt-2">По состоянию на 1 марта {selectedYear} года</p>
          </div>

          {/* Лоадер изображения */}
          {!imagesLoaded && (
            <div className="w-full h-96 bg-gray-200 animate-pulse"></div>
          )}

          <img
            src={`src/assets/img/flood-maps/risk.jpeg`}
            alt="risk map"
            className={`w-full h-auto object-contain transition-all ${imagesLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImagesLoaded(true)}
            onError={(e) => (e.currentTarget.src = 'src/assets/img/flood-maps/placeholder.jpeg')}
          />
        </div>
      </motion.div>
    </div>
  );
}

function SeasonMaps({ activeTab, selectedYear, setImagesLoaded }: any) {
  return (
    <div className="grid md:grid-cols-2 gap-10">
      {/* КАРТА 1 */}
      <MapCard
        title={activeTab === 'autumn' ? 'Сумма осадков за осень' : 'Сумма осадков за холодный период'}
        year={selectedYear}
        src={`src/assets/img/flood-maps/${activeTab}-sum.jpeg`}
        colors={activeTab === 'autumn' ? 'from-amber-600 to-orange-600' : 'from-blue-600 to-cyan-600'}
        setImagesLoaded={setImagesLoaded}
      />

      {/* КАРТА 2 */}
      <MapCard
        title="Отклонение от нормы, %"
        year={selectedYear}
        src={`src/assets/img/flood-maps/${activeTab}-anomaly.jpeg`}
        colors="from-purple-600 to-pink-600"
        setImagesLoaded={setImagesLoaded}
      />
    </div>
  );
}

function MapCard({ title, year, src, colors, setImagesLoaded }: any) {
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.div className="group" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 hover:shadow-3xl">
        <div className={`p-6 text-white bg-linear-to-r ${colors}`}>
          <h3 className="text-2xl font-bold">{title}</h3>
          <p className="text-lg opacity-90 mt-2">На 1 марта {year}</p>
        </div>

        {!loaded && <div className="w-full h-80 bg-gray-200 animate-pulse" />}

        <img
          src={src}
          alt={title}
          className={`w-full h-auto object-contain transition ${loaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => {
            setLoaded(true);
            setImagesLoaded(true);
          }}
          onError={(e) => (e.currentTarget.src = 'src/assets/img/flood-maps/placeholder.jpeg')}
        />
      </div>
    </motion.div>
  );
}

function Legend({ selectedYear }: any) {
  return (
    <motion.div
      className="mt-16 max-w-4xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-200">
        <h3 className="text-3xl font-bold text-gray-900 mb-8 flex items-center justify-center gap-4">
          <AlertTriangle className="w-10 h-10 text-orange-600" />
          Уровень паводковой опасности
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { color: 'bg-red-600', title: 'Высокий риск', desc: 'Значительное подтопление вероятно' },
            { color: 'bg-orange-500', title: 'Средний риск', desc: 'Локальные подтопления возможны' },
            { color: 'bg-green-600', title: 'Низкий риск', desc: 'Паводок маловероятен' },
          ].map((item) => (
            <div key={item.title} className="flex items-center gap-5">
              <div className={`w-16 h-16 rounded-xl shadow-lg ${item.color}`} />
              <div>
                <p className="font-bold text-xl">{item.title}</p>
                <p className="text-gray-600 mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-500 mt-8 text-sm">
          Данные РГП «Казгидромет» • Прогноз на весну {selectedYear}
        </p>
      </div>
    </motion.div>
  );
}
