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

def safe_float(value):
    """Безопасно превращает в float, пустая строка → None"""
    if value is None or value == "" or str(value).strip() == "":
        return None
    try:
        return float(value)
    except (ValueError, TypeError):
        return None

def safe_str(value):
    """Безопасно в строку, убирает лишние пробелы"""
    if value is None:
        return None
    s = str(value).strip()
    return s if s else None

async def import_water_quality():
    if not JSON_PATH.exists():
        print(f"Файл не найден: {JSON_PATH}")
        return

    print("Начало импорта данных по качеству воды...")
    
    async with async_session_factory() as db:
        async with db.begin():  # Одна транзакция на всё
            with open(JSON_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)

            print(f"Всего точек в JSON: {len(data)}")
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
                except:
                    print(f"[{i}] Пропущено — некорректные координаты: {lat}, {lng}")
                    skipped += 1
                    continue

                # Общие поля
                description = safe_str(point.get("description"))
                water_class = point.get("water_class")  # Может быть 6 — оставляем как есть!
                location_info = safe_str(point.get("location_info"))
                purpose_list = point.get("purpose", [])
                fauna_list = point.get("fauna", [])
                purpose_str = ", ".join([safe_str(p) for p in purpose_list]) if purpose_list else None
                fauna_str = ", ".join([safe_str(f) for f in fauna_list]) if fauna_list else None

                params = point.get("parameters", [])
                if not params:
                    print(f"[{i}] Пропущено — нет параметров | {description[:50] if description else ''}")
                    skipped += 1
                    continue

                for param in params:
                    parameter = safe_str(param.get("parameter"))
                    if not parameter:
                        continue

                    index = safe_str(param.get("index"))
                    unit = safe_str(param.get("unit"))
                    concentration = safe_float(param.get("concentration"))
                    background_raw = param.get("background")
                    background = safe_float(background_raw)

                    # Проверка на дубликат: одна и та же точка + один и тот же параметр
                    exists_check = await db.execute(
                        select(WaterClass).where(
                            WaterClass.latitude == lat_dec,
                            WaterClass.longitude == lng_dec,
                            WaterClass.parameter == parameter
                        )
                    )
                    if exists_check.scalar_one_or_none():
                        print(f"[{i}] Уже существует: {parameter} | {description[:40] if description else ''}")
                        continue

                    # Создаём запись
                    wc = WaterClass(
                        latitude=lat_dec,
                        longitude=lng_dec,
                        description=description,
                        water_class=water_class,           # 6 тоже нормально!
                        location_info=location_info,
                        purpose=purpose_str,
                        fauna=fauna_str,
                        index=index,
                        parameter=parameter,
                        unit=unit,
                        concentration=concentration,
                        background=background
                    )
                    db.add(wc)
                    added += 1
                    status = "OK"
                    if background is None and background_raw not in [None, ""]:
                        status = "background был пустой → None"
                    print(f"[{i}] Добавлено: {parameter} = {concentration} {unit or ''} | {status}")

            await db.commit()

        print(f"\nИмпорт завершён!")
        print(f"Добавлено записей: {added}")
        print(f"Пропущено/дубликатов: {skipped}")

if __name__ == "__main__":
    asyncio.run(import_water_quality())