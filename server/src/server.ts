import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config({ path: "./prisma/.env" });

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// ✅ GET all links
app.get("/api/links", async (req, res) => {
  const links = await prisma.link.findMany();
  res.json(links);
});

// ✅ POST new link
app.post("/api/links", async (req, res) => {
  try {
    const { title, url, tags, description } = req.body;
    if (!title || !url) {
      return res.status(400).json({ error: "Title and URL are required" });
    }

    const newLink = await prisma.link.create({
      data: { title, url, tags, description },
    });

    res.json(newLink);
  } catch (error) {
    console.error("Error creating link:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// 🗑️ DELETE a link
app.delete("/api/links/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.link.delete({
      where: { id: Number(id) },
    });
    res.json({ message: "Link deleted successfully" });
  } catch (error) {
    console.error("Error deleting link:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✏️ UPDATE a link
app.put("/api/links/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, url, tags, description } = req.body;

    const updated = await prisma.link.update({
      where: { id: Number(id) },
      data: { title, url, tags, description },
    });

    res.json(updated);
  } catch (error) {
    console.error("Error updating link:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
