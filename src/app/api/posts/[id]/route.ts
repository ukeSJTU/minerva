import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        category: true,
        series: true,
        tags: true,
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Request error", error);
    return NextResponse.json({ error: "Error fetching post" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const json = await request.json();
    const { tags, ...postData } = json;

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        ...postData,
        tags: {
          set: tags.map((tagId: number) => ({ id: tagId })),
        },
      },
      include: {
        category: true,
        series: true,
        tags: true,
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Request error", error);
    return NextResponse.json({ error: "Error updating post" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    // TODO: should I remove all relations before deleting the selected post
    await prisma.post.update({
      where: { id },
      data: {
        tags: {
          set: [],
        },
        series: {
          disconnect: true,
        },
      },
    });

    // then we can delete the post
    await prisma.post.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Request error", error);
    return NextResponse.json({ error: "Error deleting post" }, { status: 500 });
  }
}
