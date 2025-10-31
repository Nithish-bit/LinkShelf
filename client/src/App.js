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
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const API = "http://localhost:5000/api/links";

  const fetchLinks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API);
      setLinks(res.data);
    } catch {
      setError("Failed to load links.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({ title: "", url: "", tags: "", description: "" });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!form.title.trim() || !form.url.trim()) {
      setError("Title and URL are required!");
      return;
    }

    if (!validateUrl(form.url)) {
      setError("Please enter a valid URL (e.g. https://example.com)");
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        await axios.put(`${API}/${editingId}`, form);
        setMessage("✅ Link updated successfully!");
      } else {
        await axios.post(API, form);
        setMessage("✅ Link added successfully!");
      }
      fetchLinks();
      resetForm();
    } catch (err) {
      if (err.response?.data?.error?.includes("unique")) {
        setError("⚠️ This URL already exists.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (link) => {
    setForm({
      title: link.title,
      url: link.url,
      tags: link.tags || "",
      description: link.description || "",
    });
    setEditingId(link.id);
    setMessage("");
    setError("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this link?")) return;
    setLoading(true);
    try {
      await axios.delete(`${API}/${id}`);
      fetchLinks();
      setMessage("🗑️ Link deleted.");
    } catch {
      setError("Failed to delete link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📚 LinkShelf</h1>

      {message && <div style={{ ...styles.toast, ...styles.success }}>{message}</div>}
      {error && <div style={{ ...styles.toast, ...styles.error }}>{error}</div>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          name="url"
          placeholder="https://example.com"
          value={form.url}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          name="tags"
          placeholder="Tags (comma separated)"
          value={form.tags}
          onChange={handleChange}
          style={styles.input}
        />
        <textarea
          name="description"
          placeholder="Description (optional)"
          value={form.description}
          onChange={handleChange}
          style={styles.textarea}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            ...styles.button,
            background: editingId ? "#f59e0b" : "#2563eb",
          }}
        >
          {loading
            ? "⏳ Saving..."
            : editingId
            ? "💾 Update Link"
            : "➕ Add Link"}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={resetForm}
            style={{ ...styles.button, background: "#6b7280" }}
          >
            ❌ Cancel
          </button>
        )}
      </form>

      <div style={styles.listContainer}>
        {loading ? (
          <p>Loading...</p>
        ) : links.length === 0 ? (
          <p style={{ opacity: 0.7, fontStyle: "italic" }}>
            No links yet. Add your first one!
          </p>
        ) : (
          links.map((link) => (
            <div key={link.id} style={styles.card}>
              <div style={{ flex: 1 }}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.link}
                >
                  <h3>{link.title}</h3>
                </a>
                {link.description && (
                  <p style={styles.desc}>{link.description}</p>
                )}
                <small style={styles.tags}>{link.tags}</small>
              </div>
              <div>
                <button
                  onClick={() => handleEdit(link)}
                  style={{ ...styles.smallBtn, background: "#f59e0b" }}
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(link.id)}
                  style={{ ...styles.smallBtn, background: "#dc2626" }}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "2rem auto",
    fontFamily: "Inter, Arial",
    padding: "1rem",
  },
  title: {
    textAlign: "center",
    marginBottom: "1rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    marginBottom: "2rem",
  },
  input: {
    padding: "0.5rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  textarea: {
    padding: "0.5rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    minHeight: "60px",
  },
  button: {
    padding: "0.6rem",
    borderRadius: "8px",
    border: "none",
    color: "#fff",
    cursor: "pointer",
    transition: "0.2s",
  },
  listContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  card: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "1rem",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  },
  link: {
    color: "#2563eb",
    textDecoration: "none",
  },
  desc: {
    margin: "0.3rem 0",
  },
  tags: {
    color: "#6b7280",
  },
  smallBtn: {
    border: "none",
    color: "#fff",
    padding: "6px 8px",
    marginLeft: "5px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  toast: {
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "10px",
    textAlign: "center",
  },
  success: {
    background: "#d1fae5",
    color: "#065f46",
  },
  error: {
    background: "#fee2e2",
    color: "#991b1b",
  },
};

export default App;
