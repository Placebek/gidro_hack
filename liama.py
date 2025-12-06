# ollama_generate.py
import requests
import json
import sys

URL = "http://localhost:11434/api"

def get_available_models():
    """Возвращает список реально доступных локальных моделей (без облачных)."""
    try:
        r = requests.get(f"{URL}/tags")
        if r.status_code == 200:
            models = []
            for m in r.json()["models"]:
                name = m["name"]
                size = m.get("size", None)

                # Фильтруем облачные (без локального размера)
                if size is None or name.endswith("-cloud"):
                    continue

                models.append(name)

            return models
        else:
            print(f"Ошибка API: {r.status_code} - {r.text}")
            return []
    except Exception as e:
        print(f"Ошибка подключения: {e}")
        return []

def generate_response(model, prompt, json_mode=False, schema=None, stream=False):
    payload = {
        "model": model,
        "prompt": prompt,
        "stream": stream,
        "options": {
            "temperature": 0.4,
            "num_ctx": 8192
        }
    }

    if json_mode:
        payload["stream"] = False
        payload["format"] = schema or {
            "type": "object",
            "properties": {"result": {"type": "string"}},
            "required": ["result"]
        }

    try:
        with requests.post(f"{URL}/generate", json=payload, timeout=60) as r:
            if r.status_code == 404:
                return {'success': False, 'error': f"Модель '{model}' не найдена."}
            if r.status_code != 200:
                return {'success': False, 'error': f"HTTP {r.status_code}: {r.text}"}

            # обработка не-stream
            data = r.json()
            result = data.get("response", "").strip()

            if json_mode and result:
                try:
                    parsed = json.loads(result)
                    return {'success': True, 'response': parsed}
                except json.JSONDecodeError:
                    return {
                        'success': False,
                        'error': f"Невалидный JSON: {result[:200]}..."
                    }

            return {'success': True, 'response': result}

    except requests.exceptions.ConnectionError:
        return {'success': False, 'error': "Ollama не запущена. Запусти: ollama serve"}
    except Exception as e:
        return {'success': False, 'error': str(e)}

if __name__ == "__main__":
    models = get_available_models()
    if not models:
        print("Нет локальных моделей. Скачай: ollama pull gemma3:4b")
        sys.exit(1)

    print("Доступные локальные модели:", ", ".join(models))

    # Выбор модели
    default_model = "gemma3:4b" if "gemma3:4b" in models else models[0]
    model = input(f"Модель (по умолчанию {default_model}): ").strip() or default_model

    json_mode = input("JSON-режим? (y/n): ").lower().startswith("y")

    schema_example = {
        "type": "object",
        "properties": {
            "age": {"type": "integer"},
            "available": {"type": "boolean"}
        },
        "required": ["age", "available"]
    }

    use_schema = input("Использовать тестовую схему? (y/n): ").lower().startswith("y")
    schema = schema_example if use_schema else None

    prompt = input("Промпт: ")
    if json_mode:
        prompt += "\nОтвет строго в формате JSON."

    result = generate_response(model, prompt, json_mode=json_mode, schema=schema)

    if result["success"]:
        print("Ответ:", result["response"])
    else:
        print("Ошибка:", result["error"])
