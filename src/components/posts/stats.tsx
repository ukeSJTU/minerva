import React from "react";
import {
  CalendarIcon,
  EyeIcon,
  HeartIcon,
  MessageSquareIcon,
  PenIcon,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface PostStat {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}

interface PostStatsProps {
  post: {
    createdAt: string | Date;
    updatedAt: string | Date;
    views: number;
    likes: number;
    comments?: { id: string }[];
  };
  showStats: ("createdAt" | "updatedAt" | "views" | "likes" | "comments")[];
}

const PostStats: React.FC<PostStatsProps> = ({ post, showStats }) => {
  const statsMap: Record<string, PostStat> = {
    createdAt: {
      icon: <CalendarIcon className="w-4 h-4" />,
      value: new Date(post.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      label: "Created",
    },
    updatedAt: {
      icon: <PenIcon className="w-4 h-4" />,
      value: new Date(post.updatedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      label: "Updated",
    },
    views: {
      icon: <EyeIcon className="w-4 h-4" />,
      value: post.views,
      label: "views",
    },
    likes: {
      icon: <HeartIcon className="w-4 h-4" />,
      value: post.likes,
      label: "likes",
    },
    comments: {
      icon: <MessageSquareIcon className="w-4 h-4" />,
      value: post.comments?.length || 0,
      label: "comments",
    },
  };

  const displayedStats = showStats.filter((stat) => statsMap[stat]);

  return (
    <div className="flex items-center gap-4 text-sm text-muted-foreground my-2">
      {displayedStats.map((stat, index) => (
        <React.Fragment key={stat}>
          {index > 0 && (
            <Separator orientation="vertical" className="mx-2 h-4" />
          )}
          <span className="flex items-center gap-1">
            {statsMap[stat].icon}
            {statsMap[stat].value} {statsMap[stat].label}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
};

export default PostStats;
