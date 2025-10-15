// api/generate-resume.js
import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, title, summary, education, experience, skills } = req.body;
  const prompt = `
Create a professional resume for:
Name: ${name}
Title: ${title}
Summary: ${summary}
Education: ${education}
Experience: ${experience}
Skills: ${skills}
`;

  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        headers: {
          "x-goog-api-key": process.env.GEMINI_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const resume =
      response.data?.candidates?.[0]?.parts?.[0]?.text ||
      "Error generating resume";
    res.status(200).json({ resume });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate resume" });
  }
}
