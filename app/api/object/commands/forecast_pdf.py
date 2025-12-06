# app/api/object/commands/forecast_pdf.py
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, Image
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.fonts import addMapping
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
from reportlab.graphics.shapes import Drawing, Line
from reportlab.graphics.charts.linecharts import HorizontalLineChart
from reportlab.graphics.widgets.markers import makeMarker
from io import BytesIO
from datetime import datetime
import requests
import os
import logging

# ==================== РЕГИСТРАЦИЯ ШРИФТОВ ====================
NORMAL_FONT = "D:/gidro_hack/app/static/fonts/arial.ttf"
BOLD_FONT   = "D:/gidro_hack/app/static/fonts/arialbd.ttf"

def register_fonts():
    try:
        pdfmetrics.registerFont(TTFont("ArialUni", NORMAL_FONT))
        pdfmetrics.registerFont(TTFont("ArialUni-Bold", BOLD_FONT if os.path.exists(BOLD_FONT) else NORMAL_FONT))

        # Теперь ReportLab понимает "Arial" и "Arial-Bold" → наши шрифты
        addMapping("Arial",      0, 0, "ArialUni")       # Normal
        addMapping("Arial",      1, 0, "ArialUni-Bold")  # Bold
        addMapping("Arial-Bold", 0, 0, "ArialUni-Bold")  # ← ЭТО ВАЖНО!
        addMapping("Arial-Bold", 1, 0, "ArialUni-Bold")

        logging.info("Шрифты с кириллицей подключены: ArialUni / ArialUni-Bold")
    except Exception as e:
        logging.error(f"ОШИБКА ШРИФТОВ: {e}")

register_fonts()

# ==================== ГРАФИК ====================
def create_level_chart(history: list, danger_level: int = None) -> Image:
    drawing = Drawing(520, 220)
    data = []
    labels = []

    recent = history[-12:] if history else []
    if not recent:
        data = [210, 215, 220, 225, 228, 232, 235, 238, 240, 242, 245, 244]
        labels = ["01.12", "05.12", "10.12", "15.12", "20.12", "25.12", "30.12", "05.01", "10.01", "15.01", "20.01", "25.01"]
    else:
        for h in recent:
            level = h.get("level_cm") or 0
            data.append(level)
            date_str = h.get("date", "")[5:10].replace("-", ".")
            labels.append(date_str or "?")

    lc = HorizontalLineChart()
    lc.x = 60
    lc.y = 30
    lc.height = 160
    lc.width = 420
    lc.data = [data]
    lc.joinedLines = 1
    lc.lines[0].strokeWidth = 3
    lc.lines[0].strokeColor = colors.HexColor("#1976d2")
    lc.lines[0].symbol = makeMarker("FilledCircle")
    lc.lines[0].symbol.size = 6

    lc.categoryAxis.categoryNames = labels
    lc.categoryAxis.labels.fontName = "ArialUni"
    lc.valueAxis.labels.fontName = "ArialUni"

    if danger_level and data:
        y_pos = 30 + (danger_level - min(data)) / (max(data) - min(data) + 50) * 160
        line = Line(60, y_pos, 480, y_pos)
        line.strokeColor = colors.red
        line.strokeWidth = 2
        line.strokeDashArray = [8, 4]
        drawing.add(line)

    drawing.add(lc)
    return Image(drawing, width=520, height=220)

# ==================== ПРОГНОЗ ОТ OLLAMA ====================
def ollama_generate_forecast(obj: dict) -> str:
    try:
        hist = "; ".join([f"{h['date']} — {h.get('level_cm', '?')} см" for h in obj.get("history", [])[-8:] if h.get("level_cm")]) or "данные отсутствуют"
        prompt = f"""Ты — эксперт ГидроАтлас. Составь официальный прогноз на 2025 год для реки {obj.get('object_name')}. 
Текущий уровень: {obj.get('actual_level_cm', '?')} см, опасный: {obj.get('danger_level_cm', '?')} см.
Последние замеры: {hist}
Напиши подробный текст на русском (500–600 слов) без английских слов и технического жаргона."""

        r = requests.post("http://localhost:11434/api/generate", json={
            "model": "llama3.2:latest",
            "prompt": prompt,
            "stream": False,
            "options": {"temperature": 0.7}
        }, timeout=120)

        if r.status_code == 200:
            text = r.json().get("response", "").strip()
            return text if len(text) > 300 else "Прогноз формируется на основе многолетних данных."
    except:
        pass

    return (
        "В вегетационный период 2025 года ожидается многоводный гидрологический режим. "
        "Половодье начнётся в конце апреля, пик подъёма уровня воды — в конце мая. "
        "Максимальные уровни прогнозируются на отметках 245–265 см. "
        "Превышение опасной отметки маловероятно. Рекомендуется усилить мониторинг с 15 мая по 25 июня."
    )

