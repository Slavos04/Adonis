"""
Moduł generatora eleganckich dokumentów PDF z jadłospisami dla pacjenta i dietetyka.
Obsługuje szablony (DietPlanTemplate) oraz aktywne jadłospisy tygodniowe pacjenta (DailyMealPlan / PlannedMeal)
z pełnym wsparciem polskich znaków (czcionka DejaVu Sans) i estetycznym layoutem Adonis Fit & Eat.
"""

import io
import os
from decimal import Decimal
from typing import List, Dict, Any, Optional

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import cm, mm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# Rejestracja czcionek wspierających polskie znaki
FONT_NAME = "Helvetica"
FONT_NAME_BOLD = "Helvetica-Bold"

def _register_fonts():
    global FONT_NAME, FONT_NAME_BOLD
    # Szukamy DejaVuSans na linuksie (docker) lub windowsie
    possible_paths = [
        ("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"),
        ("C:\\Windows\\Fonts\\arial.ttf", "C:\\Windows\\Fonts\\arialbd.ttf"),
        ("C:\\Windows\\Fonts\\segoeui.ttf", "C:\\Windows\\Fonts\\segoeuib.ttf"),
    ]
    for reg, bld in possible_paths:
        if os.path.exists(reg) and os.path.exists(bld):
            try:
                pdfmetrics.registerFont(TTFont("AdonisFont", reg))
                pdfmetrics.registerFont(TTFont("AdonisFont-Bold", bld))
                FONT_NAME = "AdonisFont"
                FONT_NAME_BOLD = "AdonisFont-Bold"
                return
            except Exception:
                pass

_register_fonts()

# Paleta kolorów Adonis
PRIMARY_COLOR = colors.HexColor("#0f766e")      # Głęboki morski / szmaragdowy
PRIMARY_DARK = colors.HexColor("#115e59")
SECONDARY_COLOR = colors.HexColor("#10b981")    # Świeża zieleń
BG_LIGHT = colors.HexColor("#f0fdfa")           # Bardzo jasny miętowy
BG_GRAY = colors.HexColor("#f8fafc")            # Bardzo jasny szary
TEXT_MAIN = colors.HexColor("#0f172a")          # Slate 900
TEXT_MUTED = colors.HexColor("#64748b")         # Slate 500
BORDER_COLOR = colors.HexColor("#cbd5e1")       # Slate 300
ACCENT_SUBSTITUTE = colors.HexColor("#ea580c")  # Pomarańczowy dla zamienników


class NumberedCanvas(canvas.Canvas):
    """Numeracja stron typu: Strona X z Y oraz stopka Adonis."""
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont(FONT_NAME, 8)
        self.setFillColor(TEXT_MUTED)

        # Górna belka dekoracyjna
        self.setFillColor(PRIMARY_COLOR)
        self.rect(0, A4[1] - 4*mm, A4[0], 4*mm, stroke=0, fill=1)

        # Dolna stopka
        self.setStrokeColor(BORDER_COLOR)
        self.setLineWidth(0.5)
        self.line(1.5*cm, 1.2*cm, A4[0] - 1.5*cm, 1.2*cm)

        footer_left = "Adonis Fit & Eat — Inteligentny Asystent Dietetyczny"
        footer_right = f"Strona {self._pageNumber} z {page_count}"
        self.drawString(1.5*cm, 0.8*cm, footer_left)
        self.drawRightString(A4[0] - 1.5*cm, 0.8*cm, footer_right)
        self.restoreState()


