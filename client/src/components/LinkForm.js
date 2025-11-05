// File: LinkForm.js
import React, { useState, useRef } from "react";
import {
  TextInput,
  Textarea,
  Button,
  Grid,
  Group,
  Tooltip,
} from "@mantine/core";
import { IconPlus, IconMicrophone, IconPlayerStop } from "@tabler/icons-react";
import { motion } from "framer-motion";
import "./LinkForm.css";

export default function LinkForm({ form, setForm, onSubmit, loading, editingId, cancelEdit }) {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // ðŸŽ™ Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioBlob(audioBlob);

        // Convert to base64 to save inside description (demo only)
        const reader = new FileReader();
        reader.onloadend = () => {
          setForm((f) => ({ ...f, audioNote: reader.result }));
        };
        reader.readAsDataURL(audioBlob);
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      console.error("Recording error:", err);
      alert("Microphone access denied or not supported.");
    }
  };

  // ðŸ›‘ Stop recording
  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="form-wrapper"
    >
      <form onSubmit={onSubmit} className="link-form">
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <TextInput
              label="Title"
              placeholder="Enter title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
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
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </Grid.Col>
        </Grid>

        {/* ðŸŽ™ Audio Recorder */}
        <Group justify="center" mt="md">
          <Tooltip label={recording ? "Stop Recording" : "Record Audio Note"}>
            <Button
              variant={recording ? "filled" : "light"}
              color={recording ? "red" : "teal"}
              onClick={recording ? stopRecording : startRecording}
              leftSection={
                recording ? <IconPlayerStop size={18} /> : <IconMicrophone size={18} />
              }
            >
              {recording ? "Stop" : "Record Audio"}
            </Button>
          </Tooltip>

          {audioBlob && (
            <audio
              controls
              src={URL.createObjectURL(audioBlob)}
              style={{ marginTop: 10, width: "100%" }}
            />
          )}
        </Group>

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
            <Button color="gray" variant="light" onClick={cancelEdit}>
              Cancel
            </Button>
          )}
        </Group>
      </form>
    </motion.div>
  );
}
