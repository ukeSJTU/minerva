import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const series = await prisma.series.findMany();
    return NextResponse.json(series);
  } catch (error) {
    console.error("Request error", error);
    return NextResponse.json(
      { error: "Error fetching series" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();

    const series = await prisma.series.create({
      data: json,
    });

    return NextResponse.json(series);
  } catch (error) {
    console.error("Request error", error);
    return NextResponse.json(
      { error: "Error creating series" },
      { status: 500 }
    );
  }
}
