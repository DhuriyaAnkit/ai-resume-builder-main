// server.js
const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

// POST /api/generate-resume
app.post("/api/generate-resume", async (req, res) => {
  const { name, title, summary, education, experience, skills } = req.body;

  // Construct the prompt for Gemini
  const prompt = `
    Create a professional resume for the following individual:
    Name: ${name}
    Title: ${title}
    Summary: ${summary}
    Education: ${education}
    Experience: ${experience}
    Skills: ${skills}
  `;

  try {
    const response = await axios.post(
      GEMINI_API_URL,
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      },
      {
        headers: {
          "x-goog-api-key": GEMINI_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const resume = response.data?.candidates?.[0]?.parts?.[0]?.text || "Error generating resume";
    res.json({ resume });
  } catch (error) {
    console.error("Error generating resume:", error);
    res.status(500).json({ error: "Failed to generate resume" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
