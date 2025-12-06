import requests
import sys

URL = "http://localhost:11434/api"

def ask(prompt: str, model: str = None) -> str:
    if not model:
        models = requests.get(f"{URL}/tags").json().get("models", [])
        if not models:
            return "Ошибка: Ollama не запущена или нет моделей. Запусти: ollama serve"
        names = [m["name"] for m in models]
        model = next((m for m in names if "gemma3" in m), 
                    next((m for m in names if "llama3.2" in m), names[0]))

    payload = {
        "model": model,
        "prompt": f"""Ты обычный весёлый русскоязычный друг. Отвечай естественно, с душой, без всяких JSON и списков.

Пользователь: {prompt}
Ответ:""",
        "stream": False,
        "options": {
            "temperature": 0.8,
            "num_ctx": 8192
        }
    }

    try:
        r = requests.post(f"{URL}/generate", json=payload, timeout=120)
        if r.status_code != 200:
            return f"Ошибка {r.status_code}: {r.text}"
        return r.json()["response"].strip()
    except:
        return "Ollama не запущена. В терминале выполни: ollama serve"

if __name__ == "__main__":
    print("Оллама-чат готов (Ctrl+C чтобы выйти)\n")
    while True:
        try:
            q = input("Ты: ").strip()
            if q.lower() in ["выход", "exit", "quit", "й"]:
                print("Пока!")
                break
            if not q:
                continue
            print(f"🤖: {ask(q)}")
            print("—" * 50)
        except KeyboardInterrupt:
            print("\n\nПока!")
            sys.exit()