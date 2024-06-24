import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { postId: string } }
) {
  const postId = parseInt(params.postId);

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      series: {
        include: {
          posts: {
            orderBy: { orderInSeries: "asc" },
            select: { id: true, title: true, orderInSeries: true },
          },
        },
      },
    },
  });

  if (!post || !post.series) {
    return NextResponse.json(
      { error: "Post or series not found" },
      { status: 404 }
    );
  }

  const currentPostIndex = post.series.posts.findIndex((p) => p.id === postId);
  const prevPost =
    currentPostIndex > 0 ? post.series.posts[currentPostIndex - 1] : null;
  const nextPost =
    currentPostIndex < post.series.posts.length - 1
      ? post.series.posts[currentPostIndex + 1]
      : null;

  return NextResponse.json({
    id: post.series.id,
    title: post.series.title,
    currentPost: post.series.posts[currentPostIndex],
    prevPost,
    nextPost,
    totalPosts: post.series.posts.length,
  });
}
