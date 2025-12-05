// components/map/ObjectCard.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { X, FileText, MapPin, AlertCircle, Droplet, Thermometer, Beaker } from 'lucide-react';

import type { MapObject } from '@/types/maps';
import { getPriorityLevel, priorityColors, isWaterQuality, isRiverLevel } from '../../types/maps';

interface ObjectCardProps {
  selectedObject: MapObject | null;
  setSelectedObject: (obj: null) => void;
  handleOpenPassport: () => void;
}

export default function ObjectCard({
  selectedObject,
  setSelectedObject,
  handleOpenPassport,
}: ObjectCardProps) {
  if (!selectedObject) return null;

  const isQuality = isWaterQuality(selectedObject);
  const isRiver = isRiverLevel(selectedObject);

  const priority = getPriorityLevel(selectedObject);

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
                : selectedObject.object_name}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          {/* Левая колонка */}
          <div className="space-y-4">
            <div>
              <strong className="text-gray-600">Координаты:</strong>
              <span className="font-mono text-xs ml-2">
                {selectedObject.lat.toFixed(5)}, {selectedObject.lng.toFixed(5)}
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

          {/* Правая колонка */}
          <div className="space-y-4">
            {isRiver ? (
              <>
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                  <Droplet className="w-6 h-6 text-blue-600" />
                  <div>
                    <div>
                      <p className="text-sm text-gray-600">Текущий уровень</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {selectedObject.actual_level_cm} <span className="text-sm">см</span>
                      </p>
                    </div>
                  </div>
                </div>

                {selectedObject.danger_level_cm && (
                  <div className="flex items-center gap-3 text-red-600">
                    <AlertCircle className="w-5 h-5" />
                    <div>
                      <strong>Опасный уровень:</strong>{' '}
                      {selectedObject.danger_level_cm} см
                    </div>
                  </div>
                )}

                {selectedObject.actual_discharge_m3s !== null && (
                  <div>
                    <strong className="text-gray-600">Расход воды:</strong>{' '}
                    <span className="font-bold">{selectedObject.actual_discharge_m3s} м³/с</span>
                  </div>
                )}

                {selectedObject.water_temperature_C !== null && (
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-5 h-5 text-orange-500" />
                    <span className="font-medium">{selectedObject.water_temperature_C} °C</span>
                  </div>
                )}

                <div className="text-xs text-gray-500 mt-3">
                  Измерено: {format(new Date(selectedObject.date), 'dd.MM.yyyy HH:mm')}
                </div>
              </>
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
                          className={`p-3 rounded-lg border ${
                            exceeds ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
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
        <div className="mt-6 flex gap-3">
          <button
            onClick={handleOpenPassport}
            className="flex-1 bg-gray-200 text-gray-600 py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-300 transition"
          >
            <FileText className="w-5 h-5" />
            Паспорт недоступен
          </button>
          <button className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition flex items-center justify-center">
            <MapPin className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}