import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { List } from "lucide-react";
import Link from "next/link";

interface Post {
  id: number;
  title: string;
  orderInSeries: number;
}

interface SeriesDropdownProps {
  posts: Post[];
  currentPostId: number;
  seriesTitle: string;
}

export function SeriesDropdown({
  posts,
  currentPostId,
  seriesTitle,
}: SeriesDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <List className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">
        <div className="px-2 py-1.5 text-sm font-semibold">{seriesTitle}</div>
        <div className="h-px bg-gray-200 my-1" />
        {posts.map((post) => (
          <DropdownMenuItem key={post.id} asChild>
            <Link
              href={`/posts/${post.id}`}
              className={`flex items-center px-2 py-2 text-sm ${
                post.id === currentPostId ? "bg-gray-100 font-semibold" : ""
              }`}
            >
              <span className="w-6 text-center mr-2">{post.orderInSeries}</span>
              <span className="flex-grow truncate">{post.title}</span>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
