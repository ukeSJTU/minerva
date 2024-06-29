import React from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { components } from "@/components/markdown";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

interface PostPageProps {
  params: { id: string };
}

export default async function PostPage({ params }: PostPageProps) {
  const id = params.id;

  const post = await prisma.post.findUnique({
    where: { id: parseInt(id) },
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <div className="prose prose-lg">
        <MDXRemote source={post.content} components={components} />
      </div>
    </div>
  );
}
