import express from 'express';
import fs from 'fs';
import PDFDocument from 'pdfkit';
import path from 'path';

const router = express.Router();

router.get('/', (req, res) => {
  const doc = new PDFDocument();
  const filePath = path.resolve('threat_report.pdf');
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  // Add content to the PDF
  doc.fontSize(20).text('Threat Intelligence Report', { align: 'center' });
  doc.moveDown();
  doc.fontSize(14).text('Threat: SQL Injection  |  Risk Score: 25');

  doc.moveDown();
  doc.text('Threat: Cross-Site Scripting (XSS)  |  Risk Score: 18');

  doc.moveDown();
  doc.text('Threat: DDoS Attack  |  Risk Score: 30');

  doc.end();

  stream.on('finish', () => {
    res.download(filePath, 'threat_report.pdf', (err) => {
      if (err) {
        console.error('Download error:', err);
        res.status(500).json({ error: 'Failed to download report' });
      }
    });
  });
});

export default router;
