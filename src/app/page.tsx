import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to Our Blog</h1>
      <p className="text-xl mb-8">
        Discover insightful articles and stay updated with the latest trends.
      </p>
      <Button asChild>
        <Link href="/posts">View All Posts</Link>
      </Button>
    </main>
  );
}
