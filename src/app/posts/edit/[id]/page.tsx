"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import {
  Container,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";

const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  categoryId: z.number(),
});

type PostFormData = z.infer<typeof postSchema>;

export default function EditPost({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [formData, setFormData] = useState<PostFormData>({
    title: "",
    content: "",
    categoryId: 1,
  });
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [errors, setErrors] = useState<Partial<PostFormData>>({});

  useEffect(() => {
    // Fetch categories
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));

    // Fetch post data if editing
    if (params.id !== "new") {
      fetch(`/api/posts/${params.id}`)
        .then((res) => res.json())
        .then((data) => setFormData(data));
    }
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      postSchema.parse(formData);
      const url =
        params.id === "new" ? "/api/posts" : `/api/posts/${params.id}`;
      const method = params.id === "new" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/");
      } else {
        console.error("Failed to save post");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(error.formErrors.fieldErrors);
      }
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {params.id === "new" ? "Create New Post" : "Edit Post"}
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="title"
          label="Title"
          name="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          error={!!errors.title}
          helperText={errors.title}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          multiline
          rows={10}
          id="content"
          label="Content"
          name="content"
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
          error={!!errors.content}
          helperText={errors.content}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            id="category"
            value={formData.categoryId}
            label="Category"
            onChange={(e) =>
              setFormData({ ...formData, categoryId: e.target.value as number })
            }
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Save Post
        </Button>
      </Box>
    </Container>
  );
}
