import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default async function SeriesDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const series = await prisma.series.findUnique({
    where: { id: parseInt(params.id) },
    include: {
      posts: {
        orderBy: { orderInSeries: "asc" },
        select: { id: true, title: true, orderInSeries: true },
      },
    },
  });

  if (!series) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">{series.title}</h1>
      <p className="text-lg mb-8">{series.description}</p>
      <div className="space-y-4">
        {series.posts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <CardTitle>
                <Link href={`/posts/${post.id}`} className="hover:underline">
                  {post.orderInSeries}. {post.title}
                </Link>
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </main>
  );
}