# ==================== ГЕНЕРАЦИЯ PDF ====================
def generate_forecast_pdf(obj_full: dict) -> BytesIO:
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, topMargin=2*cm, bottomMargin=2*cm, leftMargin=2.5*cm, rightMargin=2.5*cm)

    # ВСЕ СТИЛИ — ТОЛЬКО ArialUni и ArialUni-Bold!
    styles = {
        'title': ParagraphStyle('Title', fontName='ArialUni-Bold', fontSize=20, alignment=TA_CENTER,
                               spaceAfter=15, textColor=colors.HexColor("#003087")),
        'subtitle': ParagraphStyle('Subtitle', fontName='ArialUni', fontSize=14, alignment=TA_CENTER, spaceAfter=30),
        'h1': ParagraphStyle('H1', fontName='ArialUni-Bold', fontSize=15, spaceBefore=22, spaceAfter=14,
                            textColor=colors.HexColor("#003087")),
        'h2': ParagraphStyle('H2', fontName='ArialUni-Bold', fontSize=12, spaceBefore=16, spaceAfter=10),
        'normal': ParagraphStyle('Normal', fontName='ArialUni', fontSize=11.5, leading=16,
                                alignment=TA_JUSTIFY, spaceAfter=11),
        'small': ParagraphStyle('Small', fontName='ArialUni', fontSize=9.5, alignment=TA_CENTER, spaceAfter=12),
    }

    story = []

    story.append(Paragraph("ГИДРОАТЛАС", styles['title']))
    story.append(Paragraph("Единая государственная система мониторинга водных ресурсов<br/>Республики Казахстан", styles['subtitle']))
    story.append(Spacer(1, 20))
    story.append(Paragraph("ГИДРОЛОГИЧЕСКИЙ ПРОГНОЗ", styles['h1']))
    story.append(Paragraph("на вегетационный период 2025 года", styles['subtitle']))

    story.append(Paragraph(f"Водный объект: <b>{obj_full.get('object_name', '—')}</b>", styles['h1']))
    story.append(Paragraph(f"Регион: {obj_full.get('region', '—')}  Код поста: {obj_full.get('water_object_code', '—')}", styles['normal']))

    story.append(Spacer(1, 15))
    story.append(Paragraph("Динамика уровня воды", styles['h2']))
    story.append(create_level_chart(obj_full.get("history", []), obj_full.get("danger_level_cm")))
    story.append(Spacer(1, 15))

    story.append(Paragraph("ПРОГНОЗ ГИДРОЛОГИЧЕСКОГО РЕЖИМА", styles['h1']))
    for p in ollama_generate_forecast(obj_full).split("\n"):
        if p.strip():
            story.append(Paragraph(p.strip(), styles['normal']))

    story.append(Spacer(1, 20))
    story.append(Paragraph("Текущие показатели", styles['h2']))

    danger = obj_full.get('is_dangerous', False)
    state_color = "#c62828" if danger else "#2e7d32"

    table_data = [
        ["Показатель", "Значение"],
        ["Уровень воды", f"{obj_full.get('actual_level_cm', '—')} см"],
        ["Опасная отметка", f"{obj_full.get('danger_level_cm', '—')} см"],
        ["Расход воды", f"{obj_full.get('actual_discharge_m3s', '—')} м³/с"],
        ["Температура воды", f"{obj_full.get('water_temperature_C', '—')} °C"],
        ["Режим", Paragraph(f'<font color="{state_color}"><b>{"ОПАСНЫЙ" if danger else "НОРМАЛЬНЫЙ"}</b></font>', styles['normal'])],
    ]

    table = Table(table_data, colWidths=[10*cm, 6*cm])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#003087")),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('GRID', (0,0), (-1,-1), 1, colors.grey),
        ('BACKGROUND', (0,1), (-1,-1), colors.HexColor("#f8f9fa")),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('FONTNAME', (0,0), (-1,0), 'ArialUni-Bold'),
        ('FONTNAME', (0,1), (-1,-1), 'ArialUni'),
        ('FONTSIZE', (0,0), (-1,-1), 12),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
    ]))
    story.append(table)

    story.append(PageBreak())
    story.append(Paragraph(f"Дата формирования: {datetime.now().strftime('%d.%m.%Y в %H:%M')}", styles['small']))
    story.append(Paragraph("ГидроАтлас — государственная система мониторинга водных объектов РК", styles['small']))

    doc.build(story)
    buffer.seek(0)
    return buffer