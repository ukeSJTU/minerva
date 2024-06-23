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
      include: { category: true },
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

    const updatedPost = await prisma.post.update({
      where: { id },
      data: json,
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Request error", error);
    return NextResponse.json({ error: "Error updating post" }, { status: 500 });
  }
}
