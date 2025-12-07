// components/map/ObjectCard.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { X, FileText, MapPin, AlertTriangle, Calendar, Edit2, Save, Trash2, Check, XCircle } from 'lucide-react';

const API_BASE = 'http://localhost:8000';

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

interface ObjectCardProps {
  selectedObject: WaterObject | null;
  setSelectedObject: (obj: WaterObject | null) => void;
  onUpdate?: () => void; // чтобы обновить список после редактирования/удаления
  onDelete?: () => void;
}

const getConditionColor = (condition: number) => {
  const colors = ['bg-green-500', 'bg-lime-500', 'bg-yellow-500', 'bg-orange-500', 'bg-red-600'];
  return colors[condition - 1];
};

const getConditionText = (condition: number) => {
  const texts = ['Отличное', 'Хорошее', 'Удовлетворительное', 'Неудовлетворительное', 'Аварийное'];
  return texts[condition - 1];
};

const getPriorityLevel = (score: number): 'Высокий' | 'Средний' | 'Низкий' => {
  if (score >= 12) return 'Высокий';
  if (score >= 6) return 'Средний';
  return 'Низкий';
};

const getPriorityColor = (level: string) => {
  return level === 'Высокий' ? 'bg-red-600' :
         level === 'Средний' ? 'bg-amber-500' : 'bg-green-600';
};

