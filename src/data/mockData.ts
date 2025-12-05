// Тип объекта воды
export type WaterObject = {
  id: number;
  name: string;
  region: string;
  resourceType: 'river' | 'lake' | 'reservoir';
  waterType: 'fresh' | 'salt' | 'brackish';
  technicalCondition: number; // от 1 (плохое) до 5 (отличное)
  priority?: number;           // рассчитанный приоритет
  passportDate: string;        // дата паспорта
  hasFauna: boolean;
  coordinates: { lat: number; lng: number };
};

// Массив объектов для примера
export const waterObjects: WaterObject[] = [
  {
    id: 1,
    name: 'Река Ишим',
    region: 'Казахстан',
    resourceType: 'river',
    waterType: 'fresh',
    technicalCondition: 3,
    priority: 10,
    passportDate: '2015-06-12',
    hasFauna: true,
    coordinates: { lat: 51.1694, lng: 71.4491 },
  },
  {
    id: 2,
    name: 'Озеро Балхаш',
    region: 'Алматинская область',
    resourceType: 'lake',
    waterType: 'brackish',
    technicalCondition: 4,
    priority: 7,
    passportDate: '2010-03-18',
    hasFauna: false,
    coordinates: { lat: 46.8390, lng: 74.9475 },
  },
  {
    id: 1,
    name: 'Река Ишим',
    region: 'Казахстан',
    resourceType: 'river',
    waterType: 'fresh',
    technicalCondition: 5, // Отличное
    priority: 12,
    passportDate: '2015-06-12',
    hasFauna: true,
    coordinates: { lat: 51.1694, lng: 71.4491 },
  },
  {
    id: 2,
    name: 'Озеро Балхаш',
    region: 'Алматинская область',
    resourceType: 'lake',
    waterType: 'brackish',
    technicalCondition: 4, // Хорошее
    priority: 8,
    passportDate: '2010-03-18',
    hasFauna: false,
    coordinates: { lat: 46.8390, lng: 74.9475 },
  },
  {
    id: 3,
    name: 'Водохранилище Шульбинское',
    region: 'Восточно-Казахстанская область',
    resourceType: 'reservoir',
    waterType: 'fresh',
    technicalCondition: 3, // Среднее
    priority: 6,
    passportDate: '2008-09-05',
    hasFauna: true,
    coordinates: { lat: 49.7500, lng: 84.3667 },
  },
  {
    id: 4,
    name: 'Канал Иртыш-Караганда',
    region: 'Карагандинская область',
    resourceType: 'river',
    waterType: 'fresh',
    technicalCondition: 2, // Плохое
    priority: 4,
    passportDate: '2012-11-21',
    hasFauna: false,
    coordinates: { lat: 49.8064, lng: 73.0850 },
  },
  {
    id: 5,
    name: 'Озеро Зайсан',
    region: 'Восточно-Казахстанская область',
    resourceType: 'lake',
    waterType: 'fresh',
    technicalCondition: 1, // Критическое
    priority: 2,
    passportDate: '2005-07-14',
    hasFauna: true,
    coordinates: { lat: 47.4611, lng: 84.8811 },
  },
  {
    id: 6,
    name: 'Водохранилище Капшагай',
    region: 'Алматинская область',
    resourceType: 'reservoir',
    waterType: 'fresh',
    technicalCondition: 5, // Отличное
    priority: 11,
    passportDate: '2018-04-22',
    hasFauna: true,
    coordinates: { lat: 45.0000, lng: 77.0000 },
  },
  {
    id: 7,
    name: 'Канал Кызылорда-Байконур',
    region: 'Кызылординская область',
    resourceType: 'river',
    waterType: 'brackish',
    technicalCondition: 3, // Среднее
    priority: 5,
    passportDate: '2011-05-10',
    hasFauna: false,
    coordinates: { lat: 44.8512, lng: 65.4992 },
  },
  {
    id: 8,
    name: 'Озеро Алаколь',
    region: 'Восточно-Казахстанская область',
    resourceType: 'lake',
    waterType: 'salt',
    technicalCondition: 4, // Хорошее
    priority: 7,
    passportDate: '2013-08-19',
    hasFauna: true,
    coordinates: { lat: 46.2100, lng: 81.0000 },
  },
  {
    id: 9,
    name: 'Водохранилище Кенжеколь',
    region: 'Акмолинская область',
    resourceType: 'reservoir',
    waterType: 'fresh',
    technicalCondition: 2, // Плохое
    priority: 3,
    passportDate: '2009-12-01',
    hasFauna: false,
    coordinates: { lat: 51.5000, lng: 71.8000 },
  },
  {
    id: 10,
    name: 'Канал Талдыкорган-Щучинск',
    region: 'Алматинская область',
    resourceType: 'river',
    waterType: 'fresh',
    technicalCondition: 1, // Критическое
    priority: 1,
    passportDate: '2000-06-15',
    hasFauna: false,
    coordinates: { lat: 45.0000, lng: 78.0000 },
  },
];

// Метки для типов ресурсов
export const resourceTypeLabels: Record<WaterObject['resourceType'], string> = {
  river: 'Река',
  lake: 'Озеро',
  reservoir: 'Водохранилище',
};

// Метки для типов воды
export const waterTypeLabels: Record<WaterObject['waterType'], string> = {
  fresh: 'Пресная',
  salt: 'Соленая',
  brackish: 'Слабосоленая',
};

// Фильт для статистики
export const waterObjectsWithPriority = waterObjects.map(obj => ({
  ...obj,
  priority: obj.priority ?? ((6 - obj.technicalCondition) * 3 + (new Date().getFullYear() - new Date(obj.passportDate).getFullYear()))
}));


// Функция для цвета состояния
export function getConditionColor(condition: number) {
  switch (condition) {
    case 5: return '#0e855dff'; // отличное
    case 4: return '#4eea87ff'; // хорошее
    case 3: return '#F59E0B'; // среднее
    case 2: return '#EF4444'; // плохое
    case 1: return '#B91C1C'; // критическое
    default: return '#9CA3AF'; // неизвестное
  }
}

// Функция для текстовой метки состояния
export function getConditionLabel(condition: number) {
  switch (condition) {
    case 5: return 'Отличное';
    case 4: return 'Хорошее';
    case 3: return 'Среднее';
    case 2: return 'Плохое';
    case 1: return 'Критическое';
    default: return 'Неизвестно';
  }
}

// Функция для приоритета
export function getPriorityLevel(priority: number) {
  if (priority >= 10) return { level: 'Высокий', color: '#EF4444' };
  if (priority >= 5) return { level: 'Средний', color: '#FBBF24' };
  return { level: 'Низкий', color: '#10B981' };
}
