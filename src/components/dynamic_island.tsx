"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ArrowUp } from "lucide-react";
import { SeriesDropdown } from "@/components/series_dropdown";

interface SeriesInfo {
  id: number;
  title: string;
  currentPost: { id: number; title: string; orderInSeries: number };
  prevPost: { id: number; title: string } | null;
  nextPost: { id: number; title: string } | null;
  totalPosts: number;
  posts: { id: number; title: string; orderInSeries: number }[];
}

export function DynamicIsland() {
  const [seriesInfo, setSeriesInfo] = useState<SeriesInfo | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const fetchSeriesInfo = async () => {
      const postId = pathname.split("/").pop();
      if (postId && !isNaN(Number(postId))) {
        const response = await fetch(`/api/series-info/${postId}`);
        if (response.ok) {
          const data = await response.json();
          setSeriesInfo(data);
        } else {
          setSeriesInfo(null);
        }
      } else {
        setSeriesInfo(null);
      }
    };

    fetchSeriesInfo();
  }, [pathname]);

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getSeriesProgress = () => {
    if (seriesInfo) {
      return Math.round(
        ((seriesInfo.currentPost.orderInSeries - 1) / seriesInfo.totalPosts) *
          100
      );
    }
    return 0;
  };

  if (!seriesInfo) {
    return null;
  }

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-background/80 text-black rounded-full px-3 py-2 flex items-center space-x-2 z-50 shadow-lg transition-all duration-300 ease-in-out hover:w-auto hover:max-w-md">
      <div className="flex items-center space-x-2 overflow-hidden">
        <SeriesDropdown
          posts={seriesInfo.posts}
          currentPostId={seriesInfo.currentPost.id}
          seriesTitle={seriesInfo.title}
        />
        <Link href={`/series/${seriesInfo.id}`} className="truncate">
          <span className="text-xs font-semibold">{seriesInfo.title}</span>
        </Link>
      </div>
      <div className="flex items-center space-x-1">
        <Button
          variant="ghost"
          size="sm"
          className="p-1 hover:bg-white/10 rounded-full"
          asChild
        >
          <Link
            href={
              seriesInfo.prevPost ? `/posts/${seriesInfo.prevPost.id}` : "#"
            }
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="relative w-6 h-6">
          <svg className="w-6 h-6" viewBox="0 0 36 36">
            <path
              className="text-blue-200"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
            {/* TODO: a bug: when user passes 50%, the number changes but the circle stucks at half way */}
            <path
              className="text-blue-600"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray={`${getSeriesProgress()}, 100`}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[10px]">
            {getSeriesProgress()}%
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="p-1 hover:bg-white/10 rounded-full"
          asChild
        >
          <Link
            href={
              seriesInfo.nextPost ? `/posts/${seriesInfo.nextPost.id}` : "#"
            }
          >
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleBackToTop}
        className="p-1 hover:bg-white/10 rounded-full"
      >
        <ArrowUp className="h-4 w-4" />
      </Button>
    </div>
  );
}
