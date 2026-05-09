"""
app/services/report_service.py
Generate professional PDF report for a prediction using ReportLab
"""
import io
from datetime import datetime


def generate_pdf_report(prediction, user) -> bytes:
    """Return PDF bytes for a Prediction record."""
    try:
        from reportlab.lib.pagesizes import A4
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.lib.units import cm
        from reportlab.lib import colors
        from reportlab.platypus import (
            SimpleDocTemplate, Paragraph, Spacer, Table,
            TableStyle, HRFlowable
        )

        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer, pagesize=A4,
            leftMargin=2*cm, rightMargin=2*cm,
            topMargin=2*cm, bottomMargin=2*cm
        )

        styles = getSampleStyleSheet()
        green  = colors.HexColor("#16a34a")
        dark   = colors.HexColor("#1e293b")
        light  = colors.HexColor("#f0fdf4")

        TITLE_STYLE = ParagraphStyle(
            "title", parent=styles["Title"],
            fontSize=20, textColor=green, spaceAfter=6
        )
        HEAD_STYLE = ParagraphStyle(
            "head", parent=styles["Heading2"],
            fontSize=13, textColor=dark, spaceBefore=12, spaceAfter=4
        )
        BODY_STYLE = ParagraphStyle(
            "body", parent=styles["Normal"],
            fontSize=10, leading=14
        )

        elements = []

        # ── Header ────────────────────────────────────────────────────────────
        elements.append(Paragraph("🌿 AI Papaya Disease Detection System", TITLE_STYLE))
        elements.append(Paragraph("Leaf Disease Prediction Report", styles["Heading3"]))
        elements.append(HRFlowable(width="100%", thickness=1, color=green))
        elements.append(Spacer(1, 0.3*cm))

        # ── Patient / Farmer info ─────────────────────────────────────────────
        elements.append(Paragraph("Farmer Information", HEAD_STYLE))
        info_data = [
            ["Name",    user.name,              "Location", user.location or "—"],
            ["Email",   user.email,             "Phone",    user.phone or "—"],
            ["Report Date", datetime.utcnow().strftime("%B %d, %Y"), "Report ID", f"RPT-{prediction.id:05d}"],
        ]
        t = Table(info_data, colWidths=[3*cm, 6*cm, 3*cm, 5*cm])
        t.setStyle(TableStyle([
            ("BACKGROUND", (0,0), (-1,-1), light),
            ("FONTSIZE",   (0,0), (-1,-1), 9),
            ("FONTNAME",   (0,0), (0,-1), "Helvetica-Bold"),
            ("FONTNAME",   (2,0), (2,-1), "Helvetica-Bold"),
            ("GRID",       (0,0), (-1,-1), 0.5, colors.white),
            ("ROWBACKGROUNDS", (0,0), (-1,-1), [light, colors.white]),
            ("TOPPADDING",  (0,0), (-1,-1), 4),
            ("BOTTOMPADDING",(0,0), (-1,-1), 4),
        ]))
        elements.append(t)
        elements.append(Spacer(1, 0.4*cm))

        # ── Diagnosis result ──────────────────────────────────────────────────
        elements.append(Paragraph("Diagnosis Result", HEAD_STYLE))
        sev_color = {
            "none": "#16a34a", "low": "#84cc16",
            "medium": "#f59e0b", "high": "#ef4444", "critical": "#7f1d1d"
        }.get(prediction.severity, "#64748b")

        diag_data = [
            ["Disease Detected", prediction.disease_name],
            ["Confidence Score", f"{prediction.confidence*100:.1f}%"],
            ["Severity Level",   (prediction.severity or "—").upper()],
            ["Prediction Date",  prediction.created_at.strftime("%Y-%m-%d %H:%M UTC")],
        ]
        dt = Table(diag_data, colWidths=[5*cm, 12*cm])
        dt.setStyle(TableStyle([
            ("FONTNAME",  (0,0), (0,-1), "Helvetica-Bold"),
            ("FONTSIZE",  (0,0), (-1,-1), 10),
            ("GRID",      (0,0), (-1,-1), 0.5, colors.lightgrey),
            ("ROWBACKGROUNDS", (0,0), (-1,-1), [light, colors.white]),
            ("TOPPADDING",  (0,0), (-1,-1), 5),
            ("BOTTOMPADDING",(0,0), (-1,-1), 5),
        ]))
        elements.append(dt)
        elements.append(Spacer(1, 0.4*cm))

        # ── Confidence breakdown ───────────────────────────────────────────────
        if prediction.all_scores:
            elements.append(Paragraph("Confidence Score Breakdown (Top 5)", HEAD_STYLE))
            sorted_scores = sorted(prediction.all_scores.items(), key=lambda x: x[1], reverse=True)[:5]
            score_rows = [["Disease", "Score"]] + [
                [name, f"{score*100:.2f}%"] for name, score in sorted_scores
            ]
            st = Table(score_rows, colWidths=[13*cm, 4*cm])
            st.setStyle(TableStyle([
                ("BACKGROUND", (0,0), (-1,0), green),
                ("TEXTCOLOR",  (0,0), (-1,0), colors.white),
                ("FONTNAME",   (0,0), (-1,0), "Helvetica-Bold"),
                ("FONTSIZE",   (0,0), (-1,-1), 9),
                ("GRID",       (0,0), (-1,-1), 0.5, colors.lightgrey),
                ("ROWBACKGROUNDS", (0,1), (-1,-1), [colors.white, light]),
                ("TOPPADDING",  (0,0), (-1,-1), 4),
                ("BOTTOMPADDING",(0,0), (-1,-1), 4),
            ]))
            elements.append(st)
            elements.append(Spacer(1, 0.4*cm))

        # ── Treatment recommendation ────────────────────────────────────────
        elements.append(Paragraph("Treatment Recommendation", HEAD_STYLE))
        elements.append(Paragraph(prediction.treatment or "No treatment data available.", BODY_STYLE))
        elements.append(Spacer(1, 0.4*cm))

        # ── Footer ─────────────────────────────────────────────────────────
        elements.append(HRFlowable(width="100%", thickness=0.5, color=colors.lightgrey))
        elements.append(Spacer(1, 0.2*cm))
        elements.append(Paragraph(
            "⚠️ This report is generated by an AI system. Always consult a certified "
            "agronomist before applying any treatment.",
            ParagraphStyle("footer", parent=styles["Normal"], fontSize=8,
                           textColor=colors.grey, fontName="Helvetica-Oblique")
        ))

        doc.build(elements)
        return buffer.getvalue()

    except ImportError:
        # ReportLab not installed — return minimal plain-text PDF
        content = (
            f"%PDF-1.4\n"
            f"Report for Prediction #{prediction.id}\n"
            f"Disease: {prediction.disease_name}\n"
            f"Confidence: {prediction.confidence*100:.1f}%\n"
            f"Treatment: {prediction.treatment}\n"
        )
        return content.encode("utf-8")