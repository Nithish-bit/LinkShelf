import { useState, useRef } from "react";
import {
  TextInput,
  Textarea,
  Button,
  Title,
  Group,
  Paper,
  Tooltip,
} from "@mantine/core";
import { motion } from "framer-motion";
import {
  IconPlus,
  IconMicrophone,
  IconPlayerStop,
} from "@tabler/icons-react";
import "./AddLinkPage.css";

export default function AddLinkPage({ onAdd }) {
  const [form, setForm] = useState({
    title: "",
    url: "",
    tags: "",
    description: "",
    audioNote: null, // 🎙️ store audio note
  });
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  // 🎤 Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);

        const reader = new FileReader();
        reader.onloadend = () => {
          setForm((prev) => ({ ...prev, audioNote: reader.result }));
        };
        reader.readAsDataURL(blob);
      };

      recorder.start();
      setRecording(true);
    } catch (err) {
      alert("🎤 Please allow microphone access to record audio.");
      console.error("Microphone permission error:", err);
    }
  };

  // 🛑 Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  // ✅ Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onAdd) onAdd(form);

    // reset form after submission
    setForm({
      title: "",
      url: "",
      tags: "",
      description: "",
      audioNote: null,
    });
    setAudioBlob(null);
  };

  return (
    <motion.div
      className="addlink-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Paper shadow="lg" radius="lg" className="addlink-card" withBorder>
        <motion.div
          className="form-header"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Title order={2} ta="center" className="addlink-title">
            ✨ Add a New Link
          </Title>
        </motion.div>

        <form onSubmit={handleSubmit} className="addlink-form">
          <TextInput
            label="Title *"
            placeholder="Enter link title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />

          <TextInput
            label="URL *"
            placeholder="https://example.com"
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            required
          />

          <TextInput
            label="Tags"
            placeholder="Comma separated"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
          />

          <Textarea
            label="Description"
            placeholder="Optional description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          {/* 🎙 Audio Recorder */}
          <Group justify="center" mt="md">
            <Tooltip label={recording ? "Stop Recording" : "Record Audio Note"}>
              <Button
                className={`record-btn ${recording ? "recording" : ""}`}
                variant={recording ? "filled" : "light"}
                color={recording ? "red" : "teal"}
                onClick={recording ? stopRecording : startRecording}
                leftSection={
                  recording ? (
                    <IconPlayerStop size={16} />
                  ) : (
                    <IconMicrophone size={16} />
                  )
                }
              >
                {recording ? "Stop Recording" : "Record Audio"}
              </Button>
            </Tooltip>
          </Group>

          {/* 🎧 Audio Preview */}
          {audioBlob && (
            <motion.div
              className="audio-preview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <audio controls src={URL.createObjectURL(audioBlob)} />
            </motion.div>
          )}

          <Group justify="center" mt="md">
            <Button
              type="submit"
              color="indigo"
              size="sm"
              radius="md"
              leftSection={<IconPlus size={16} />}
              className="add-btn"
            >
              Add Link
            </Button>
          </Group>
        </form>
      </Paper>
    </motion.div>
  );
}
