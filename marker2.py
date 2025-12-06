# scripts/import_water_quality.py
import asyncio
import json
from decimal import Decimal
from pathlib import Path
from sqlalchemy.ext.asyncio import AsyncSession
from database.db import async_session_factory
from model.models import WaterClass
from sqlalchemy import select


JSON_PATH = Path("D:/gidro_hack/markersData2_heatmap_clean.json")

def safe_float(value):
    """Безопасно превращает значение в float или возвращает None"""
    if value is None or value == "" or str(value).strip() == "":
        return None
    try:
        return float(value)
    except (ValueError, TypeError):
        return None

async def import_water_quality():
    if not JSON_PATH.exists():
        print(f"Файл не найден: {JSON_PATH}")
        return

    print("Импорт данных по качеству воды...")

    async with async_session_factory() as db:
        async with db.begin():
            with open(JSON_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)

            print(f"Найдено {len(data)} точек")

            for i, point in enumerate(data, 1):
                lat = point.get("lat")
                lng = point.get("lng")
                desc = point.get("description", "").strip()
                params = point.get("parameters", [])

                if not lat or not lng:
                    print(f"[{i}] Пропущено (нет координат): {desc[:60]}...")
                    continue

                if not params:
                    print(f"[{i}] Пропущено (нет параметров): {desc[:60]}...")
                    continue

                lat_dec = Decimal(str(lat))
                lng_dec = Decimal(str(lng))

                for param in params:
                    index = str(param.get("index", "")).strip()
                    parameter = param.get("parameter", "").strip()
                    unit = param.get("unit", "").strip()
                    concentration = safe_float(param.get("concentration"))
                    background = safe_float(param.get("background"))  

                    if not parameter:
                        continue

                    exists = await db.execute(
                        select(WaterClass).where(
                            WaterClass.latitude == lat_dec,
                            WaterClass.longitude == lng_dec,
                            WaterClass.parameter == parameter
                        )
                    )
                    if exists.scalar_one_or_none():
                        print(f"[{i}] Уже есть: {parameter} | {desc[:50]}...")
                        continue

                    wc = WaterClass(
                        latitude=lat_dec,
                        longitude=lng_dec,
                        description=desc or None,
                        index=index or None,
                        parameter=parameter,
                        unit=unit or None,
                        concentration=concentration,
                        background=background
                    )
                    db.add(wc)
                    status = "OK"
                    if background is None and param.get("background") not in [None, ""]:
                        status = "background = '' → None"
                    print(f"[{i}] Добавлено: {parameter} = {concentration} {unit} | {status}")

            await db.commit()

    print("Импорт качества воды завершён успешно!")

if __name__ == "__main__":
    asyncio.run(import_water_quality())