"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { CommentCard } from "@/components/comment";
import { Comment, User } from "@prisma/client";

type CommentCardProps = Comment & {
  onReply: (parentId: string, content: string) => void;
  onEdit: (id: string, content: string) => void;
  onDelete: (id: string) => void;
  onLike: (id: string) => void;
  onDislike: (id: string) => void;
} & { author: User; replies: CommentCardProps[] };

export function CommentSection({ postId }: { postId: number }) {
  const [comments, setComments] = useState<CommentCardProps[]>([]);
  const [newComment, setNewComment] = useState("");
  const { data: session } = useSession();

  const fetchComments = useCallback(async () => {
    console.log("Start to fetch comments data.");
    const res = await fetch(`/api/comments?postId=${postId}`);

    if (res.ok) {
      const data = await res.json();
      console.log(data);
      setComments(data);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newComment, postId }),
    });

    if (res.ok) {
      setNewComment("");
      fetchComments();
    }
  };

  const handleReply = async (parentId: string, content: string) => {
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, postId, parentId }),
    });

    if (res.ok) {
      fetchComments();
    }
  };

  const handleEdit = async (id: string, content: string) => {
    const res = await fetch("/api/comments", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, content }),
    });

    if (res.ok) {
      fetchComments();
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/comments?id=${id}`, { method: "DELETE" });

    if (res.ok) {
      fetchComments();
    }
  };

  const handleLike = async (id: string) => {
    // Implement like functionality
  };

  const handleDislike = async (id: string) => {
    // Implement dislike functionality
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>
      {session ? (
        <div className="mb-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Write a comment..."
          />
          <button
            onClick={handleSubmitComment}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Post Comment
          </button>
        </div>
      ) : (
        <p>Please sign in to comment.</p>
      )}
      {comments.map((comment) => (
        <CommentCard
          key={comment.id}
          {...comment}
          onReply={handleReply}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onLike={handleLike}
          onDislike={handleDislike}
        />
      ))}
    </div>
  );
}
