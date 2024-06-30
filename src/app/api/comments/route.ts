import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get("postId");

  if (!postId) {
    return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
  }

  const comments = await prisma.comment.findMany({
    where: { postId: parseInt(postId) },
    include: {
      author: { select: { name: true, image: true } },
      replies: {
        include: {
          author: { select: { name: true, image: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(comments);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { content, postId, parentId } = await request.json();

    if (!content || !postId) {
      return NextResponse.json(
        { error: "Content and postId are required" },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        postId: parseInt(postId),
        authorId: session.user.id,
        parentId: parentId || null,
      },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Error creating comment" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id, content } = await request.json();

  const comment = await prisma.comment.findUnique({ where: { id } });

  if (!comment || comment.authorId !== session.user.id) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const updatedComment = await prisma.comment.update({
    where: { id },
    data: { content },
  });

  return NextResponse.json(updatedComment);
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Comment ID is required" },
      { status: 400 }
    );
  }

  const comment = await prisma.comment.findUnique({ where: { id } });

  if (!comment || comment.authorId !== session.user.id) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  await prisma.comment.delete({ where: { id } });

  return NextResponse.json({ message: "Comment deleted successfully" });
}