def _get_styles():
    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        'AdonisTitle',
        parent=styles['Normal'],
        fontName=FONT_NAME_BOLD,
        fontSize=20,
        leading=24,
        textColor=PRIMARY_COLOR,
        spaceAfter=4
    )

    subtitle_style = ParagraphStyle(
        'AdonisSubtitle',
        parent=styles['Normal'],
        fontName=FONT_NAME,
        fontSize=10,
        leading=14,
        textColor=TEXT_MUTED,
        spaceAfter=12
    )

    day_header_style = ParagraphStyle(
        'DayHeader',
        parent=styles['Normal'],
        fontName=FONT_NAME_BOLD,
        fontSize=13,
        leading=16,
        textColor=PRIMARY_DARK,
        spaceBefore=8,
        spaceAfter=6
    )

    meal_title_style = ParagraphStyle(
        'MealTitle',
        parent=styles['Normal'],
        fontName=FONT_NAME_BOLD,
        fontSize=10,
        leading=13,
        textColor=TEXT_MAIN
    )

    meal_meta_style = ParagraphStyle(
        'MealMeta',
        parent=styles['Normal'],
        fontName=FONT_NAME,
        fontSize=8.5,
        leading=11,
        textColor=TEXT_MUTED
    )

    ingredients_style = ParagraphStyle(
        'Ingredients',
        parent=styles['Normal'],
        fontName=FONT_NAME,
        fontSize=8,
        leading=11,
        textColor=TEXT_MAIN
    )

    instructions_style = ParagraphStyle(
        'Instructions',
        parent=styles['Normal'],
        fontName=FONT_NAME,
        fontSize=7.5,
        leading=10,
        textColor=TEXT_MUTED
    )

    badge_substitute_style = ParagraphStyle(
        'BadgeSub',
        parent=styles['Normal'],
        fontName=FONT_NAME_BOLD,
        fontSize=7.5,
        leading=9,
        textColor=ACCENT_SUBSTITUTE
    )

    return {
        'title': title_style,
        'subtitle': subtitle_style,
        'day_header': day_header_style,
        'meal_title': meal_title_style,
        'meal_meta': meal_meta_style,
        'ingredients': ingredients_style,
        'instructions': instructions_style,
        'badge_sub': badge_substitute_style,
    }


