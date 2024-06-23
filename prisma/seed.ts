import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const category1 = await prisma.category.upsert({
    where: { name: "Technology" },
    update: {},
    create: { name: "Technology" },
  });

  const category2 = await prisma.category.upsert({
    where: { name: "Travel" },
    update: {},
    create: { name: "Travel" },
  });

  const post1 = await prisma.post.create({
    data: {
      title: "Introduction to Next.js",
      content: "Next.js is a React framework for production...",
      published: true,
      categoryId: category1.id,
    },
  });

  const post2 = await prisma.post.create({
    data: {
      title: "Exploring Japan",
      content: "Japan is a country of contrasts, blending...",
      published: true,
      categoryId: category2.id,
    },
  });

  console.log({ category1, category2, post1, post2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
