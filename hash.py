import hashlib

words = [
    "saken.2020"
]

for w in words:
    h = hashlib.sha256(w.encode()).hexdigest()
    print(f"{w} -> {h}")