export default function ObjectCard({
  selectedObject,
  setSelectedObject,
  onUpdate,
  onDelete,
}: ObjectCardProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<WaterObject | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Проверка роли эксперта
  const isExpert = typeof window !== 'undefined' && localStorage.getItem('role') === 'expert';

  useEffect(() => {
    if (selectedObject) {
      setFormData({ ...selectedObject });
    }
  }, [selectedObject]);

  if (!selectedObject || !formData) return null;

  const priorityLevel = getPriorityLevel(formData.priority_score || 0);

  const handleSave = async () => {
    try {
      await axios.patch(`${API_BASE}/api/object/${formData.id}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setSelectedObject(formData); // обновляем в родителе
      setIsEditMode(false);
      onUpdate?.();
      alert('Объект успешно обновлён');
    } catch (err) {
      alert('Ошибка при сохранении');
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Вы уверены, что хотите удалить этот объект? Это действие нельзя отменить.')) return;

    setIsDeleting(true);
    try {
      await axios.delete(`${API_BASE}/api/object/${formData.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setSelectedObject(null);
      onDelete?.();
      alert('Объект удалён');
    } catch (err) {
      alert('Ошибка при удалении');
    } finally {
      setIsDeleting(false);
    }
  };

    function handleOpenPassport(formData: WaterObject): void {
        throw new Error('Function not implemented.');
    }

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      className="fixed inset-x-4 bottom-8 mx-auto max-w-5xl z-50"
    >
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* Хедер */}
        <div className="bg-linear-to-r from-blue-600 to-indigo-700 px-8 py-6 text-white flex justify-between items-start">
          <div>
            {isEditMode ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="text-3xl font-bold bg-white/20 backdrop-blur px-4 py-2 rounded-lg text-white placeholder-white/70 outline-none"
                autoFocus
              />
            ) : (
              <h2 className="text-3xl font-bold">{formData.name}</h2>
            )}
            <p className="text-blue-100 mt-2">
              {formData.resource_type} · {formData.region}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isExpert && (
              <>
                {isEditMode ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="p-3 bg-green-600 hover:bg-green-700 rounded-xl transition"
                    >
                      <Save className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => {
                        setIsEditMode(false);
                        setFormData(selectedObject);
                      }}
                      className="p-3 bg-gray-600 hover:bg-gray-700 rounded-xl transition"
                    >
                      <XCircle className="w-6 h-6" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditMode(true)}
                    className="p-3 bg-white/20 hover:bg-white/30 backdrop-blur rounded-xl transition"
                  >
                    <Edit2 className="w-6 h-6" />
                  </button>
                )}
              </>
            )}
            <button
              onClick={() => setSelectedObject(null)}
              className="p-3 bg-white/20 hover:bg-white/30 backdrop-blur rounded-xl transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Левая часть */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Тип ресурса</label>
                  {isEditMode ? (
                    <select
                      value={formData.resource_type}
                      onChange={(e) => setFormData({ ...formData, resource_type: e.target.value as any })}
                      className="mt-1 w-full px-4 py-2 border rounded-lg"
                    >
                      <option value="озеро">Озеро</option>
                      <option value="канал">Канал</option>
                      <option value="водохранилище">Водохранилище</option>
                    </select>
                  ) : (
                    <p className="font-semibold mt-1">{formData.resource_type}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm text-gray-600">Тип воды</label>
                  {isEditMode ? (
                    <select
                      value={formData.water_type}
                      onChange={(e) => setFormData({ ...formData, water_type: e.target.value as any })}
                      className="mt-1 w-full px-4 py-2 border rounded-lg"
                    >
                      <option value="пресная">Пресная</option>
                      <option value="непресная">Непресная</option>
                    </select>
                  ) : (
                    <p className="font-semibold mt-1">
                      {formData.water_type === 'пресная' ? 'Пресная' : 'Непресная'}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-600">Область</label>
                {isEditMode ? (
                  <input
                    type="text"
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    className="mt-1 w-full px-4 py-2 border rounded-lg"
                  />
                ) : (
                  <p className="font-semibold mt-1">{formData.region}</p>
                )}
              </div>

              <div className="flex items-center gap-8">
                <div>
                  <label className="text-sm text-gray-600">Фауна</label>
                  {isEditMode ? (
                    <select
                      value={formData.fauna ? 'yes' : 'no'}
                      onChange={(e) => setFormData({ ...formData, fauna: e.target.value === 'yes' })}
                      className="mt-1 px-4 py-2 border rounded-lg"
                    >
                      <option value="yes">Есть</option>
                      <option value="no">Нет</option>
                    </select>
                  ) : (
                    <p className="font-semibold mt-1">{formData.fauna ? 'Есть' : 'Нет'}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm text-gray-600">Состояние</label>
                  {isEditMode ? (
                    <select
                      value={formData.technical_condition}
                      onChange={(e) => setFormData({ ...formData, technical_condition: Number(e.target.value) as any })}
                      className="mt-1 px-6 py-3 border rounded-lg font-bold"
                    >
                      {[1,2,3,4,5].map(n => (
                        <option key={n} value={n}>Категория {n}</option>
                      ))}
                    </select>
                  ) : (
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${getConditionColor(formData.technical_condition)} text-white text-2xl font-bold mt-1`}>
                      {formData.technical_condition}
                    </div>
                  )}
                </div>
              </div>

              {/* <div>
                <label className="text-sm text-gray-600">Дата паспорта</label>
                {isEditMode ? (
                  <input
                    type="date"
                    value={formData.passport_date}
                    onChange={(e) => setFormData({ ...formData, passport_date: e.target.value })}
                    className="mt-1 w-full px-4 py-2 border rounded-lg"
                  />
                ) : (
                  <p className="font-semibold mt-1">
                    {new Date(formData.passport_date).toLocaleDateString('ru-KZ')}
                  </p>
                )}
              </div> */}
            </div>

            {/* Правая часть — статус */}
            <div className="space-y-6">
              <div className="text-center p-8 bg-linear-to-br from-purple-50 to-blue-50 rounded-2xl">
                <p className="text-lg font-medium text-gray-700">Текущее состояние</p>
                <div className={`mx-auto mt-4 w-32 h-32 rounded-full ${getConditionColor(formData.technical_condition)} text-white text-5xl font-bold flex items-center justify-center shadow-xl`}>
                  {formData.technical_condition}
                </div>
                <p className="mt-4 text-xl font-bold">{getConditionText(formData.technical_condition)}</p>
              </div>

              <div className="bg-linear-to-br from-red-50 to-orange-50 p-6 rounded-2xl border border-red-200">
                <p className="font-medium flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  Приоритет обследования
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-3xl font-bold">{priorityLevel}</span>
                  <span className={`ml-auto px-6 py-3 rounded-full text-white font-bold ${getPriorityColor(priorityLevel)}`}>
                    Score: {formData.priority_score}
                  </span>
                </div>
                {priorityLevel === 'Высокий' && (
                  <p className="text-red-600 font-bold mt-3">Требует срочного внимания!</p>
                )}
              </div>
            </div>
          </div>

          {/* Нижние кнопки */}
          <div className="mt-8 flex items-center justify-between">
            <div className="flex gap-3">
              <button
                onClick={() => handleOpenPassport?.(formData)}
                className={`px-6 py-4 rounded-xl font-semibold flex items-center gap-3 transition ${
                  formData.pdf_url
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
                disabled={!formData.pdf_url}
              >
                <FileText className="w-5 h-5" />
                {formData.pdf_url ? 'Открыть паспорт' : 'Паспорт отсутствует'}
              </button>

              {isExpert && !isEditMode && (
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-6 py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold flex items-center gap-3 transition hover:bg-red-700"
                >
                  <Trash2 className="w-5 h-5" />
                  {isDeleting ? 'Удаление...' : 'Удалить объект'}
                </button>
              )}
            </div>

            <button className="px-6 py-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition">
              <MapPin className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}