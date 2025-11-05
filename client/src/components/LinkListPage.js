// File: LinkListPage.js
import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Title, Loader, Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import LinkCard from "./LinkCard";

const API = "http://localhost:5000/api/links";

export default function LinkListPage() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);

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

  return (
    <Container size="sm" py="xl" className="card-page">
      <Title order={2} align="center" mb="md">
        ðŸ“š My Saved Links
      </Title>

      {loading ? (
        <Loader color="indigo" size="lg" mt="xl" />
      ) : links.length === 0 ? (
        <Text ta="center" c="dimmed" mt="lg">
          No links saved yet.
        </Text>
      ) : (
        links.map((link) => (
          <LinkCard key={link.id} link={link} onEdit={() => {}} onDelete={() => {}} />
        ))
      )}
    </Container>
  );
}
