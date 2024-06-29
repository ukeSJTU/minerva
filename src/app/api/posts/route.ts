import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Post } from "@prisma/client";
import { z } from "zod";

const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  slug: z.string().min(1, "Slug is required"),
  published: z.boolean(),
  categoryId: z.number().int().positive(),
  tagIds: z.array(z.number().int().positive()).optional(),
});

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        category: true,
        series: true,
        tags: true,
      },
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Request error", error);
    return NextResponse.json(
      { error: "Error fetching posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const validatedData = postSchema.parse(json);

    const { tagIds, ...postData } = validatedData;

    const post = await prisma.post.create({
      data: {
        ...postData,
        tags:
          tagIds && tagIds.length > 0
            ? {
                connect: tagIds.map((id) => ({ id })),
              }
            : undefined,
      },
      include: {
        category: true,
        tags: true,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Request error", error);
    return NextResponse.json({ error: "Error creating post" }, { status: 500 });
  }
}
