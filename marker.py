import asyncio
import json
from decimal import Decimal
from pathlib import Path
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database.db import async_session_factory  
from model.models import Object


JSON_PATH = Path("D:/gidro_hack/markersData_clean.json")

async def import_objects():
    if not JSON_PATH.exists():
        print(f"Файл не найден: {JSON_PATH}")
        return

    print(f"Начинаем импорт из {JSON_PATH}...")

    async with async_session_factory() as db:
        async with db.begin():  
            with open(JSON_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)

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

                obj = Object(
                    name=name,
                    region_id=1,  
                    resource_type_id=1,    
                    water_type_id=1,       
                    latitude=Decimal(str(lat)),
                    longitude=Decimal(str(lng)),
                    danger_level_cm=item.get("danger_level_cm"),
                    actual_level_cm=item.get("actual_level_cm"),
                    actual_discharge_m3s=item.get("actual_discharge_m3s"),
                    water_temperature_C=item.get("water_temperature_C"),
                    water_object_code=str(item.get("water_object_code", "")).strip() or None,
                    pdf_url="",
                    fauna=False,
                    technical_condition=5,
                    passport_date=None
                )

                db.add(obj)
                print(f"[{i}] Добавлен: {name} | {lat}, {lng}")

            await db.commit()

    print("Импорт завершён успешно!")

if __name__ == "__main__":
    asyncio.run(import_objects())