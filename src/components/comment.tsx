"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { AvatarFallback, AvatarImage, Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

// TODO: This interface is duplicated in src/components/comment_section.tsx
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

interface CommentCardProps {
  id: string;
  content: string;
  createdAt: string;
  author: {
    name: string | null;
    image: string | null;
    id: string;
  };
  initialLikes: number;
  initialDislikes: number;
  likes: number;
  dislikes: number;
  _count: { replies: number };
  onReply: (parentId: string, content: string) => Promise<void>;
  onEdit: (id: string, content: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onLike: (id: string) => Promise<void>;
  onDislike: (id: string) => Promise<void>;
}

export function CommentCard({
  id,
  content,
  createdAt,
  author,
  initialLikes,
  initialDislikes,
  likes: propLikes,
  dislikes: propDislikes,
  _count,
  onReply,
  onEdit,
  onDelete,
  onLike,
  onDislike,
}: CommentCardProps) {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState<CommentCardProps[]>([]);
  const [likes, setLikes] = useState(propLikes ?? initialLikes);
  const [dislikes, setDislikes] = useState(propDislikes ?? initialDislikes);

  const handleEdit = async () => {
    await onEdit(id, editedContent);
    setIsEditing(false);
  };

  const handleReply = async () => {
    await onReply(id, replyContent);
    setIsReplying(false);
    setReplyContent("");
    await fetchReplies();
  };

  const fetchReplies = async () => {
    const res = await fetch(`/api/comments?parentId=${id}`);
    if (res.ok) {
      const data = await res.json();
      setReplies(
        data.comments.map((comment: CommentData) => ({
          ...comment,
          initialLikes: comment.likes,
          initialDislikes: comment.dislikes,
        }))
      );
    } else {
      console.error("Failed to fetch replies:", await res.text());
    }
  };

  const toggleReplies = () => {
    if (!showReplies && _count.replies > 0) {
      fetchReplies();
    }
    setShowReplies(!showReplies);
  };

  const handleLike = async () => {
    setLikes((prevLikes) => prevLikes + 1);
    try {
      await onLike(id);
    } catch (error) {
      // If the server request fails, revert the optimistic update
      setLikes((prevLikes) => prevLikes - 1);
      console.error("Failed to like comment:", error);
    }
  };

  const handleDislike = async () => {
    setDislikes((prevDislikes) => prevDislikes + 1);
    try {
      await onDislike(id);
    } catch (error) {
      // If the server request fails, revert the optimistic update
      setDislikes((prevDislikes) => prevDislikes - 1);
      console.error("Failed to dislike comment:", error);
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center space-x-4 pb-2">
        <Avatar>
          <AvatarImage
            src={author.image || undefined}
            alt={author.name || "User"}
          />
          <AvatarFallback>{author.name?.[0] || "U"}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{author.name}</p>
          <p className="text-sm text-muted-foreground">
            {new Date(createdAt).toLocaleDateString()}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div>
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="mb-2"
            />
            <Button onClick={handleEdit} className="mr-2">
              Save
            </Button>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <p>{content}</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" onClick={handleLike}>
            <ThumbsUp className="mr-1 h-4 w-4" /> {likes}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDislike}>
            <ThumbsDown className="mr-1 h-4 w-4" /> {dislikes}
          </Button>
        </div>
        {session?.user && (
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsReplying(!isReplying)}
            >
              <MessageSquare className="mr-1 h-4 w-4" /> Reply
            </Button>
            {session.user.id === author.id && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="mr-1 h-4 w-4" /> Edit
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDelete(id)}>
                  <Trash2 className="mr-1 h-4 w-4" /> Delete
                </Button>
              </>
            )}
          </div>
        )}
      </CardFooter>
      {isReplying && (
        <div className="px-4 pb-4">
          <Textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write a reply..."
            className="mb-2"
          />
          <Button onClick={handleReply} className="mr-2">
            Post Reply
          </Button>
          <Button variant="outline" onClick={() => setIsReplying(false)}>
            Cancel
          </Button>
        </div>
      )}
      {_count.replies > 0 && (
        <div className="px-4 pb-4">
          <Button variant="link" onClick={toggleReplies}>
            {showReplies ? (
              <ChevronUp className="mr-1 h-4 w-4" />
            ) : (
              <ChevronDown className="mr-1 h-4 w-4" />
            )}
            {showReplies ? "Hide" : "Show"} {_count.replies} repl
            {_count.replies === 1 ? "y" : "ies"}
          </Button>
        </div>
      )}
      {showReplies && (
        <div className="pl-8">
          <Separator className="my-4" />
          {replies.map((reply) => (
            <CommentCard
              key={reply.id}
              {...reply}
              initialLikes={reply.likes}
              initialDislikes={reply.dislikes}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              onLike={onLike}
              onDislike={onDislike}
            />
          ))}
        </div>
      )}
    </Card>
  );
}
