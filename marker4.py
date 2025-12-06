import json
import math
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy import select
import asyncio
from datetime import datetime
from database.db import async_session_factory
from model.models import Group, History, WaterHistory, Object

JSON_FILE = "D:/gidro_hack/markers_with_history.json"


def safe_int(value):
    try:
        if value is None:
            return None
        if isinstance(value, float) and math.isnan(value):
            return None
        # Попробуем преобразовать строку в число
        return int(str(value))
    except (ValueError, TypeError):
        return None


def safe_float(value):
    try:
        if value is None:
            return None
        if isinstance(value, float) and math.isnan(value):
            return None
        return float(str(value))
    except (ValueError, TypeError):
        return None


async def load_groups(groups_json):
    """Загрузка справочника групп в таблицу Group"""
    rows = []
    for group_key, group_data in groups_json.items():
        for item in group_data["codes"]:
            rows.append({
                "number": group_data["group"],
                "code": int(item["code"]),
                "text": item["text"]
            })

    async with async_session_factory() as session:
        stmt = insert(Group).values(rows)
        stmt = stmt.on_conflict_do_nothing(
            index_elements=["number", "code"]
        )
        await session.execute(stmt)
        await session.commit()

    print(f"Загружено {len(rows)} записей в таблицу groups")


async def load_histories(markers_json):
    """Загрузка историй и связей с группами"""
    async with async_session_factory() as session:
        for marker in markers_json:
            # Получаем объект по координатам
            result = await session.execute(
                select(Object).where(
                    (Object.latitude == marker["lat"]) &
                    (Object.longitude == marker["lng"])
                )
            )
            obj = result.scalars().first()
            if not obj:
                print(f"Не найден объект для {marker['object_name']}")
                continue

            for hist in marker.get("history", []):
                if hist.get("status1") is None and hist.get("status2") is None:
                    continue

                # Создаём объект History
                history_obj = History(
                    date=datetime.strptime(hist["date"], "%Y-%m-%d").date(),
                    time=datetime.strptime(hist["time"], "%H:%M").time(),
                    level_cm=safe_int(hist.get("level_cm")),
                    discharge_m3s=safe_float(hist.get("discharge_m3s")),
                    temperature_C=safe_float(hist.get("temperature_C")),
                    status1=safe_int(hist.get("status1")),
                    status2=safe_int(hist.get("status2"))
                )
                session.add(history_obj)
                await session.flush()  # чтобы получить history_obj.id

                for status_field in ["status1", "status2"]:
                    status_value = hist.get(status_field)
                    if status_value is None:
                        continue

                    # Пропускаем NaN или нечисловые значения
                    try:
                        status_int = safe_int(status_value)
                        if status_int is None:
                            continue
                    except (ValueError, TypeError):
                        continue

                    status_str = str(status_int)
                    if len(status_str) < 3:
                        continue

                    group_number = int(status_str[0])
                    code = int(status_str[1:])

                    # Получаем объект Group через ORM
                    result = await session.execute(
                        select(Group).where(
                            (Group.number == group_number) &
                            (Group.code == code)
                        )
                    )
                    group_obj = result.scalars().first()
                    if not group_obj:
                        continue

                    # Создаём связь WaterHistory
                    water_history_obj = WaterHistory(
                        object_id=obj.id,
                        history_id=history_obj.id,
                        group_id=group_obj.id
                    )
                    session.add(water_history_obj)

        await session.commit()
    print("Загружены все истории и связи с группами")


async def main():
    # Загружаем JSON
    with open(JSON_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Загружаем группы
    groups_json = {k: v for k, v in data.items() if k.startswith("group")}
    await load_groups(groups_json)

    # Загружаем истории маркеров
    markers_json = data.get("markers", [])
    await load_histories(markers_json)


if __name__ == "__main__":
    asyncio.run(main())
