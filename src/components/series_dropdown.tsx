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
    <DropdownMenu modal={false}>
      {/* setting the modal to false explicitly is to enable scrolling when dropdown-menu is shown */}
      <DropdownMenuTrigger asChild>
        {/* The shadow of the button when user hovering it doesn't match the outer div of dynamic island */}
        <Button variant="ghost" size="icon">
          <List className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="">
        <div className="grid grid-cols-2">
          {posts.map((post) => (
            <DropdownMenuItem key={post.id} asChild>
              <Link
                href={`/posts/${post.id}`}
                className="flex items-start px-2 py-3 hover:bg-gray-50 transition-colors"
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    post.id === currentPostId
                      ? "bg-blue-300 text-blue-800"
                      : "bg-blue-500 text-white"
                  } transition-colors group-hover:bg-gray-400`}
                >
                  {post.orderInSeries}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">
                    Chapter {post.orderInSeries}
                  </span>
                  <span className="text-sm font-medium">{post.title}</span>
                </div>
              </Link>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
