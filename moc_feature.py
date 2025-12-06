import random
from datetime import date, timedelta
import asyncio

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import insert

from database.db import async_session_factory
from model.models import Features


RANGES = {
    "CAP_MCM": (-99, 204800),
    "CAP_MAX": (-99, 141850),
    "CAP_MIN": (-99, 160000),
    "AREA_SKM": (-99, 66866),
    "AREA_MAX": (-99, 10900),
    "AREA_MIN": (-99, 68800),
    "DEPTH_M": (-99, 15200),
    "CATCH_SKM": (-99, 2916552),
    "DIS_AVG_LS": (-99, 19533680),
    "ELEV_MASL": (-9999, 5211),
    "DAM_HGT_M": (-99, 335),
    "DAM_LEN_M": (-99, 80000),
}

DAM_TYPES = ["Gravity Dam", "Run-of-river", "Lake Dam"]
INSTREAM_TYPES = ["Yes", "No"]


def random_date(start: date, end: date) -> date:
    days = (end - start).days
    return start + timedelta(days=random.randint(0, days))


async def seed_features(db: AsyncSession, count: int = 1000):
    start_date = date(2015, 1, 1)
    end_date = date(2025, 11, 12)

    rows = []

    print("Началась генерация...")

    for _ in range(count):
        row = {
            field: random.uniform(rng[0], rng[1])
            for field, rng in RANGES.items()
        }

        row["DAM_TYPE"] = random.choice(DAM_TYPES)
        row["INSTREAM"] = random.choice(INSTREAM_TYPES)
        row["date"] = random_date(start_date, end_date)

        rows.append(row)

    await db.execute(insert(Features), rows)
    await db.commit()

    print("Генерация завершена!")

    return {"inserted": len(rows)}


async def main():
    print("Запуск скрипта...")
    async with async_session_factory() as session:
        result = await seed_features(session, 1000)
        print(result)


if __name__ == "__main__":
    asyncio.run(main())
