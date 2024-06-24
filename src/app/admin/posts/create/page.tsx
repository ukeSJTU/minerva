"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function CreatePost() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const auth = localStorage.getItem("adminAuth");
    if (auth !== "true") {
      router.push("/admin");
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, published: false }),
    });

    if (response.ok) {
      router.push("/admin");
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Create New Post</h1>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post Title"
          className="mb-4"
        />
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Post Content (Markdown supported)"
          className="mb-4"
          rows={10}
        />
        <Button type="submit">Create Post</Button>
      </form>
    </div>
  );
}
