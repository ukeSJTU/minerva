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
      content: `---
title: "Introduction to Next.js"
date: "2023-06-24"
---

# Introduction to Next.js

Next.js is a popular React framework that enables functionality such as server-side rendering and generating static websites for React based web applications.

## Why use Next.js?

- **Server-side rendering**: Improves performance and SEO
- **Static site generation**: Creates fast, pre-rendered pages
- **Easy page routing**: Simplifies navigation in your app

Learn more about Next.js [here](https://nextjs.org/).
`,
      published: true,
      categoryId: category1.id,
    },
  });

  const post2 = await prisma.post.create({
    data: {
      title: "Exploring Japan",
      content: `---
title: "Exploring Japan"
date: "2023-06-25"
---

# Exploring Japan

Japan is a country of fascinating contrasts, where ancient traditions blend seamlessly with cutting-edge technology.

## Must-visit places

1. Tokyo
2. Kyoto
3. Mount Fuji
4. Hiroshima

![Mount Fuji](https://example.com/mount-fuji.jpg)

Discover more about traveling in Japan on the [official tourism website](https://www.japan.travel/en/).
`,
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
