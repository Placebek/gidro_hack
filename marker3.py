import json
import asyncio
from sqlalchemy import insert
from database.db import async_session_factory
from model.models import Group


async def load_groups():
    with open("D:/gidro_hack/merged_markers_with_history.json", "r", encoding="utf-8") as f:
        data = json.load(f)

    rows = []

    for group_key, group_data in data.items():
        group_number = group_data.get("group")
        for item in group_data["codes"]:
            rows.append({
                "number": group_number,        
                "code": int(item["code"]),     
                "text": item["text"]           
            })

    async with async_session_factory() as session:
        await session.execute(insert(Group), rows)
        await session.commit()

    print(f"Загружено {len(rows)} записей в таблицу groups")


if __name__ == "__main__":
    asyncio.run(load_groups())
