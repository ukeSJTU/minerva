import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Container, Typography, Paper } from "@mui/material";

export default async function Post({ params }: { params: { id: string } }) {
  const post = await prisma.post.findUnique({
    where: { id: parseInt(params.id) },
    include: { category: true },
  });

  if (!post) {
    notFound();
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {post.title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Category: {post.category.name}
        </Typography>
        <Typography variant="body1" paragraph>
          {post.content}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Published on {new Date(post.createdAt).toLocaleDateString()}
        </Typography>
      </Paper>
    </Container>
  );
}
