// src/App.js
import React, { useState } from "react";
import "./App.css"; // Import the CSS file

function App() {
  const [form, setForm] = useState({
    name: "",
    title: "",
    summary: "",
    education: "",
    experience: "",
    skills: "",
  });
  const [loading, setLoading] = useState(false);
  const [resume, setResume] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResume("");

    try {
      const res = await fetch("http://localhost:5000/api/generate-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setResume(data.resume || "Error generating resume");
    } catch (err) {
      setResume("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="card">
        <h1 className="title">🤖 AI Resume Builder</h1>

        <form onSubmit={handleSubmit} className="form-grid">
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            name="title"
            placeholder="Job Title"
            value={form.title}
            onChange={handleChange}
            required
          />
          <textarea
            name="summary"
            placeholder="Professional Summary"
            value={form.summary}
            onChange={handleChange}
            rows="2"
          />
          <textarea
            name="education"
            placeholder="Education"
            value={form.education}
            onChange={handleChange}
            rows="2"
          />
          <textarea
            name="experience"
            placeholder="Experience"
            value={form.experience}
            onChange={handleChange}
            rows="3"
          />
          <input
            name="skills"
            placeholder="Skills (comma separated)"
            value={form.skills}
            onChange={handleChange}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Generating..." : "Generate Resume"}
          </button>
        </form>

        <div className="resume-section">
          <h2>Generated Resume</h2>
          {resume ? (
            <pre className="resume">{resume}</pre>
          ) : (
            <p className="placeholder">Your generated resume will appear here.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
