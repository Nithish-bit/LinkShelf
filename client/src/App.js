import { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./App.css";
import TagFilter from "./components/TagFilter";
import {
  Container,
  TextInput,
  Button,
  Textarea,
  Group,
  Title,
  Card,
  Text,
  Badge,
  Grid,
  Loader,
  Pagination,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import { useMantineColorScheme } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconSun,
  IconMoon,
  IconArrowUp,
} from "@tabler/icons-react";

const API = "http://localhost:5000/api/links";

export default function App() {
  const [links, setLinks] = useState([]);
  const [form, setForm] = useState({
    title: "",
    url: "",
    tags: "",
    description: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 4;
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const formRef = useRef(null);

  // Fetch all links
  const fetchLinks = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(API);
      setLinks(data);
    } catch {
      showNotification({ color: "red", message: "Failed to fetch links" });
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

  // Submit handler (Add / Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.url.trim()) {
      showNotification({
        color: "red",
        message: "Title and URL are required!",
      });
      return;
    }
    if (!validateUrl(form.url)) {
      showNotification({ color: "red", message: "Invalid URL format" });
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        await axios.put(`${API}/${editingId}`, form);
        showNotification({
          color: "blue",
          message: "✅ Link updated successfully!",
        });
      } else {
        await axios.post(API, form);
        showNotification({
          color: "green",
          message: "✅ Link added successfully!",
        });
      }
      fetchLinks();
      setForm({ title: "", url: "", tags: "", description: "" });
      setEditingId(null);
    } catch {
      showNotification({ color: "red", message: "Failed to save link" });
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
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this link?")) return;
    setLoading(true);
    try {
      await axios.delete(`${API}/${id}`);
      showNotification({ color: "red", message: "🗑️ Link deleted." });
      fetchLinks();
    } catch {
      showNotification({ color: "red", message: "Failed to delete link" });
    } finally {
      setLoading(false);
    }
  };

  // Search + Tag Filter
  const filtered = links.filter((l) => {
    const matchSearch =
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.tags?.toLowerCase().includes(search.toLowerCase());
    const matchTag = tagFilter
      ? l.tags?.toLowerCase().includes(tagFilter.toLowerCase())
      : true;
    return matchSearch && matchTag;
  });

  const paginated = filtered.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // Unique tags
  const allTags = Array.from(
    new Set(
      links.flatMap((l) =>
        l.tags ? l.tags.split(",").map((t) => t.trim()) : []
      )
    )
  );

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Container size="md" py="xl">
      {/* Header */}
      <Group justify="space-between" mb="md">
        <Title order={2}>🔗 LinkShelf</Title>
        <Tooltip
          label={`Switch to ${colorScheme === "light" ? "dark" : "light"} mode`}
        >
          <ActionIcon
            variant="light"
            color="indigo"
            onClick={toggleColorScheme}
          >
            {colorScheme === "light" ? (
              <IconMoon size={18} />
            ) : (
              <IconSun size={18} />
            )}
          </ActionIcon>
        </Tooltip>
      </Group>

      {/* Form */}
      <div ref={formRef} className="form-wrapper">
        <form onSubmit={handleSubmit} className="link-form">
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput
                label="Title"
                placeholder="Enter title"
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
                required
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput
                label="URL"
                placeholder="https://example.com"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                required
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput
                label="Tags"
                placeholder="Comma separated"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12 }}>
              <Textarea
                label="Description"
                placeholder="Optional description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </Grid.Col>
          </Grid>

          <Group justify="center" mt="md">
            <Button
              type="submit"
              color={editingId ? "yellow" : "indigo"}
              loading={loading}
              leftSection={<IconPlus size={18} />}
            >
              {editingId ? "Update Link" : "Add Link"}
            </Button>
            {editingId && (
              <Button
                color="gray"
                variant="light"
                onClick={() => setEditingId(null)}
              >
                Cancel
              </Button>
            )}
          </Group>
        </form>
      </div>

      {/* Search & Tags */}
<div className="search-bar">
  <TextInput
    placeholder="🔍 Search by title or tag..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    radius="md"
    size="md"
  />
</div>

<TagFilter
  allTags={allTags}
  tagFilter={tagFilter}
  setTagFilter={setTagFilter}
/>

      {/* Link Cards */}
      <div style={{ marginTop: "2rem" }}>
        {loading ? (
          <Loader color="indigo" size="lg" />
        ) : filtered.length === 0 ? (
          <Text ta="center" c="dimmed" mt="lg">
            No links found.
          </Text>
        ) : (
          <AnimatePresence>
            {paginated.map((link) => (
              <motion.div
                key={link.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <Card withBorder shadow="sm" mb="sm" radius="md">
                  <Group justify="space-between" align="flex-start">
                    <div>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: "none" }}
                      >
                        <Text fw={600} size="lg" c="indigo.7">
                          {link.title}
                        </Text>
                      </a>
                      {link.description && (
                        <Text size="sm" mt={4}>
                          {link.description}
                        </Text>
                      )}
                      {link.tags && (
                        <Group mt={6} gap={6}>
                          {link.tags.split(",").map((tag, i) => (
                            <Badge
                              color="violet"
                              key={i}
                              variant="light"
                              style={{ cursor: "pointer" }}
                            >
                              {tag.trim()}
                            </Badge>
                          ))}
                        </Group>
                      )}
                    </div>

                    <Group>
                      <Button
                        color="yellow"
                        size="xs"
                        variant="light"
                        onClick={() => handleEdit(link)}
                        leftSection={<IconEdit size={14} />}
                      >
                        Edit
                      </Button>
                      <Button
                        color="red"
                        size="xs"
                        variant="light"
                        onClick={() => handleDelete(link.id)}
                        leftSection={<IconTrash size={14} />}
                      >
                        Delete
                      </Button>
                    </Group>
                  </Group>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Pagination */}
      {filtered.length > itemsPerPage && (
        <Pagination
          mt="lg"
          value={page}
          onChange={setPage}
          total={Math.ceil(filtered.length / itemsPerPage)}
          color="indigo"
        />
      )}

      {/* Floating Scroll Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120 }}
        style={{
          position: "fixed",
          bottom: "25px",
          right: "25px",
          zIndex: 1000,
        }}
      >
        <Tooltip label="Scroll to top / Add new link">
          <ActionIcon
            size="xl"
            radius="xl"
            color="indigo"
            onClick={scrollToForm}
            style={{
              boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            }}
          >
            <IconArrowUp size={22} />
          </ActionIcon>
        </Tooltip>
      </motion.div>
    </Container>
  );
}
