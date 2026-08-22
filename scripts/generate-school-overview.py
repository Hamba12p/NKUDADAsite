from pathlib import Path

from reportlab.lib.colors import HexColor, black, white
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "downloads" / "nk-udada-school-outreach-overview.pdf"
LOGO = ROOT / "public" / "Logo2.png"
FONT_DIR = Path("C:/Windows/Fonts")

GREY_700 = HexColor("#404040")
GREY_500 = HexColor("#707070")
GREY_300 = HexColor("#CFCFCF")


def paragraph(pdf, text, x, y_top, width, style):
    block = Paragraph(text, style)
    _, height = block.wrap(width, 1000)
    block.drawOn(pdf, x, y_top - height)
    return y_top - height


def section_label(pdf, text, x, y):
    pdf.setFillColor(black)
    pdf.setFont("NKSans-Bold", 8)
    pdf.drawString(x, y, text.upper())


def rule(pdf, x1, y, x2, width=0.7):
    pdf.setStrokeColor(GREY_300)
    pdf.setLineWidth(width)
    pdf.line(x1, y, x2, y)


def main():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    pdfmetrics.registerFont(TTFont("NKSans", str(FONT_DIR / "arial.ttf")))
    pdfmetrics.registerFont(TTFont("NKSans-Bold", str(FONT_DIR / "arialbd.ttf")))
    pdfmetrics.registerFont(TTFont("NKSerif-Bold", str(FONT_DIR / "georgiab.ttf")))

    pdf = canvas.Canvas(str(OUTPUT), pagesize=A4, pageCompression=1)
    page_w, page_h = A4
    margin = 48
    content_w = page_w - (2 * margin)

    body = ParagraphStyle(
        "body",
        fontName="NKSans",
        fontSize=9,
        leading=13.5,
        textColor=GREY_700,
        alignment=TA_LEFT,
    )
    item_title = ParagraphStyle(
        "item-title",
        fontName="NKSans-Bold",
        fontSize=9.5,
        leading=12,
        textColor=black,
        alignment=TA_LEFT,
        spaceAfter=3,
    )
    item_body = ParagraphStyle(
        "item-body",
        fontName="NKSans",
        fontSize=8.2,
        leading=11.4,
        textColor=GREY_500,
        alignment=TA_LEFT,
    )
    centered = ParagraphStyle(
        "centered",
        fontName="NKSans",
        fontSize=8.2,
        leading=11,
        textColor=GREY_500,
        alignment=TA_CENTER,
    )

    pdf.setTitle("School Outreach Programme - Overview for School Administrators")
    pdf.setAuthor("NK Udada Foundation")
    pdf.setFillColor(white)
    pdf.rect(0, 0, page_w, page_h, fill=1, stroke=0)

    # Centered masthead. The logo is the document's only colored element.
    logo_size = 86
    if LOGO.exists():
        pdf.drawImage(
            ImageReader(str(LOGO)),
            (page_w - logo_size) / 2,
            page_h - 119,
            logo_size,
            logo_size,
            mask="auto",
            preserveAspectRatio=True,
        )

    pdf.setFillColor(black)
    pdf.setFont("NKSans-Bold", 10)
    pdf.drawCentredString(page_w / 2, page_h - 132, "NK UDADA FOUNDATION")
    pdf.setFillColor(GREY_500)
    pdf.setFont("NKSans", 7.5)
    pdf.drawCentredString(page_w / 2, page_h - 144, "EMPOWER & EQUIP - UGANDA")

    pdf.setFillColor(black)
    pdf.setFont("NKSerif-Bold", 23)
    pdf.drawCentredString(page_w / 2, page_h - 181, "School Outreach Programme")
    pdf.setFont("NKSans", 10)
    pdf.setFillColor(GREY_700)
    pdf.drawCentredString(page_w / 2, page_h - 199, "Overview for School Administrators")
    rule(pdf, margin, page_h - 218, page_w - margin, 0.9)

    # Introduction
    section_label(pdf, "Who we are", margin, page_h - 242)
    pdf.setFillColor(black)
    pdf.setFont("NKSerif-Bold", 14)
    pdf.drawString(margin, page_h - 261, "Youth-led, practical, and built for Uganda's students.")
    intro_bottom = paragraph(
        pdf,
        "NK Udada Foundation is a youth-led nonprofit based in Kampala, Uganda, established in 2024. "
        "The organization equips young people with education, health knowledge, life skills, and practical support.",
        margin,
        page_h - 274,
        content_w,
        body,
    )
    paragraph(
        pdf,
        "The School Outreach Programme brings trained facilitators into secondary schools for structured, "
        "age-appropriate sessions on reproductive health, financial literacy, goal setting, and staying in school. "
        "Each visit is planned with school leadership and adapted to the learners attending.",
        margin,
        intro_bottom - 5,
        content_w,
        body,
    )

    # Programme pillars
    programme_y = page_h - 373
    section_label(pdf, "The programme - one session, four pillars", margin, programme_y)
    rule(pdf, margin, programme_y - 9, page_w - margin)

    pillars = [
        ("01  SRH Dialogue", "Puberty, menstrual health, consent, healthy relationships, STI/HIV awareness, and digital safety."),
        ("02  Financial Literacy", "Saving, budgeting, needs versus wants, and entrepreneurship basics."),
        ("03  Goal Setting", "Personal vision, strengths discovery, and concrete next steps."),
        ("04  Staying in School", "Resilience, peer support, and why education matters."),
    ]
    column_gap = 28
    column_w = (content_w - column_gap) / 2
    start_y = programme_y - 31
    row_gap = 69
    for index, (title, description) in enumerate(pillars):
        column = index % 2
        row = index // 2
        x = margin + column * (column_w + column_gap)
        y = start_y - row * row_gap
        paragraph(pdf, title, x, y, column_w, item_title)
        paragraph(pdf, description, x, y - 17, column_w, item_body)

    details_y = programme_y - 174
    rule(pdf, margin, details_y + 15, page_w - margin)
    detail_gap = 34
    detail_w = (content_w - detail_gap) / 2
    section_label(pdf, "Who it is for", margin, details_y)
    paragraph(pdf, "S.1-S.6 learners, typically ages 13-19.", margin, details_y - 14, detail_w, body)
    section_label(pdf, "Track record", margin + detail_w + detail_gap, details_y)
    paragraph(
        pdf,
        "440+ learners reached across 3 pilot schools.",
        margin + detail_w + detail_gap,
        details_y - 14,
        detail_w,
        body,
    )

    # School requirements
    ask_y = details_y - 71
    rule(pdf, margin, ask_y + 16, page_w - margin)
    section_label(pdf, "What we ask of your school", margin, ask_y)
    requirements = [
        "A room or hall suitable for the participating students",
        "A 3-4 hour session window",
        "Approximate student numbers before the visit",
        "A reachable staff contact for coordination",
    ]
    for index, item in enumerate(requirements):
        column = index % 2
        row = index // 2
        x = margin + column * (column_w + column_gap)
        y = ask_y - 25 - (row * 29)
        pdf.setFillColor(black)
        pdf.setFont("NKSans-Bold", 8.7)
        pdf.drawString(x, y, f"{index + 1}.")
        paragraph(pdf, item, x + 18, y + 1, column_w - 18, item_body)

    # Restrained footer
    footer_rule_y = 91
    rule(pdf, margin, footer_rule_y, page_w - margin, 0.9)
    pdf.setFillColor(black)
    pdf.setFont("NKSans-Bold", 8)
    pdf.drawCentredString(page_w / 2, 72, "REQUEST A SCHOOL VISIT")
    paragraph(
        pdf,
        "admin@the-nkfoundation.org  |  +256 765 367558 (call or WhatsApp)  |  Kampala, Uganda",
        margin,
        60,
        content_w,
        centered,
    )
    pdf.setFillColor(GREY_500)
    pdf.setFont("NKSans", 7)
    pdf.drawCentredString(page_w / 2, 34, "School visits are provided at no cost to participating schools.")

    pdf.showPage()
    pdf.save()
    print(OUTPUT)


if __name__ == "__main__":
    main()
