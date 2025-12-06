from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from io import BytesIO
from datetime import datetime
import os


font_path = "D:/gidro_hack/app/static/fonts/arial.ttf"
pdfmetrics.registerFont(TTFont("Arial", font_path))


def generate_passport_pdf(obj) -> BytesIO:
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        topMargin=2*cm,
        bottomMargin=2*cm,
        leftMargin=2*cm,
        rightMargin=2*cm
    )

    # === СТИЛИ ===
    normal = ParagraphStyle(
        name='Normal',
        fontName='Arial',
        fontSize=11,
        leading=14,
        alignment=0,
        spaceAfter=6
    )

    bold = ParagraphStyle(
        name='Bold',
        parent=normal,
        fontName='Arial',
        fontSize=12,
        fontWeight='bold',
        spaceBefore=12,
        spaceAfter=8
    )

    title = ParagraphStyle(
        name='Title',
        fontName='Arial',
        fontSize=20,
        alignment=1,  # центр
        textColor=colors.HexColor("#003366"),
        spaceAfter=30
    )

    story = []

    # === ЗАГОЛОВОК ===
    name = obj.name or "Наименование отсутствует"
    story.append(Paragraph(f"Паспорт {name}", title))
    story.append(Paragraph("(наименование водоема (участка))", normal))
    story.append(Spacer(1, 20))

    # === 1. Географическое расположение ===
    story.append(Paragraph("1. Географическое расположение", bold))

    region = getattr(obj.region, 'region', None) or "Улытауская область"
    district = getattr(obj, 'district', None) or "Улытауский район"
    location = getattr(obj, 'location_description', None) or "4,6 км Ю от села Коскол"

    story.append(Paragraph(f"Административная область: <u>{region}</u>", normal))
    story.append(Paragraph(f"Административный район: <u>{district}</u>", normal))
    story.append(Paragraph(f"Месторасположение водоема: <u>{location}</u>", normal))
    story.append(Paragraph("(наименование ближайшего населенного пункта, направление расположения водоема, удаленность в км)", normal))

    # === КООРДИНАТЫ — ИСПРАВЛЕНО! ===
    if obj.latitude is not None and obj.longitude is not None:
        coords = f"Широта: {float(obj.latitude):.6f}, Долгота: {float(obj.longitude):.6f}"
    else:
        coords = ("центр N 49°34'09\", E 67°04'25\", север N 49°34'41\", E 67°05'47\", "
                  "юг N 49°33'27\" E 67°03'06\", восток N 49°33'27\", E 67°04'55\", "
                  "запад N 49°34'50\", E 67°03'56\"")

    story.append(Paragraph(f"Границы участка: {coords}", normal))
    story.append(Paragraph("(описание границ, координаты)", normal))
    story.append(Spacer(1, 20))

    # === 2. Физическая характеристика ===
    story.append(Paragraph("2. Физическая характеристика", bold))

    data_phys = [
        ["Длина, м", getattr(obj, 'length_m', "4100") or "4100"],
        ["Ширина, м", getattr(obj, 'width_m', "2200") or "2200"],
        ["Площадь, га", getattr(obj, 'area_ha', "658") or "658"],
        ["Глубина максимальная, м", getattr(obj, 'max_depth_m', "нет, высокая степень зарастаемости") or "нет, высокая степень зарастаемости"],
        ["Глубина средняя, м", getattr(obj, 'avg_depth_m', "—") or "—"],
        ["Глубина минимальная, м", getattr(obj, 'min_depth_m', "0,1") or "0,1"],
    ]

    table = Table(data_phys, colWidths=[8*cm, 9*cm])
    table.setStyle(TableStyle([
        ('GRID', (0,0), (-1,-1), 0.5, colors.grey),
        ('FONTNAME', (0,0), (-1,-1), 'Arial'),
        ('FONTSIZE', (0,0), (-1,-1), 11),
        ('ALIGN', (1,0), (-1,-1), 'RIGHT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(table)
    story.append(Spacer(1, 20))

    # === 3. Биологическая характеристика ===
    story.append(Paragraph("3. Биологическая характеристика", bold))
    story.append(Paragraph("Степень зарастания водоема:", normal))
    story.append(Paragraph("надводной растительностью: <u>до 5 %, слабо (камыш)</u> (сильно, средне, слабо)", normal))
    story.append(Paragraph("подводной растительностью: <u>до 45 %, средние</u> (сильно, средне, слабо)", normal))
    story.append(Paragraph("Степень развития фитопланктона (цветение воды): <u>слабо</u> (сильно, средне, слабо)", normal))
    story.append(Spacer(1, 10))

    story.append(Paragraph("Видовой состав фауны водоема:", normal))
    fauna_text = "есть" if getattr(obj, 'fauna', False) else "нет"
    story.append(Paragraph(f"ихтиофауны: <u>{fauna_text}</u>", normal))
    story.append(Paragraph("млекопитающих: <u>нет</u>", normal))
    story.append(Paragraph("беспозвоночных водных животных: <u>нет</u>", normal))

    story.append(Spacer(1, 10))
    story.append(Paragraph("Рыбопродуктивность водоема, кг/га:", normal))
    productivity = getattr(obj, 'fish_productivity_kg_ha', "60") or "60"
    story.append(Paragraph(f"ихтиофауны: <u>{productivity} кг/га</u>", normal))
    story.append(Paragraph("млекопитающих: <u>нет</u>", normal))
    story.append(Paragraph("беспозвоночных водных животных: <u>нет</u>", normal))

    story.append(Spacer(1, 40))
    story.append(Paragraph(f"Паспорт сформирован автоматически • {datetime.now().strftime('%d.%m.%Y %H:%M')}", normal))

    doc.build(story)
    buffer.seek(0)
    return buffer