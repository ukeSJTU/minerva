import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const tag = await prisma.tag.findUnique({
      where: { id },
      include: {
        posts: true,
      },
    });

    if (!tag) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 });
    }

    return NextResponse.json(tag);
  } catch (error) {
    console.error("Request error", error);
    return NextResponse.json({ error: "Error fetching tag" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const json = await request.json();
    const { name, slug } = json;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 }
      );
    }

    const existingTag = await prisma.tag.findUnique({
      where: { slug, NOT: { id } },
    });

    if (existingTag) {
      return NextResponse.json(
        { error: "A tag with this slug already exists" },
        { status: 409 }
      );
    }

    const updatedTag = await prisma.tag.update({
      where: { id },
      data: { name, slug },
    });

    return NextResponse.json(updatedTag);
  } catch (error) {
    console.error("Request error", error);
    return NextResponse.json({ error: "Error updating tag" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    // First, remove the tag from all posts
    await prisma.post.update({
      where: {
        tags: {
          some: { id },
        },
      },
      data: {
        tags: {
          disconnect: { id },
        },
      },
    });

    // Then delete the tag
    await prisma.tag.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Tag deleted successfully" });
  } catch (error) {
    console.error("Request error", error);
    return NextResponse.json({ error: "Error deleting tag" }, { status: 500 });
  }
}
