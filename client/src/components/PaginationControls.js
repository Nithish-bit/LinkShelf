// File: PaginationControls.js
import { Group, Pagination, Text } from "@mantine/core";

function PaginationControls({ page, totalItems, itemsPerPage, onChange }) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const from = (page - 1) * itemsPerPage + 1;
  const to = Math.min(page * itemsPerPage, totalItems);

  return (
    <Group justify="space-between" mt="lg">
      <Text size="sm" c="dimmed">
        Showing {from}-{to} of {totalItems} links
      </Text>
      <Pagination
        total={totalPages}
        value={page}
        onChange={onChange}
        color="indigo"
        radius="md"
      />
    </Group>
  );
}

export default PaginationControls;
