"use client";

import React, { ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ChevronDown, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import PostStats from "@/components/posts/stats";
import { Post } from "@prisma/client";

interface BannerProps {
  imageUrl: string;
  children: ReactNode;
  fullScreen?: boolean;
  className?: string;
  onClick?: () => void;
}

const Banner: React.FC<BannerProps> = ({
  imageUrl,
  children,
  fullScreen = false,
  className,
  onClick = () => {},
}) => {
  return (
    <div
      className={cn("relative w-full", fullScreen ? "h-screen" : "", className)}
    >
      <Image
        src={imageUrl}
        alt="Banner"
        layout="fill"
        objectFit="cover"
        className="z-0"
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-filter backdrop-blur-md z-10" />
      {children}
    </div>
  );
};

interface HomepageBannerProps {
  imageUrl: string;
  children?: ReactNode;
  title: string;
  quote: string;
}

const HomepageBanner: React.FC<HomepageBannerProps> = ({
  imageUrl,
  children,
  title,
  quote,
}) => {
  const handleScroll = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <Banner imageUrl={imageUrl} fullScreen>
      <div className="absolute inset-0 z-20 flex flex-col">
        <div className="z-30">{children}</div>
        <div className="flex-grow flex flex-col items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
            {title}
          </h1>
          <p className="text-lg md:text-xl max-w-2xl text-center px-4 text-white italic">
            &quot;{quote}&quot;
          </p>
        </div>
        <Button
          onClick={handleScroll}
          variant="outline"
          className="self-center mb-8 animate-bounce bg-transparent border-transparent"
        >
          <ChevronDown size={32} />
        </Button>
      </div>
    </Banner>
  );
};

interface PostBannerProps {
  post: Post;
  onCommentClick: () => void;
  children?: ReactNode;
}

const PostBanner: React.FC<PostBannerProps> = ({
  post,
  onCommentClick,
  children,
}) => {
  const imageUrl = post.bannerImgURL || "/images/banner_2.jpg";

  return (
    <Banner imageUrl={imageUrl} className="h-[50vh]">
      <div className="absolute inset-0 z-20">
        {children}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white text-center px-4">
            {post.title}
          </h1>
          <PostStats
            post={post}
            showStats={["createdAt", "views", "likes", "comments"]}
          />
          <Button
            onClick={onCommentClick}
            variant="outline"
            className="mt-4 bg-white text-black px-6 py-2 rounded-full hover:bg-opacity-80 transition-colors"
          >
            <ChevronDown size={20} className="mr-2" />
            Jump to Comments
          </Button>
        </div>
      </div>
    </Banner>
  );
};

export { Banner, HomepageBanner, PostBanner };
