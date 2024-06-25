import Link from "next/link";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import PostCard from "@/components/posts/card";

export default async function Home() {
  const posts = await prisma.post.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Blog Posts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post, index) => (
          <PostCard
            key={post.id}
            post={post}
            imagePosition={index % 2 === 0 ? "left" : "right"}
          />
        ))}
      </div>
    </main>
  );
}
