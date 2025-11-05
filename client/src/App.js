import { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./App.css";
import {
  Container,
  TextInput,
  Button,
  Text,
  Group,
  Title,
  Card,
  Badge,
  Loader,
  Pagination,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import { useMantineColorScheme } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconEdit,
  IconTrash,
  IconSun,
  IconMoon,
  IconArrowUp,
} from "@tabler/icons-react";

import TagFilter from "./components/TagFilter";
import AddLinkPage from "./components/AddLinkPage";

const API = "http://localhost:5000/api/links";

export default function App() {
  const [links, setLinks] = useState([]);
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 4;
  const formRef = useRef(null);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  // 🧩 Fetch all links
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

  // ✅ Add link
  const handleAdd = async (formData) => {
    setLoading(true);
    try {
      await axios.post(API, formData);
      showNotification({
        color: "green",
        message: "✅ Link added successfully!",
      });
      fetchLinks();
    } catch {
      showNotification({ color: "red", message: "Failed to add link" });
    } finally {
      setLoading(false);
    }
  };

  // ✏️ Edit link
  const handleEdit = (link) => console.log("Edit:", link);

  // 🗑️ Delete link
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

  // 🔍 Filter + Pagination
  const filtered = links.filter((l) => {
    const s = search.toLowerCase();
    const matchSearch =
      l.title.toLowerCase().includes(s) ||
      l.tags?.toLowerCase().includes(s);
    const matchTag = tagFilter
      ? l.tags?.toLowerCase().includes(tagFilter.toLowerCase())
      : true;
    return matchSearch && matchTag;
  });

  const paginated = filtered.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  const allTags = Array.from(
    new Set(
      links.flatMap((l) =>
        l.tags ? l.tags.split(",").map((t) => t.trim()) : []
      )
    )
  );
  const scrollToForm = () =>
    formRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <Container size="md" py="xl">
      {/* Header */}
      <Group justify="space-between" mb="md">
        <Title order={2}>🔗 LinkShelf</Title>
        <Tooltip
          label={`Switch to ${
            colorScheme === "light" ? "dark" : "light"
          } mode`}
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

      {/* Add Link Page */}
      <div ref={formRef}>
        <AddLinkPage onAdd={handleAdd} />
      </div>

      {/* Search + Tags */}
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

      {/* Link List */}
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
                        <Text size="sm" mt={6} c="dimmed">
                          {link.description}
                        </Text>
                      )}

                      {link.tags && (
                        <Group mt={8} gap={6}>
                          {link.tags.split(",").map((tag, i) => (
                            <Badge key={i} color="violet" variant="light">
                              {tag.trim()}
                            </Badge>
                          ))}
                        </Group>
                      )}

                      {/* 🎧 Audio player */}
                      {link.audioNote && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          style={{ marginTop: "10px" }}
                        >
                          <audio
                            controls
                            src={link.audioNote}
                            style={{
                              width: "100%",
                              borderRadius: "8px",
                              outline: "none",
                            }}
                          />
                        </motion.div>
                      )}
                    </div>

                    <Group>
                      <Button
                        color="yellow"
                        size="xs"
                        variant="light"
                        onClick={() => handleEdit(link)}
                      >
                        <IconEdit size={14} />
                      </Button>
                      <Button
                        color="red"
                        size="xs"
                        variant="light"
                        onClick={() => handleDelete(link.id)}
                      >
                        <IconTrash size={14} />
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
