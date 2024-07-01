"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { CommentCard } from "@/components/comment";
import InfiniteScroll from "react-infinite-scroll-component";
import { MarkdownEditor } from "@/components/markdown_editor";

interface CommentData {
  id: string;
  content: string;
  createdAt: string;
  author: {
    name: string | null;
    image: string | null;
    id: string;
  };
  likes: number;
  dislikes: number;
  _count: { replies: number };
  replies?: CommentData[];
}

export function CommentSection({ postId }: { postId: number }) {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const { data: session } = useSession();

  const loadMoreComments = useCallback(() => {
    setCursor((prevCursor) => prevCursor || ""); // This will trigger the useEffect
  }, []);

  const refreshComments = useCallback(() => {
    setComments([]);
    setCursor(null);
    setHasMore(true);
  }, []);

  useEffect(() => {
    const fetchComments = async () => {
      const res = await fetch(
        `/api/comments?postId=${postId}${cursor ? `&cursor=${cursor}` : ""}`
      );
      if (res.ok) {
        const data = await res.json();
        setComments((prev) => [...prev, ...data.comments]);
        if (data.nextCursor) {
          setCursor(data.nextCursor);
        } else {
          setHasMore(false);
        }
        console.log(data.nextCursor);
      }
    };

    if (cursor === null) {
      fetchComments();
    }
  }, [postId, cursor]);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newComment, postId }),
    });

    if (res.ok) {
      setNewComment("");
      // Refresh comments after posting
      refreshComments();
    }
  };

  const handleReply = async (parentId: string, content: string) => {
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, postId, parentId }),
    });

    if (res.ok) {
      // Refresh comments after replying
      refreshComments();
    }
  };

  const handleEdit = async (id: string, content: string) => {
    const res = await fetch("/api/comments", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, content }),
    });

    if (res.ok) {
      refreshComments();
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/comments?id=${id}`, { method: "DELETE" });

    if (res.ok) {
      refreshComments();
    }
  };

  const handleLike = async (id: string) => {
    const res = await fetch(`/api/comments?id=${id}&action=like`, {
      method: "PATCH",
    });

    if (res.ok) {
      const updatedComment = await res.json();
      setComments((prevComments) =>
        updateCommentRecursively(prevComments, id, (comment) => ({
          ...comment,
          likes: updatedComment.likes,
        }))
      );
    } else {
      console.error("Failed to like comment");
    }
  };

  const handleDislike = async (id: string) => {
    const res = await fetch(`/api/comments?id=${id}&action=dislike`, {
      method: "PATCH",
    });

    if (res.ok) {
      const updatedComment = await res.json();
      setComments((prevComments) =>
        updateCommentRecursively(prevComments, id, (comment) => ({
          ...comment,
          dislikes: updatedComment.dislikes,
        }))
      );
    } else {
      console.error("Failed to dislike comment");
    }
  };

  const updateCommentRecursively = (
    comments: CommentData[],
    id: string,
    updateFn: (comment: CommentData) => CommentData
  ): CommentData[] => {
    return comments.map((comment) => {
      if (comment.id === id) {
        return updateFn(comment);
      }
      if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: updateCommentRecursively(comment.replies, id, updateFn),
        };
      }
      return comment;
    });
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>
      {session ? (
        <div className="mb-4">
          <MarkdownEditor
            value={newComment}
            onChange={setNewComment}
            onSubmit={handleSubmitComment}
          />
        </div>
      ) : (
        <p>Please sign in to comment.</p>
      )}
      <InfiniteScroll
        dataLength={comments.length}
        next={loadMoreComments}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>You&apos;ve seen all comments!</b>
          </p>
        }
      >
        {comments.map((comment) => (
          <CommentCard
            key={comment.id}
            {...comment}
            initialLikes={comment.likes}
            initialDislikes={comment.dislikes}
            likes={comment.likes}
            dislikes={comment.dislikes}
            onReply={handleReply}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onLike={handleLike}
            onDislike={handleDislike}
          />
        ))}
      </InfiniteScroll>
    </div>
  );
}
