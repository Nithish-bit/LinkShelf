// File: LinkCard.js
import { Card, Text, Group, Badge, Button } from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";

export default function LinkCard({ link, onEdit, onDelete }) {
  return (
    <Card withBorder shadow="sm" radius="md" className="link-card">
      <Group justify="space-between" align="flex-start">
        <div>
          <a href={link.url} target="_blank" rel="noopener noreferrer" className="link-title">
            <Text fw={600} size="lg" c="indigo.7">
              {link.title}
            </Text>
          </a>
          {link.description && (
            <Text size="sm" mt={4} c="dimmed">
              {link.description}
            </Text>
          )}
          {link.tags && (
            <Group mt={6} gap={6}>
              {link.tags.split(",").map((tag, i) => (
                <Badge key={i} color="violet" variant="light">
                  {tag.trim()}
                </Badge>
              ))}
            </Group>
          )}
          {link.audioNote && (
            <audio controls src={link.audioNote} style={{ marginTop: 10, width: "100%" }} />
          )}
        </div>
        <Group gap={6}>
          <Button color="yellow" size="xs" variant="light" onClick={() => onEdit(link)}>
            <IconEdit size={14} />
          </Button>
          <Button color="red" size="xs" variant="light" onClick={() => onDelete(link.id)}>
            <IconTrash size={14} />
          </Button>
        </Group>
      </Group>
    </Card>
  );
}
