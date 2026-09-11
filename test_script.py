import sys
import os
import json

sys.path.append(os.path.abspath('ai/initial assisment'))

from app.rag.quiz_generator import generate_quiz_from_pdf
from fpdf import FPDF

# Create dummy PDF
pdf = FPDF()
pdf.add_page()
pdf.set_font("Arial", size=12)
pdf.cell(200, 10, txt="Python is a programming language created by Guido van Rossum.", ln=1)
pdf.cell(200, 10, txt="It is widely used for web development, data science, and scripting.", ln=1)
pdf.cell(200, 10, txt="Lists and dictionaries are fundamental data structures in Python.", ln=1)
pdf.cell(200, 10, txt="A lambda function is a small anonymous function in Python.", ln=1)
pdf.output("dummy.pdf")

try:
    metadata = {"resource_id": "RES-TEST"}
    result = generate_quiz_from_pdf("dummy.pdf", metadata)
    print("SUCCESS")
    print(json.dumps(result, indent=2))
except Exception as e:
    print("FAILED:", e)
