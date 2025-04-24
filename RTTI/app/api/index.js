import express from "express";
import client from "../db/db-connection.js"; // PostgreSQL client
import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";

const app = express();
app.use(express.json()); // Parse JSON bodies

// ------------------------------------------------------------------
// Root & health-check routes
// ------------------------------------------------------------------
app.get("/health", (_req, res) => res.sendStatus(200));

app.get("/", (_req, res) =>
  res.send(
    "RTTI API is running. Try GET /assets, POST /assets, or /api/reports/threat 🚀"
  )
);
// ------------------------------------------------------------------

// ========== Asset Endpoints ==========

// GET all assets
app.get("/assets", async (_req, res) => {
  try {
    const result = await client.query("SELECT * FROM assets");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error retrieving assets:", error);
    res.status(500).json({ error: "Failed to retrieve assets" });
  }
});

// POST new asset
app.post("/assets", async (req, res) => {
  const { name, category, description } = req.body;
  try {
    const query =
      "INSERT INTO assets (name, category, description) VALUES ($1, $2, $3) RETURNING *";
    const values = [name, category, description];
    const result = await client.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating asset:", error);
    res.status(500).json({ error: "Failed to create asset" });
  }
});

// PUT update asset
app.put("/assets/:id", async (req, res) => {
  const assetId = req.params.id;
  const { name, category, description } = req.body;
  try {
    const query =
      "UPDATE assets SET name = $1, category = $2, description = $3 WHERE id = $4 RETURNING *";
    const values = [name, category, description, assetId];
    const result = await client.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Asset not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error updating asset:", error);
    res.status(500).json({ error: "Failed to update asset" });
  }
});

// DELETE asset
app.delete("/assets/:id", async (req, res) => {
  const assetId = req.params.id;
  try {
    const query = "DELETE FROM assets WHERE id = $1 RETURNING *";
    const values = [assetId];
    const result = await client.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Asset not found" });
    }
    res.status(200).json({ message: "Asset deleted successfully" });
  } catch (error) {
    console.error("Error deleting asset:", error);
    res.status(500).json({ error: "Failed to delete asset" });
  }
});

// ========== PDF Report Endpoint ==========

app.get("/api/reports/threat", (_req, res) => {
  const doc = new PDFDocument();
  const filePath = path.resolve("threat_report.pdf");
  const stream = fs.createWriteStream(filePath);

  doc.pipe(stream);

  doc.fontSize(20).text("Threat Intelligence Report", { align: "center" });
  doc.moveDown();
  doc.fontSize(14).text("Threat: SQL Injection  |  Risk Score: 25");
  doc.moveDown();
  doc.text("Threat: DDoS Attack  |  Risk Score: 30");
  doc.moveDown();
  doc.text("Threat: Cross-Site Scripting (XSS)  |  Risk Score: 18");

  doc.end();

  stream.on("finish", () => {
    res.download(filePath, "threat_report.pdf", (err) => {
      if (err) {
        console.error("Download error:", err);
        res.status(500).json({ error: "Failed to download report" });
      }
    });
  });
});

// ========== Start Server ==========

const PORT = process.env.PORT || 3000; // Render sets PORT env var
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

export default app;
