"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SeriesInfo {
  id: number;
  title: string;
  currentPost: { id: number; title: string; orderInSeries: number };
  prevPost: { id: number; title: string } | null;
  nextPost: { id: number; title: string } | null;
  totalPosts: number;
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

  if (!seriesInfo) {
    return null;
  }

  return (
    <div className="relative top-4 left-1/2 transform -translate-x-1/2 bg-background/80 backdrop-blur-md shadow-md rounded-full px-4 py-2 flex items-center space-x-4 mx-auto">
      <Link href={`/series/${seriesInfo.id}`}>
        <span className="text-sm font-bold">{seriesInfo.title}</span>
      </Link>
      <span className="text-sm">
        {seriesInfo.currentPost.orderInSeries} of {seriesInfo.totalPosts}
      </span>
      <div className="flex items-center space-x-2">
        {seriesInfo.prevPost ? (
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/posts/${seriesInfo.prevPost.id}`}>
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
        ) : (
          <Button variant="ghost" size="icon" disabled>
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
        {seriesInfo.nextPost ? (
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/posts/${seriesInfo.nextPost.id}`}>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        ) : (
          <Button variant="ghost" size="icon" disabled>
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
