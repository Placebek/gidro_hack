// src/types/maps.ts

import L from "leaflet";

// === 1. Точки качества воды ===
export interface WaterQualityParameter {
    index: string;
    parameter: string;
    unit: string;
    concentration: number;
    background: number;
}

export interface WaterQualityPoint {
    id: number;
    latitude: number;
    longitude: number;
    description: string;
    water_class: number;
    location_info: string;
    purpose: string;
    fauna: string;

    parameters: WaterQualityParameter[];
}
// === 2. Точки уровня воды (реальные гидропосты) ===
export interface RiverLevelPoint {
    // date: string | number | Date;
    id: number;
    name: string;
    region: string;
    resource_type: string;
    water_type: string;

    latitude: number;
    longitude: number;
    technical_condition: number | null;
    danger_level_cm: number | null;
    actual_level_cm: number | null;
    actual_discharge_m3s: number | null;
    water_temperature_C: number | null;

    history: any[] | null;
    pdf_url: any;

    water_object_code: string;
    is_dangerous: boolean;
}

// === Основной тип: только реальные данные ===
export type MapObject = WaterQualityPoint | RiverLevelPoint;

// === Утилиты для приоритета и цвета ===
export const calculatePriorityScore = (obj: MapObject): number => {
    let condition: number = 3; // дефолт — удовлетворительное
    let passportYear: number = new Date().getFullYear();

    // 1. Качество воды — по water_class
    if ("water_class" in obj && obj.water_class) {
        condition = obj.water_class;
    }

    // 2. Гидротехнические объекты и гидропосты — по technical_condition
    if ("technical_condition" in obj && obj.technical_condition) {
        condition = obj.technical_condition;
    }
    const yearsOld = Math.max(0, new Date().getFullYear() - passportYear);
    const score = (6 - condition) * 3 + yearsOld;

    return score;
};

export const getPriorityLevel = (
    obj: MapObject
): "Высокий" | "Средний" | "Низкий" => {
    const score = calculatePriorityScore(obj);

    if (score >= 12) return "Высокий";
    if (score >= 6) return "Средний";
    return "Низкий";
};

export const getPriorityColor = (obj: MapObject): string => {
    const level = getPriorityLevel(obj);
    return level === "Высокий"
        ? "#EF4444"
        : level === "Средний"
        ? "#F59E0B"
        : "#10B981";
};

export const getPriorityBadge = (obj: MapObject) => {
    const level = getPriorityLevel(obj);
    const score = calculatePriorityScore(obj);
    const color = getPriorityColor(obj);

    return {
        label: level,
        score,
        color,
        icon:
            level === "Высокий"
                ? "exclamation-triangle"
                : level === "Средний"
                ? "alert-circle"
                : "check-circle",
    };
};

const conditionColors: Record<number, string> = {
    1: "#10B981", // зелёный — отличное
    2: "#84CC16", // салатовый
    3: "#F59E0B", // жёлтый
    4: "#F97316", // оранжевый
    5: "#EF4444", // красный — аварийное
    6: "#EF4444", // красный — аварийное
};

/**
 * Определяем цвет маркера по состоянию объекта
 */
export const getMarkerColor = (obj: MapObject): string => {
    // 1. Для точек качества воды — по water_class
    if ("water_class" in obj && obj.water_class)
        return conditionColors[obj.water_class] || "#6B7280";

    // 2. Для гидротехнических сооружений / гидропостов — по technical_condition
    if ("technical_condition" in obj && obj.technical_condition)
        return conditionColors[obj.technical_condition] || "#6B7280";

    // 3. Если нет состояния — по уровню воды (обратная совместимость)
    if (
        "actual_level_cm" in obj &&
        "danger_level_cm" in obj &&
        obj.danger_level_cm
    ) {
        const ratio = obj.actual_level_cm / obj.danger_level_cm;
        if (ratio >= 0.95) return "#EF4444";
        if (ratio >= 0.8) return "#F59E0B";
    }

    // 4. Дефолт — синий
    return "#3B82F6";
};

/**
 * Определяем метку внутри маркера
 * Q — качество воды
 * H — гидротехническое сооружение / гидропост
 * W — водоём (если появится)
 */
const getMarkerLabel = (obj: MapObject): string => {
    if ("water_class" in obj) return "Q";
    if ("technical_condition" in obj) return "H";
    if ("actual_level_cm" in obj) return "L"; // старый гидропост
    return "W";
};

export const priorityColors = {
    Высокий: "bg-red-500 text-white",
    Средний: "bg-yellow-500 text-white",
    Низкий: "bg-green-500 text-white",
} as const;
/**
 * Современный маркер с тенью, бордером и анимацией
 */
export const getCustomIcon = (obj: MapObject) => {
    const color = getMarkerColor(obj);
    const label = getMarkerLabel(obj);

    return L.divIcon({
        html: `
      <div class="relative">
        <!-- Тень -->
        <div class="absolute inset-0 rounded-full blur-xl opacity-40" 
             style="background-color: ${color}; transform: translateY(4px);">
        </div>
        
        <!-- Основной маркер -->
        <div class="relative w-12 h-12 rounded-full border-4 border-white shadow-2xl 
                    flex items-center justify-center text-white font-bold text-lg
                    transition-all duration-300 hover:scale-110"
             style="background: ${color};">
          <span class="drop-shadow-md">${label}</span>
        </div>
        
        <!-- Пульсация при высоком риске -->
        ${
            obj.technical_condition === 5 ||
            ("water_class" in obj && obj.water_class >= 4)
                ? `
          <div class="absolute -top-1 -right-1 w-5 h-5 bg-red-600 rounded-full 
                      animate-ping"></div>
          <div class="absolute -top-1 -right-1 w-5 h-5 bg-red-600 rounded-full"></div>
        `
                : ""
        }
      </div>
    `,
        className: "custom-marker-icon",
        iconSize: [48, 48],
        iconAnchor: [24, 48],
        popupAnchor: [0, -48],
        tooltipAnchor: [16, -30],
    });
};

// === Type Guards (для компонентов) ===
export const isWaterQuality = (obj: MapObject): obj is WaterQualityPoint =>
    "parameters" in obj;

export const isRiverLevel = (obj: MapObject): obj is RiverLevelPoint =>
    "total" in obj;
