export type ResourceType = "озеро" | "водохранилище" | "канал";
export type WaterType = "пресная" | "непресная";

export type ObjectProperties = {
  name: string;
  region: string;
  resource_type: ResourceType;
  water_type: WaterType;
  fauna: boolean;
  passport_date: string;
  technical_condition: number;
  priorityScore: number;
  priorityLevel: "Высокий" | "Средний" | "Низкий";
};

export type ObjectFeature = {
  id: string;
  type: "Feature";
  geometry: { type: "Point"; coordinates: [number, number] };
  properties: ObjectProperties;
};