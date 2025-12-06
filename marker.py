import asyncio
import json
import random
from decimal import Decimal
from pathlib import Path
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database.db import async_session_factory  
from model.models import Object


JSON_PATH = Path("D:/gidro_hack/markersData_clean.json")

# Диапазоны координат областей
REGIONS_COORDS = {
    "Акмолинская область": {"lat": [50.0, 52.5], "lon": [69.0, 78.0]},
    "Актюбинская область": {"lat": [47.0, 51.0], "lon": [55.0, 64.0]},
    "Алматинская область": {"lat": [42.5, 46.5], "lon": [75.0, 80.0]},
    "Атырауская область": {"lat": [46.0, 49.0], "lon": [47.0, 54.0]},
    "Восточно-Казахстанская область": {"lat": [47.0, 50.0], "lon": [78.0, 87.0]},
    "Жамбылская область": {"lat": [42.0, 44.5], "lon": [70.0, 76.0]},
    "Жетысуская область": {"lat": [43.0, 45.0], "lon": [70.0, 78.0]},
    "Карагандинская область": {"lat": [46.0, 50.5], "lon": [69.0, 80.0]},
    "Костанайская область": {"lat": [51.0, 55.0], "lon": [61.0, 67.0]},
    "Кызылординская область": {"lat": [44.0, 46.5], "lon": [62.0, 66.5]},
    "Мангистауская область": {"lat": [43.0, 48.0], "lon": [47.0, 55.0]},
    "Павлодарская область": {"lat": [51.0, 54.0], "lon": [73.0, 79.0]},
    "Северо-Казахстанская область": {"lat": [53.0, 55.0], "lon": [68.0, 75.0]},
    "Туркестанская область": {"lat": [41.0, 43.5], "lon": [65.0, 70.0]},
    "Улытау": {"lat": [47.0, 49.5], "lon": [67.0, 70.5]},
    "Усть-Каменогорская область": {"lat": [49.5, 50.5], "lon": [82.0, 87.0]},
    "Шығыс Қазақстанская область": {"lat": [46.0, 50.0], "lon": [78.0, 87.0]}
}

# Соответствие имени области к region_id
REGION_ID_MAP = {
    "Акмолинская область": 1,
    "Актюбинская область": 2,
    "Алматинская область": 3,
    "Атырауская область": 4,
    "Восточно-Казахстанская область": 5,
    "Жамбылская область": 6,
    "Жетысуская область": 7,
    "Карагандинская область": 8,
    "Костанайская область": 9,
    "Кызылординская область": 10,
    "Мангистауская область": 11,
    "Павлодарская область": 12,
    "Северо-Казахстанская область": 13,
    "Туркестанская область": 14,
    "Улытау": 15,
    "Усть-Каменогорская область": 16,
    "Шығыс Қазақстанская область": 17
}

# Соответствие resource_type к ID
RESOURCE_TYPE_MAP = {
    "Реки": 1,
    "Водохранилища": 2,
    "Мосты": 3,
    "Плотины": 4,
    "Населённые пункты": 5,
    "Посты гидрометрии": 6,
    "Резервуары": 7,
    "Каналы": 8,
    "Прочие инженерные объекты": 9
}

def get_region_id_by_coords(lat: float, lng: float) -> int:
    """Определяет region_id по координатам."""
    for region_name, coords in REGIONS_COORDS.items():
        lat_min, lat_max = coords["lat"]
        lon_min, lon_max = coords["lon"]
        if lat_min <= lat <= lat_max and lon_min <= lng <= lon_max:
            return REGION_ID_MAP[region_name]
    return 1  # по умолчанию

def get_resource_type_id(raw_type: str) -> int:
    """Конвертирует строку вида '1 "Реки"' в ID."""
    if '"' in raw_type:
        resource_name = raw_type.split('"')[-2]
        return RESOURCE_TYPE_MAP.get(resource_name)
    return RESOURCE_TYPE_MAP.get(raw_type)

async def import_objects():
    if not JSON_PATH.exists():
        print(f"Файл не найден: {JSON_PATH}")
        return

    print(f"Начинаем импорт из {JSON_PATH}...")

    async with async_session_factory() as db:
        async with db.begin():  
            with open(JSON_PATH, "r", encoding="utf-8") as f:
                raw_data = json.load(f)

            data = raw_data.get("markers", [])
            print(f"Найдено {len(data)} записей")

            for i, item in enumerate(data, 1):
                name = item.get("object_name", "").strip()
                lat = item.get("lat")
                lng = item.get("lng")

                if not name or lat is None or lng is None:
                    print(f"[{i}] Пропущено (нет данных): {item.get('object_name', 'Нет имени')}")
                    continue

                exists = await db.execute(
                    select(Object).where(
                        Object.name == name,
                        Object.latitude == Decimal(str(lat)),
                        Object.longitude == Decimal(str(lng))
                    )
                )
                if exists.scalar_one_or_none():
                    print(f"[{i}] Уже существует: {name}")
                    continue

                region_id = get_region_id_by_coords(lat, lng)
                resource_type_id = get_resource_type_id(item.get("resource_type", ""))
                water_type_id = random.choice([1, 2])  # Рандомно 1 или 2

                obj = Object(
                    name=name,
                    region_id=region_id,
                    resource_type_id=resource_type_id,
                    water_type_id=water_type_id,
                    latitude=Decimal(str(lat)),
                    longitude=Decimal(str(lng)),
                    danger_level_cm=item.get("danger_level_cm"),
                    actual_level_cm=item.get("actual_level_cm"),
                    actual_discharge_m3s=item.get("actual_discharge_m3s"),
                    water_temperature_C=item.get("water_temperature_C"),
                    water_object_code=str(item.get("water_object_code", "")).strip() or None,
                    pdf_url="",
                    fauna=random.choice([True, False]),
                    technical_condition=5,
                    passport_date=None
                )

                db.add(obj)
                print(f"[{i}] Добавлен: {name} | {lat}, {lng} | region_id={region_id} | fauna={obj.fauna} | water_type_id={water_type_id}")

            await db.commit()

    print("Импорт завершён успешно!")

if __name__ == "__main__":
    asyncio.run(import_objects())
