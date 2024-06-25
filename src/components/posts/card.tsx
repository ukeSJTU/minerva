import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { CalendarIcon, EyeIcon, HeartIcon, ArrowRightIcon } from "lucide-react";
import CategoryBadge from "../badges/category";

interface PostCardProps {
  post: {
    id: number;
    title: string;
    content: string;
    published: boolean;
    createdAt: Date;
    updatedAt: Date;
    categoryId: number;
    seriesId: number | null;
    orderInSeries: number | null;
    category?: {
      id: number;
      name: string;
    };
    series?: {
      id: number;
      name: string;
    };
    imageUrl?: string;
  };
  imagePosition?: "left" | "right";
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  imagePosition = "left",
}) => {
  const imageUrl = post.imageUrl || "/images/moebius_1.jpg";
  const isImageLeft = imagePosition === "left";

  return (
    <Card className="flex flex-col md:flex-row items-center bg-card text-card-foreground shadow-sm rounded-xl overflow-hidden w-full max-w-[800px]">
      <div className="md:w-1/3 hidden md:block">
        <Image
          src={imageUrl}
          alt="Blog Post Image"
          width={400}
          height={400}
          className="object-cover aspect-square"
        />
      </div>
      <div className="md:w-2/3 p-6 md:p-8 flex flex-col gap-4">
        <div>
          <CategoryBadge name={post.category?.name || "Uncategorized"} />
        </div>
        <h3 className="text-2xl font-bold">
          <Link href={`/posts/${post.id}`} prefetch={false}>
            {post.title}
          </Link>
        </h3>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            <span>
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <EyeIcon className="w-4 h-4" />
            <span>1,234 views</span>
          </div>
          <div className="flex items-center gap-2">
            <HeartIcon className="w-4 h-4" />
            <span>456 likes</span>
          </div>
        </div>
        <p className="text-muted-foreground">{post.content.slice(0, 200)}...</p>
        <Link
          href={`/posts/${post.id}`}
          className="inline-flex items-center gap-2 font-medium hover:underline"
          prefetch={false}
        >
          Read More
          <ArrowRightIcon className="w-4 h-4" />
        </Link>
      </div>
    </Card>
  );
};

export default PostCard;
