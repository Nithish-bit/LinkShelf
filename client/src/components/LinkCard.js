import { Card, Text, Group, Badge, Button } from "@mantine/core";
import { motion } from "framer-motion";
import { IconEdit, IconTrash } from "@tabler/icons-react";

function LinkCard({ link, onEdit, onDelete }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
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
              <Text size="sm" mt={5} c="dimmed">
                {link.description}
              </Text>
            )}

            {link.tags && (
              <Group mt={8} gap="xs">
                {link.tags
                  .split(",")
                  .map((tag, i) => (
                    <Badge key={i} color="violet" variant="light">
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
              onClick={() => onEdit(link)}
              leftSection={<IconEdit size={14} />}
            >
              Edit
            </Button>
            <Button
              color="red"
              size="xs"
              variant="light"
              onClick={() => onDelete(link.id)}
              leftSection={<IconTrash size={14} />}
            >
              Delete
            </Button>
          </Group>
        </Group>
      </Card>
    </motion.div>
  );
}

export default LinkCard;
