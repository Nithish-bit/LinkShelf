import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(cors({ origin: "http://localhost:3000" })); // 👈 allows frontend access
app.use(express.json());

app.get("/api/links", async (req, res) => {
  const links = await prisma.link.findMany();
  res.json(links);
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

});

app.listen(5000, () => console.log("✅ Server running on port 5000"));
