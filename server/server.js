// ✅ Load environment variables from .env and prisma/.env
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Health check route
app.get('/', (req, res) => {
  res.json({ message: '🚀 LinkShelf backend is running successfully!' });
});

// ✅ Get all links
app.get('/api/links', async (req, res) => {
  try {
    const links = await prisma.link.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(links);
  } catch (error) {
    console.error('Error fetching links:', error);
    res.status(500).json({ error: 'Failed to fetch links' });
  }
});

// ✅ Add a new link
app.post('/api/links', async (req, res) => {
  const { title, url, tags, description } = req.body;
  try {
    const newLink = await prisma.link.create({
      data: { title, url, tags, description },
    });
    res.status(201).json(newLink);
  } catch (error) {
    console.error('Error creating link:', error);
    res.status(400).json({ error: 'Failed to add link' });
  }
});

// ✅ Update a link
app.put('/api/links/:id', async (req, res) => {
  const { id } = req.params;
  const { title, url, tags, description } = req.body;
  try {
    const updated = await prisma.link.update({
      where: { id: Number(id) },
      data: { title, url, tags, description },
    });
    res.json(updated);
  } catch (error) {
    console.error('Error updating link:', error);
    res.status(400).json({ error: 'Failed to update link' });
  }
});

// ✅ Delete a link
app.delete('/api/links/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.link.delete({
      where: { id: Number(id) },
    });
    res.json({ message: 'Link deleted successfully' });
  } catch (error) {
    console.error('Error deleting link:', error);
    res.status(400).json({ error: 'Failed to delete link' });
  }
});

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
