import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default async function Post({ params }: { params: { id: string } }) {
  const post = await prisma.post.findUnique({
    where: { id: parseInt(params.id) },
    include: { category: true },
  });

  if (!post) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>{post.title}</CardTitle>
          <CardDescription>Category: {post.category.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">{post.content}</div>
          <p className="text-sm text-muted-foreground mt-4">
            Published on {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
