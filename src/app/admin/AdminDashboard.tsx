"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Post {
  id: number;
  title: string;
  published: boolean;
  createdAt: string;
}

export default function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch("/api/posts")
      .then((response) => response.json())
      .then((data) => setPosts(data));
  }, []);

  const togglePublishStatus = async (id: number, currentStatus: boolean) => {
    const response = await fetch(`/api/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !currentStatus }),
    });

    if (response.ok) {
      setPosts(
        posts.map((post) =>
          post.id === id ? { ...post, published: !currentStatus } : post
        )
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    window.location.reload();
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Button onClick={handleLogout} variant="outline">
          Logout
        </Button>
      </div>
      <Link href="/admin/posts/create">
        <Button className="mb-4">Create New Post</Button>
      </Link>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell>{post.title}</TableCell>
              <TableCell>
                {new Date(post.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>{post.published ? "Published" : "Draft"}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  className="mr-2"
                  onClick={() => togglePublishStatus(post.id, post.published)}
                >
                  {post.published ? "Unpublish" : "Publish"}
                </Button>
                <Link href={`/admin/posts/edit/${post.id}`}>
                  <Button variant="outline">Edit</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
