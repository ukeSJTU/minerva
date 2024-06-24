import Link from "next/link";
import prisma from "@/lib/prisma"; // Change this line
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function SeriesPage() {
  const series = await prisma.series.findMany({
    include: {
      posts: {
        select: { id: true },
      },
    },
  });

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Series</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {series.map((s) => (
          <Card key={s.id}>
            <CardHeader>
              <CardTitle>{s.title}</CardTitle>
              <CardDescription>{s.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {s.posts.length} posts in this series
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href={`/series/${s.id}`}>View Series</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  );
}
