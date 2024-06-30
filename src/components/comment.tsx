"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { AvatarFallback, AvatarImage, Avatar } from "./ui/avatar";

interface CommentCardProps {
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
  likes,
  dislikes,
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

  const handleEdit = () => {
    onEdit(id, editedContent);
    setIsEditing(false);
  };

  const handleReply = () => {
    onReply(id, replyContent);
    setIsReplying(false);
    setReplyContent("");
  };

  const fetchReplies = async () => {
    const res = await fetch(`/api/comments?parentId=${id}`);
    if (res.ok) {
      const data = await res.json();
      setReplies(data.comments);
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

  return (
    <div className="border p-4 mb-4 rounded-lg">
      <div className="flex items-center mb-2">
        {author.image && (
          <Avatar>
            <AvatarImage
              src={author.image}
              alt={author.name ? author.name : "UN"}
            />
            <AvatarFallback>
              {author.name ? author.name[0] : "UN"}
            </AvatarFallback>
          </Avatar>
        )}
        <span className="font-bold">{author.name}</span>
        <span className="text-gray-500 ml-2">
          {new Date(createdAt).toLocaleString()}
        </span>
      </div>
      {isEditing ? (
        <div>
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button
            onClick={handleEdit}
            className="bg-blue-500 text-white px-2 py-1 rounded mt-2"
          >
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="bg-gray-500 text-white px-2 py-1 rounded mt-2 ml-2"
          >
            Cancel
          </button>
        </div>
      ) : (
        <p>{content}</p>
      )}
      <div className="mt-2">
        <button onClick={() => onLike(id)} className="text-blue-500 mr-2">
          Like ({likes})
        </button>
        <button onClick={() => onDislike(id)} className="text-red-500 mr-2">
          Dislike ({dislikes})
        </button>
        {session?.user && (
          <>
            <button
              onClick={() => setIsReplying(!isReplying)}
              className="text-gray-500 mr-2"
            >
              Reply
            </button>
            {session.user.id === author.id && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-gray-500 mr-2"
                >
                  Edit
                </button>
                <button onClick={() => onDelete(id)} className="text-gray-500">
                  Delete
                </button>
              </>
            )}
          </>
        )}
      </div>
      {isReplying && (
        <div className="mt-2">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Write a reply..."
          />
          <button
            onClick={handleReply}
            className="bg-blue-500 text-white px-2 py-1 rounded mt-2"
          >
            Post Reply
          </button>
          <button
            onClick={() => setIsReplying(false)}
            className="bg-gray-500 text-white px-2 py-1 rounded mt-2 ml-2"
          >
            Cancel
          </button>
        </div>
      )}
      {_count.replies > 0 && (
        <button onClick={toggleReplies} className="text-blue-500 mt-2">
          {showReplies ? "Hide" : "Show"} {_count.replies} repl
          {_count.replies === 1 ? "y" : "ies"}
        </button>
      )}

      {showReplies &&
        replies.map((reply) => (
          <CommentCard
            key={reply.id}
            {...reply}
            onReply={onReply}
            onEdit={onEdit}
            onDelete={onDelete}
            onLike={onLike}
            onDislike={onDislike}
          />
        ))}
    </div>
  );
}
