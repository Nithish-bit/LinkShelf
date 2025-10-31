import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [links, setLinks] = useState([]);
  const [form, setForm] = useState({
    title: "",
    url: "",
    tags: "",
    description: "",
  });

  // Fetch all links
  const fetchLinks = async () => {
    const res = await axios.get("http://localhost:5000/api/links");
    setLinks(res.data);
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.url) {
      alert("Title and URL are required!");
      return;
    }

    await axios.post("http://localhost:5000/api/links", form);
    setForm({ title: "", url: "", tags: "", description: "" });
    fetchLinks(); // refresh list
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>📚 LinkShelf</h1>

      {/* Add Link Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          marginBottom: "2rem",
          maxWidth: "400px",
        }}
      >
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
        />
        <input
          name="url"
          placeholder="URL"
          value={form.url}
          onChange={handleChange}
        />
        <input
          name="tags"
          placeholder="Tags (comma separated)"
          value={form.tags}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
        <button type="submit" style={{ padding: "0.5rem", cursor: "pointer" }}>
          ➕ Add Link
        </button>
      </form>

      {/* Display links */}
      {links.length === 0 ? (
        <p>No links found.</p>
      ) : (
        <ul>
          {links.map((link) => (
            <li key={link.id}>
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                {link.title}
              </a>
              <p>{link.description}</p>
              <small>{link.tags}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