def generate_diet_pdf_buffer(
    title: str,
    subtitle: str,
    days_data: List[Dict[str, Any]],
    patient_info: Optional[Dict[str, Any]] = None,
    dietitian_info: Optional[Dict[str, Any]] = None,
    notes: Optional[str] = None
) -> io.BytesIO:
    """
    Kompiluje pełny plik PDF do bufora w pamięci.
    Każdy element w `days_data` ma format:
    {
        "day_name": "Poniedziałek (30.10.2026)",
        "calories": 1850,
        "protein_g": 110,
        "fat_g": 60,
        "carbs_g": 220,
        "meals": [
            {
                "meal_type": "Śniadanie",
                "title": "Jajka na miękko z pieczywem",
                "calories": 438,
                "protein_g": 20,
                "fat_g": 21,
                "carbs_g": 46,
                "is_custom_substitution": False,
                "ingredients": ["jaja kurze (2 sztuki, 100g)", "chleb żytni (70g)"],
                "instructions": "Ugotuj jajka na miękko..."
            }
        ]
    }
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        leftMargin=1.5*cm,
        rightMargin=1.5*cm,
        topMargin=1.5*cm,
        bottomMargin=1.8*cm
    )

    styles = _get_styles()
    story = []

    # 1. Nagłówek dokumentu
    story.append(Paragraph(title, styles['title']))
    story.append(Paragraph(subtitle, styles['subtitle']))

    # 2. Blok informacji o pacjencie i dietetyku (jeśli przekazano)
    meta_cells = []
    if patient_info:
        p_text = f"<b>Pacjent:</b> {patient_info.get('name', '')}"
        if patient_info.get('calories_target'):
            p_text += f"<br/><b>Cel kalorii:</b> {patient_info['calories_target']} kcal"
        meta_cells.append(Paragraph(p_text, styles['meal_meta']))
    else:
        meta_cells.append(Paragraph("<b>Pakiet jadłospisu Adonis</b>", styles['meal_meta']))

    if dietitian_info:
        d_text = f"<b>Dietetyk:</b> {dietitian_info.get('name', 'Dietetyk Adonis')}"
        if dietitian_info.get('email'):
            d_text += f"<br/><b>Kontakt:</b> {dietitian_info['email']}"
        meta_cells.append(Paragraph(d_text, styles['meal_meta']))
    else:
        meta_cells.append(Paragraph("<b>Źródło:</b> Oficjalne zalecenia Adonis Fit & Eat", styles['meal_meta']))

    meta_table = Table([meta_cells], colWidths=[9*cm, 9*cm])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), BG_GRAY),
        ('BOX', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('PADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 8))

    if notes:
        n_p = Paragraph(f"<b>Wskazówki dietetyka:</b> {notes}", styles['instructions'])
        story.append(n_p)
        story.append(Spacer(1, 6))

    story.append(HRFlowable(width="100%", thickness=0.5, color=BORDER_COLOR, spaceBefore=4, spaceAfter=8))

    # 3. Dni jadłospisu
    for d_idx, day in enumerate(days_data):
        day_elements = []

        day_name = day.get('day_name', f'Dzień {d_idx + 1}')
        day_cal = day.get('calories', 0)
        day_p = day.get('protein_g', 0)
        day_f = day.get('fat_g', 0)
        day_c = day.get('carbs_g', 0)

        header_text = f"{day_name} &nbsp;&bull;&nbsp; <font size=9 color='#64748b'>{day_cal:.0f} kcal | B: {day_p:.1f}g | T: {day_f:.1f}g | W: {day_c:.1f}g</font>"
        day_elements.append(Paragraph(header_text, styles['day_header']))

        # Tabela posiłków na dany dzień
        table_rows = []
        for m in day.get('meals', []):
            m_type = m.get('meal_type', 'Posiłek')
            m_title = m.get('title', 'Posiłek bez nazwy')
            m_cal = m.get('calories', 0)
            m_p = m.get('protein_g', 0)
            m_f = m.get('fat_g', 0)
            m_c = m.get('carbs_g', 0)
            is_sub = m.get('is_custom_substitution', False)

            # Kolumna 1: Typ posiłku + makro
            sub_badge = "<br/><font color='#ea580c'><b>[ZAMIENIONY]</b></font>" if is_sub else ""
            left_text = (
                f"<b>{m_type}</b>{sub_badge}<br/>"
                f"<font color='#0f766e'><b>{m_cal:.0f} kcal</b></font><br/>"
                f"<font size=7 color='#64748b'>B: {m_p:.1f}g<br/>T: {m_f:.1f}g<br/>W: {m_c:.1f}g</font>"
            )
            col_left = Paragraph(left_text, styles['meal_meta'])

            # Kolumna 2: Nazwa dania + składniki + instrukcja
            right_parts = [f"<b>{m_title}</b>"]
            ings = m.get('ingredients', [])
            if ings:
                right_parts.append(f"<font color='#475569'><b>Składniki:</b> {', '.join(ings)}</font>")
            instr = m.get('instructions')
            if instr and len(instr.strip()) > 3:
                # Ograniczamy instrukcję do zwięzłego tekstu, by nie rozpychać kartki
                short_instr = instr.strip().replace('\n', ' ')
                if len(short_instr) > 280:
                    short_instr = short_instr[:277] + '...'
                right_parts.append(f"<font color='#64748b'><i>{short_instr}</i></font>")

            col_right = Paragraph("<br/>".join(right_parts), styles['ingredients'])
            table_rows.append([col_left, col_right])

        if table_rows:
            meals_table = Table(table_rows, colWidths=[3.2*cm, 14.8*cm])
            meals_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (0, -1), BG_LIGHT),
                ('BOX', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
                ('INNERGRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ('PADDING', (0, 0), (-1, -1), 5),
            ]))
            day_elements.append(meals_table)
            day_elements.append(Spacer(1, 10))

        story.append(KeepTogether(day_elements))

    doc.build(story, canvasmaker=NumberedCanvas)
    buffer.seek(0)
    return buffer

