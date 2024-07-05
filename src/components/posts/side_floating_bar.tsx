"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Heart, MessageCircle, ArrowUp } from "lucide-react";

interface FloatingSideBarProps {
  likes: number;
  commentCount: number;
  onCommentClick: () => void;
  onScrollToTop: () => void;
}

const FloatingSideBar: React.FC<FloatingSideBarProps> = ({
  likes: initialLikes,
  commentCount,
  onCommentClick,
  onScrollToTop,
}) => {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);

  const handleLikeClick = () => {
    if (isLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setIsLiked(!isLiked);
    // Here you would typically also send a request to your backend to update the like status
  };

  return (
    <div className="fixed flex flex-col items-center space-y-4 bg-transparent">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLikeClick}
        className={`flex flex-col items-center ${isLiked ? "text-red-500" : ""}`}
      >
        <Heart className="mb-1" />
        {likes}
      </Button>
      <Separator className="w-full" />
      <Button
        variant="ghost"
        size="sm"
        onClick={onCommentClick}
        className="flex flex-col items-center"
      >
        <MessageCircle className="mb-1" />
        {commentCount}
      </Button>
      <Separator className="w-full" />
      <Button
        variant="ghost"
        size="sm"
        onClick={onScrollToTop}
        className="flex flex-col items-center"
      >
        <ArrowUp className="mb-1" />
        Top
      </Button>
    </div>
  );
};

export default FloatingSideBar;
