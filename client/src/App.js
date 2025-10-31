import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [links, setLinks] = useState([]);
  const [form, setForm] = useState({ title: "", url: "", tags: "", description: "" });
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

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => {
    setForm({ title: "", url: "", tags: "", description: "" });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!form.title.trim() || !form.url.trim()) return setError("Title and URL are required!");
    if (!validateUrl(form.url)) return setError("Please enter a valid URL (e.g. https://example.com)");

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
      if (err.response?.data?.error?.includes("unique")) setError("⚠️ This URL already exists.");
      else setError("Something went wrong. Please try again.");
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
    <div className="app-container">
      <h1 className="title">🔗 LinkShelf</h1>

      {message && <div className="toast success">{message}</div>}
      {error && <div className="toast error">{error}</div>}

      <form onSubmit={handleSubmit} className="link-form">
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} />
        <input name="url" placeholder="https://example.com" value={form.url} onChange={handleChange} />
        <input name="tags" placeholder="Tags (comma separated)" value={form.tags} onChange={handleChange} />
        <textarea
          name="description"
          placeholder="Description (optional)"
          value={form.description}
          onChange={handleChange}
        />

        <div className="form-actions">
          <button
            type="submit"
            disabled={loading}
            className={editingId ? "btn edit" : "btn add"}
          >
            {loading ? "⏳ Saving..." : editingId ? "💾 Update Link" : "➕ Add Link"}
          </button>

          {editingId && (
            <button type="button" onClick={resetForm} className="btn cancel">
              ❌ Cancel
            </button>
          )}
        </div>
      </form>

      <div className="links-list">
        {loading ? (
          <p>Loading...</p>
        ) : links.length === 0 ? (
          <p className="empty">No links yet. Add your first one!</p>
        ) : (
          links.map((link) => (
            <div key={link.id} className="card">
              <div className="card-content">
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="link-title">
                  {link.title}
                </a>
                {link.description && <p className="desc">{link.description}</p>}
                {link.tags && <small className="tags">{link.tags}</small>}
              </div>
              <div className="card-actions">
                <button onClick={() => handleEdit(link)} className="small-btn edit-btn">✏️</button>
                <button onClick={() => handleDelete(link.id)} className="small-btn del-btn">🗑️</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
