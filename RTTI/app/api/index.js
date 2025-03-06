// app/api/index.js
import express from 'express';
import client from '../db/db-connection.js'; // Make sure to include the .js extension

const app = express();

app.use(express.json()); // Middleware to parse JSON bodies

// GET endpoint to retrieve all assets
app.get('/assets', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM assets');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error retrieving assets:', error);
    res.status(500).json({ error: 'Failed to retrieve assets' });
  }
});

// POST endpoint to create a new asset
app.post('/assets', async (req, res) => {
  const { name, category, description } = req.body;
  try {
    const query = 'INSERT INTO assets (name, category, description) VALUES ($1, $2, $3) RETURNING *';
    const values = [name, category, description];
    const result = await client.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating asset:', error);
    res.status(500).json({ error: 'Failed to create asset' });
  }
});

// PUT endpoint to update an existing asset by id
app.put('/assets/:id', async (req, res) => {
  const assetId = req.params.id;
  const { name, category, description } = req.body;
  try {
    const query = 'UPDATE assets SET name = $1, category = $2, description = $3 WHERE id = $4 RETURNING *';
    const values = [name, category, description, assetId];
    const result = await client.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating asset:', error);
    res.status(500).json({ error: 'Failed to update asset' });
  }
});

// DELETE endpoint to remove an asset by id
app.delete('/assets/:id', async (req, res) => {
  const assetId = req.params.id;
  try {
    const query = 'DELETE FROM assets WHERE id = $1 RETURNING *';
    const values = [assetId];
    const result = await client.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    res.status(200).json({ message: 'Asset deleted successfully' });
  } catch (error) {
    console.error('Error deleting asset:', error);
    res.status(500).json({ error: 'Failed to delete asset' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
