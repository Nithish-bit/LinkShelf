// File: TagFilter.js
import { Badge, Group, ScrollArea } from "@mantine/core";
import "./TagFilter.css";

export default function TagFilter({ allTags, tagFilter, setTagFilter }) {
  if (!allTags || allTags.length === 0) return null;

  return (
    <div className="tagfilter-container">
      <ScrollArea type="auto" className="tagfilter-scroll">
        <Group gap="xs" wrap="wrap" justify="flex-start" className="tagfilter-group">
          {allTags.map((tag) => (
            <Badge
              key={tag}
              onClick={() => setTagFilter(tagFilter === tag ? null : tag)}
              color={tagFilter === tag ? "indigo" : "violet"}
              variant={tagFilter === tag ? "filled" : "light"}
              className={`tagfilter-badge ${tagFilter === tag ? "active" : ""}`}
            >
              #{tag}
            </Badge>
          ))}
        </Group>
      </ScrollArea>
    </div>
  );
}
