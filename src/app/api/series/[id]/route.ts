import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const series = await prisma.series.findUnique({
      where: { id },
      include: {
        posts: true,
      },
    });

    if (!series) {
      return NextResponse.json({ error: "Series not found" }, { status: 404 });
    }

    return NextResponse.json(series);
  } catch (error) {
    console.error("Request error", error);
    return NextResponse.json(
      { error: "Error fetching series" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const json = await request.json();

    const updatedSeries = await prisma.series.update({
      where: { id },
      data: json,
    });

    return NextResponse.json(updatedSeries);
  } catch (error) {
    console.error("Request error", error);
    return NextResponse.json(
      { error: "Error updating series" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    // First, update all posts in this series to remove the series association
    await prisma.post.updateMany({
      where: { seriesId: id },
      data: { seriesId: null, orderInSeries: null },
    });

    // Then delete the series
    await prisma.series.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Series deleted successfully" });
  } catch (error) {
    console.error("Request error", error);
    return NextResponse.json(
      { error: "Error deleting series" },
      { status: 500 }
    );
  }
}
