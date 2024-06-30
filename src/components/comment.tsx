"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Comment, User } from "@prisma/client";
import { AvatarFallback, AvatarImage, Avatar } from "./ui/avatar";

type CommentCardProps = Comment & {
  onReply: (parentId: string, content: string) => void;
  onEdit: (id: string, content: string) => void;
  onDelete: (id: string) => void;
  onLike: (id: string) => void;
  onDislike: (id: string) => void;
} & { author: User; replies: CommentCardProps[] };

export function CommentCard({
  id,
  content,
  createdAt,
  updatedAt,
  postId,
  authorId,
  parentId,
  likes,
  dislikes,
  author,
  replies,
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

  const handleEdit = () => {
    onEdit(id, editedContent);
    setIsEditing(false);
  };

  const handleReply = () => {
    onReply(id, replyContent);
    setIsReplying(false);
    setReplyContent("");
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
      {replies && replies.length > 0 && (
        <div className="ml-8 mt-4">
          {replies.map((reply: CommentCardProps) => (
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
      )}
    </div>
  );
}
