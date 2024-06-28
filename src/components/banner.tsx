"use client";

import React, { ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ChevronDown, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      className={cn(
        "relative w-full",
        fullScreen ? "h-screen" : "h-64 md:h-96",
        className
      )}
    >
      <Image
        src={imageUrl}
        alt="Banner"
        layout="fill"
        objectFit="cover"
        className="z-0"
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 z-10" />
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        {children}
      </div>
    </div>
  );
};

interface HomepageBannerProps {
  imageUrl: string;
  title: string;
  quote: string;
}

const HomepageBanner: React.FC<HomepageBannerProps> = ({
  imageUrl,
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
      <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
        {title}
      </h1>
      <p className="text-lg md:text-xl max-w-2xl text-center px-4 text-white italic">
        &quot;{quote}&quot;
      </p>
      <Button
        onClick={handleScroll}
        variant="outline"
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2  animate-bounce bg-transparent border-transparent"
      >
        <ChevronDown size={32} />
      </Button>
    </Banner>
  );
};

interface PostBannerProps {
  imageUrl: string;
  title: string;
  views: number;
  onCommentClick: () => void;
}

const PostBanner: React.FC<PostBannerProps> = ({
  imageUrl,
  title,
  views,
  onCommentClick,
}) => {
  return (
    <Banner imageUrl={imageUrl}>
      <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">
        {title}
      </h1>
      <div className="flex items-center text-white mb-4">
        <Eye size={20} className="mr-2" />
        <span>{views} views</span>
      </div>
      <Button
        onClick={onCommentClick}
        className="bg-white text-black px-4 py-2 rounded-full hover:bg-opacity-80 transition-colors"
      >
        Jump to Comments
      </Button>
    </Banner>
  );
};

export { Banner, HomepageBanner, PostBanner };
