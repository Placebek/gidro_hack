# import_water_quality.py
import asyncio
import json
from decimal import Decimal
from pathlib import Path
from sqlalchemy.ext.asyncio import AsyncSession
from database.db import async_session_factory
from model.models import WaterClass
from sqlalchemy import select

JSON_PATH = Path("D:/gidro_hack/waterQuality.json")

# === ОПРЕДЕЛЕНИЕ region_id ПО КООРДИНАТАМ (точно как в import_objects.py) ===
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

def get_region_id_by_coords(lat: float, lng: float) -> int:
    """Определяет region_id по широте и долготе"""
    for region_name, bounds in REGIONS_COORDS.items():
        lat_min, lat_max = bounds["lat"]
        lon_min, lon_max = bounds["lon"]
        if lat_min <= lat <= lat_max and lon_min <= lng <= lon_max:
            return REGION_ID_MAP.get(region_name, 1)
    print(f"  Координаты вне известных регионов: {lat}, {lng} → region_id = 1 (по умолчанию)")
    return 1

# === ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ===
def safe_float(value):
    if value is None or value == "" or str(value).strip() == "":
        return None
    try:
        return float(value)
    except (ValueError, TypeError):
        return None

def safe_str(value):
    if value is None:
        return None
    s = str(value).strip()
    return s if s else None

# === ОСНОВНОЙ ИМПОРТ ===
async def import_water_quality():
    if not JSON_PATH.exists():
        print(f"Ошибка: Файл не найден → {JSON_PATH}")
        return

    print("Запуск импорта данных по качеству воды...")
    print(f"Файл: {JSON_PATH}")

    async with async_session_factory() as db:
        async with db.begin():
            with open(JSON_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)

            print(f"Найдено записей в JSON: {len(data)}")
            added = 0
            skipped = 0

            for i, point in enumerate(data, 1):
                lat = point.get("lat")
                lng = point.get("lng")

                if not lat or not lng:
                    print(f"[{i}] Пропущено — нет координат")
                    skipped += 1
                    continue

                try:
                    lat_dec = Decimal(str(lat))
                    lng_dec = Decimal(str(lng))
                except Exception as e:
                    print(f"[{i}] Ошибка координат: {lat}, {lng} → {e}")
                    skipped += 1
                    continue

                # ОПРЕДЕЛЯЕМ region_id ПО КООРДИНАТАМ
                region_id = get_region_id_by_coords(float(lat), float(lng))

                description = safe_str(point.get("description"))
                water_class = point.get("water_class")  # Может быть 6 — это нормально
                location_info = safe_str(point.get("location_info"))

                purpose_list = point.get("purpose", [])
                fauna_list = point.get("fauna", [])
                purpose_str = ", ".join([safe_str(p) for p in purpose_list if p]) if purpose_list else None
                fauna_str = ", ".join([safe_str(f) for f in fauna_list if f]) if fauna_list else None

                params = point.get("parameters", [])
                if not params:
                    print(f"[{i}] Пропущено — нет параметров")
                    skipped += 1
                    continue

                for param in params:
                    parameter = safe_str(param.get("parameter"))
                    if not parameter:
                        continue

                    index = safe_str(param.get("index"))
                    unit = safe_str(param.get("unit"))
                    concentration = safe_float(param.get("concentration"))
                    background = safe_float(param.get("background"))

                    # Проверка на дубликат (точка + параметр)
                    exists = await db.execute(
                        select(WaterClass).where(
                            WaterClass.latitude == lat_dec,
                            WaterClass.longitude == lng_dec,
                            WaterClass.parameter == parameter
                        )
                    )
                    if exists.scalar_one_or_none():
                        # print(f"[{i}] Дубликат: {parameter}")
                        continue

                    wc = WaterClass(
                        latitude=lat_dec,
                        longitude=lng_dec,
                        description=description,
                        water_class=water_class,
                        location_info=location_info,
                        purpose=purpose_str,
                        fauna=fauna_str,
                        index=index,
                        parameter=parameter,
                        unit=unit,
                        concentration=concentration,
                        background=background,
                        region_id=region_id  # ВОТ ОНО! region_id по координатам
                    )
                    db.add(wc)
                    added += 1

                    status = f"region_id={region_id}"
                    if background is None:
                        status += " | background=None"
                    print(f"[{i}] Добавлено: {parameter} = {concentration} {unit or ''} | {status}")

            await db.commit()

    print("\nИмпорт данных по качеству воды завершён!")
    print(f"   Добавлено записей: {added}")
    print(f"   Пропущено/дублей: {skipped}")

if __name__ == "__main__":
    asyncio.run(import_water_quality())