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
  const [editingId, setEditingId] = useState(null);

  const fetchLinks = async () => {
    const res = await axios.get("http://localhost:5000/api/links");
    setLinks(res.data);
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.url) {
      alert("Title and URL are required!");
      return;
    }

    if (editingId) {
      // update
      await axios.put(`http://localhost:5000/api/links/${editingId}`, form);
      setEditingId(null);
    } else {
      // create
      await axios.post("http://localhost:5000/api/links", form);
    }

    setForm({ title: "", url: "", tags: "", description: "" });
    fetchLinks();
  };

  const handleEdit = (link) => {
    setForm({
      title: link.title,
      url: link.url,
      tags: link.tags || "",
      description: link.description || "",
    });
    setEditingId(link.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this link?")) {
      await axios.delete(`http://localhost:5000/api/links/${id}`);
      fetchLinks();
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>📚 LinkShelf</h1>

      {/* Add / Edit Form */}
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
          placeholder="Tags"
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
          {editingId ? "💾 Save Changes" : "➕ Add Link"}
        </button>
      </form>

      {/* List of links */}
      {links.length === 0 ? (
        <p>No links yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {links.map((link) => (
            <li
              key={link.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "10px",
                marginBottom: "10px",
              }}
            >
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                <h3>{link.title}</h3>
              </a>
              <p>{link.description}</p>
              <small>{link.tags}</small>
              <div style={{ marginTop: "0.5rem" }}>
                <button onClick={() => handleEdit(link)}>✏️ Edit</button>
                <button
                  onClick={() => handleDelete(link.id)}
                  style={{ marginLeft: "0.5rem" }}
                >
                  🗑️ Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
