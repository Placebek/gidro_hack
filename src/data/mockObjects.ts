import type { ObjectFeature } from "../types/index";

export const mockObjects: ObjectFeature[] = Array.from({ length: 200 }, (_, i) => {
  const regions = ["Алматинская", "Астана", "Актюбинская", "Карагандинская", "Шымкент", "Павлодарская", "Восточно-Казахстанская"];
  const types = ["озеро", "водохранилище", "канал"] as const;
  const waterTypes = ["пресная", "непресная"] as const;

  const condition = Math.floor(Math.random() * 5) + 1;
  const ageYears = Math.floor(Math.random() * 20) + 1;
  const priorityScore = (6 - condition) * 3 + ageYears;

  return {
    id: `obj-${i + 1}`,
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [
        66.0 + Math.random() * 18, // долгота
        40.0 + Math.random() * 15, // широта
      ],
    },
    properties: {
      name: `Водный объект №${i + 1}`,
      region: regions[Math.floor(Math.random() * regions.length)],
      resource_type: types[Math.floor(Math.random() * types.length)],
      water_type: waterTypes[Math.floor(Math.random() * waterTypes.length)],
      fauna: Math.random() > 0.5,
      passport_date: new Date(2020 + Math.floor(Math.random() * 5), Math.random() * 12, 1).toISOString(),
      technical_condition: condition,
      priorityScore,
      priorityLevel: priorityScore >= 12 ? "Высокий" : priorityScore >= 6 ? "Средний" : "Низкий",
    },
  };
});