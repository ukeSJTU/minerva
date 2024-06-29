import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create categories
  const techCategory = await prisma.category.upsert({
    where: { name: "Technology" },
    update: {},
    create: { name: "Technology", slug: "technology" },
  });

  const gameCategory = await prisma.category.upsert({
    where: { name: "Game Development" },
    update: {},
    create: { name: "Game Development", slug: "game-development" },
  });

  // Create series
  const swiftSeries = await prisma.series.create({
    data: {
      title: "A Practical Way to Learn Swift",
      description: "Step-by-step guide to mastering Swift programming",
      slug: "learn-swift",
    },
  });

  const pygameSeries = await prisma.series.create({
    data: {
      title: "Design a Snake Game with Pygame",
      description: "Learn game development by creating a classic Snake game",
      slug: "pygame-snake",
    },
  });

  // Create posts for Swift series
  for (let i = 1; i <= 10; i++) {
    await prisma.post.create({
      data: {
        title: `Swift Tutorial ${i}: ${getSwiftTopicForIndex(i)}`,
        content: `
# Swift Tutorial ${i}: ${getSwiftTopicForIndex(i)}

This is the content for Swift tutorial ${i}. Below is a code example:

\`\`\`swift
// This is a Swift code example
let message = "Hello, Swift!"
print(message)
\`\`\`

> "Learning Swift can be fun and rewarding!" - Swift Community

And some additional information about the topic...
        `,
        published: true,
        category: { connect: { id: techCategory.id } },
        series: { connect: { id: swiftSeries.id } },
        orderInSeries: i,
        slug: `swift-tutorial-${i}`,
      },
    });
  }

  // Create posts for Pygame series
  for (let i = 1; i <= 7; i++) {
    await prisma.post.create({
      data: {
        title: `Pygame Tutorial ${i}: ${getPygameTopicForIndex(i)}`,
        content: `
# Pygame Tutorial ${i}: ${getPygameTopicForIndex(i)}

This is the content for Pygame tutorial ${i}. Below is a code example:

\`\`\`python
# This is a Pygame code example
import pygame
pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Snake Game")
\`\`\`

> "Creating games with Pygame is a great way to learn programming!" - Pygame Community

And some additional information about the topic...
        `,
        published: true,
        category: { connect: { id: gameCategory.id } },
        series: { connect: { id: pygameSeries.id } },
        orderInSeries: i,
        slug: `pygame-tutorial-${i}`,
      },
    });
  }

  console.log("Seed data created");
}

function getSwiftTopicForIndex(index: number): string {
  const topics = [
    "Introduction to Swift",
    "Variables and Constants",
    "Control Flow",
    "Functions and Closures",
    "Classes and Structures",
    "Protocols and Extensions",
    "Error Handling",
    "Concurrency",
    "Memory Management",
    "Advanced Topics",
  ];
  return topics[index - 1] || `Advanced Topic ${index - 10}`;
}

function getPygameTopicForIndex(index: number): string {
  const topics = [
    "Setting Up Pygame",
    "Creating the Game Window",
    "Drawing the Snake",
    "Moving the Snake",
    "Handling User Input",
    "Adding Food and Collision Detection",
    "Implementing Game Over and Scoring",
  ];
  return topics[index - 1] || `Additional Feature ${index - 7}`;
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
