from fpdf import FPDF

class ThreatReport(FPDF):
    def header(self):
        self.set_font("Arial", "B", 16)
        self.cell(200, 10, "Threat Intelligence Report", ln=True, align="C")

    def add_threat(self, threat, score):
        self.set_font("Arial", "", 12)
        self.cell(200, 10, f"Threat: {threat} - Risk Score: {score}", ln=True)

pdf = ThreatReport()
pdf.add_page()
pdf.add_threat("SQL Injection", 25)
pdf.output("threat_report.pdf")