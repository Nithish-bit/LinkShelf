import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(cors({ origin: "http://localhost:3000" })); // ✅ allow React app
app.use(express.json());

// ✅ GET all links
app.get("/api/links", async (req, res) => {
  try {
    const links = await prisma.link.findMany();
    res.json(links);
  } catch (error) {
    console.error("Error fetching links:", error);
    res.status(500).json({ error: "Internal server error" });
  }
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

// ✅ DELETE a link
app.delete("/api/links/:id", async (req, res) => {
  try {
    await prisma.link.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Error deleting link:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ PUT (update) a link
app.put("/api/links/:id", async (req, res) => {
  try {
    const { title, url, tags, description } = req.body;
    const updated = await prisma.link.update({
      where: { id: Number(req.params.id) },
      data: { title, url, tags, description },
    });
    res.json(updated);
  } catch (error) {
    console.error("Error updating link:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(5000, () => console.log("✅ Server running on port 5000"));
