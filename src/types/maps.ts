// src/types/maps.ts

import L from 'leaflet';

// === 1. Точки качества воды ===
export interface WaterQualityPoint {
  id: string;
  lat: number;
  lng: number;
  description: string;
  parameters: Array<{
    index: string;
    parameter: string;
    unit: string;
    concentration: number;
    background: number;
  }>;
}

// === 2. Точки уровня воды (реальные гидропосты) ===
export interface RiverLevelPoint {
  id: string;
  lat: number;
  lng: number;
  object_name: string;
  date: string;
  danger_level_cm: number | null;
  actual_level_cm: number;
  actual_discharge_m3s: number | null;
  water_temperature_C: number | null;
  water_object_code: string;
}

// === Основной тип: только реальные данные ===
export type MapObject = WaterQualityPoint | RiverLevelPoint;

// === Утилиты для приоритета и цвета ===
export const getPriorityLevel = (obj: MapObject): 'Высокий' | 'Средний' | 'Низкий' => {
  if ('parameters' in obj) {
    const exceeds = obj.parameters.some(p => p.concentration > p.background * 1.1);
    return exceeds ? 'Высокий' : 'Низкий';
  }

  if ('danger_level_cm' in obj && obj.danger_level_cm && obj.actual_level_cm) {
    const ratio = obj.actual_level_cm / obj.danger_level_cm;
    if (ratio >= 0.95) return 'Высокий';
    if (ratio >= 0.8) return 'Средний';
  }

  return 'Низкий';
};

export const getMarkerColor = (obj: MapObject): string => {
  if ('parameters' in obj) {
    const exceeds = obj.parameters.some(p => p.concentration > p.background * 1.1);
    return exceeds ? '#EF4444' : '#10B981';
  }

  if ('danger_level_cm' in obj && obj.danger_level_cm && obj.actual_level_cm) {
    const ratio = obj.actual_level_cm / obj.danger_level_cm;
    if (ratio >= 0.95) return '#EF4444';
    if (ratio >= 0.8) return '#F59E0B';
  }

  return '#3B82F6';
};

// === Цвета приоритета в UI ===
export const priorityColors = {
  Высокий: 'bg-red-500 text-white',
  Средний: 'bg-yellow-500 text-white',
  Низкий: 'bg-green-500 text-white',
} as const;

// === Кастомная иконка ===
export const getCustomIcon = (obj: MapObject) => {
  const color = getMarkerColor(obj);
  const label = 'parameters' in obj ? 'Q' : 'L'; // Q = Quality, L = Level

  return L.divIcon({
    html: `
      <div class="w-10 h-10 rounded-full border-4 border-white shadow-2xl flex items-center justify-center text-white font-bold text-sm"
           style="background-color: ${color};">
        <span>${label}</span>
      </div>
    `,
    className: 'custom-marker-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });
};

// === Type Guards (для компонентов) ===
export const isWaterQuality = (obj: MapObject): obj is WaterQualityPoint =>
  'parameters' in obj;

export const isRiverLevel = (obj: MapObject): obj is RiverLevelPoint =>
  'actual_level_cm' in obj;