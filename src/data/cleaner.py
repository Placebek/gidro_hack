import re
import json
from typing import List, Dict, Any

def parse_water_quality_data(raw_data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    result = []

    # Карта назначения по классу
    purpose_map = {
        1: ["все виды использования", "питьевая вода без обработки"],
        2: ["все виды использования", "питьевая вода без обработки"],
        3: ["рекреация", "орошение", "промышленность", "разведение рыб (карповые)"],
        4: ["орошение", "промышленность"],
        5: ["ограниченное использование"],
        6: ["сильно загрязнённая"],
        7: ["экстремально загрязнённая"]
    }

    # Карта ихтиофауны по классу (то, что реально может жить)
    fauna_map = {
        1: ["форель", "хариус", "осман", "голец"],
        2: ["форель", "хариус", "осман", "сазан", "карп"],
        3: ["карп", "сазан", "лещ", "судак", "сом", "окунь", "плотва", "язь"],
        4: ["карась серебряный", "ротан", "вьюн"],
        5: ["рыба отсутствует"],
        6: ["рыба отсутствует"],
        7: ["рыба отсутствует"]
    }

    class_pattern = re.compile(r"^(\d+)\s*класс")

    for item in raw_data:
        desc = item["description"].strip()
        lat = item["lat"]
        lng = item["lng"]
        params = item.get("parameters", [])

        # Класс воды
        class_match = class_pattern.search(desc)
        water_class = int(class_match.group(1)) if class_match else None

        # Локация (всё после "-")
        location_start = desc.find(" - ")
        if location_start == -1:
            location_start = desc.find("-")
        if location_start != -1:
            location_info = desc[location_start + 1:].strip()
        else:
            location_info = desc

        # Убираем возможный мусор в начале
        location_info = re.sub(r"^[\s\-\.,;:]+", "", location_info)
        # Убираем описание класса в конце, если осталось
        location_info = re.sub(r"\s*р\.\s*$", "", location_info)
        location_info = location_info.strip()

        # Назначение и фауна
        purpose = purpose_map.get(water_class, [])
        fauna = fauna_map.get(water_class, ["рыба отсутствует"])

        cleaned_item = {
            "lat": lat,
            "lng": lng,
            "description": desc,
            "water_class": water_class,
            "location_info": location_info,
            "purpose": purpose,
            "fauna": fauna,                   # ← новое поле!
            "parameters": params
        }
        result.append(cleaned_item)

    return result

# Пример использования с твоими данными:
if __name__ == "__main__":
    # Вставь сюда свой список словарей (ты уже прислал)
    json_location = 'C:\\Users\\gobli\\GidroHack\\react\\src\\data\\waterQuality.json'
with open(json_location, 'r', encoding='utf-8') as f:
    data = json.load(f)
    processed = parse_water_quality_data(data)

    with open(json_location, 'w', encoding='utf-8') as f:
        json.dump(processed, f, ensure_ascii=False, indent=2)
    





