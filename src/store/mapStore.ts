// store/mapStore.ts — ИСПРАВЛЕННАЯ ВЕРСИЯ

export async function getAllObjects(params: Record<string, any> = {}) {
  const cleanParams = Object.entries(params)
    .filter(([key, value]) => {
      // Убираем: undefined, null, пустую строку, 'all' (если это фильтр), и функции!
      if (value === undefined || value === null || value === '') return false;
      if (value === 'all') return false;
      if (typeof value === 'function') return false; // ← ВАЖНО!
      return true;
    })
    .reduce((acc, [key, value]) => {
      acc[key] = String(value);
      return acc;
    }, {} as Record<string, string>);

  const query = new URLSearchParams(cleanParams);
  const url = `http://localhost:8000/api/object/all?${query.toString()}`;

  const res = await fetch(url, { method: 'GET' });
  if (!res.ok) throw new Error('Ошибка загрузки гидрообъектов');
  return res.json();
}

export async function getWaterQuality(params: Record<string, any> = {}) {
  const cleanParams = Object.entries(params)
    .filter(([_, value]) => {
      if (value === undefined || value === null || value === '') return false;
      if (typeof value === 'function') return false;
      return true;
    })
    .reduce((acc, [key, value]) => {
      acc[key] = String(value);
      return acc;
    }, {} as Record<string, string>);

  const query = new URLSearchParams(cleanParams);
  const url = `http://localhost:8000/api/water_class?${query.toString()}`;

  const res = await fetch(url, { method: 'GET' });
  if (!res.ok) throw new Error('Ошибка загрузки качества воды');
  return res.json();
}