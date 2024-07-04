import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

function generateMarkdownContent(): string {
  const paragraphs = faker.number.int({ min: 3, max: 5 });
  let content = "";

  for (let i = 0; i < paragraphs; i++) {
    content += `## ${faker.lorem.sentence()}\n\n`;
    content += faker.lorem.paragraphs(2) + "\n\n";

    if (faker.datatype.boolean()) {
      content +=
        "```" +
        faker.helpers.arrayElement(["javascript", "python", "swift"]) +
        "\n";
      content += faker.lorem.lines(3) + "\n";
      content += "```\n\n";
    }

    if (faker.datatype.boolean()) {
      content += "> " + faker.lorem.sentence() + "\n\n";
    }
  }

  return content;
}

async function setupInitialAdminUser() {
  // assign an initial admin user
  const initialAdminEmail = process.env.INITIAL_ADMIN_EMAIL;

  if (!initialAdminEmail) {
    console.warn("INITIAL_ADMIN_EMAIL not set. Skipping admin user creation.");
    return;
  }

  const existingAdmin = await prisma.user.findUnique({
    where: { email: initialAdminEmail },
  });

  if (existingAdmin) {
    console.log("Admin user already exists. Updating isAdmin status.");
    await prisma.user.update({
      where: { email: initialAdminEmail },
      data: { isAdmin: true },
    });
  } else {
    console.warn("No admin user found. Skipping admin user creation.");
    return;
  }
}

async function main() {
  await setupInitialAdminUser();

  // Create categories (unchanged)
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

  // Create or update series
  const swiftSeries = await prisma.series.upsert({
    where: { slug: "learn-swift" },
    update: {},
    create: {
      title: "A Practical Way to Learn Swift",
      description: "Step-by-step guide to mastering Swift programming",
      slug: "learn-swift",
    },
  });

  const pygameSeries = await prisma.series.upsert({
    where: { slug: "pygame-snake" },
    update: {},
    create: {
      title: "Design a Snake Game with Pygame",
      description: "Learn game development by creating a classic Snake game",
      slug: "pygame-snake",
    },
  });

  // Create dummy users
  const users = await Promise.all(
    Array.from({ length: 5 }).map(() =>
      prisma.user.create({
        data: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          image: faker.image.avatar(),
        },
      })
    )
  );

  // Create posts for Swift series
  for (let i = 1; i <= 10; i++) {
    const post = await prisma.post.upsert({
      where: { slug: `swift-tutorial-${i}` },
      update: {
        title: `Swift Tutorial ${i}: ${getSwiftTopicForIndex(i)}`,
        content: generateMarkdownContent(),
        published: true,
        category: { connect: { id: techCategory.id } },
        series: { connect: { id: swiftSeries.id } },
        orderInSeries: i,
        slug: `swift-tutorial-${i}`,
        views: faker.number.int({ min: 100, max: 10000 }),
        likes: faker.number.int({ min: 10, max: 1000 }),
      },
      create: {
        title: `Swift Tutorial ${i}: ${getSwiftTopicForIndex(i)}`,
        content: generateMarkdownContent(),
        published: true,
        category: { connect: { id: techCategory.id } },
        series: { connect: { id: swiftSeries.id } },
        orderInSeries: i,
        slug: `swift-tutorial-${i}`,
        views: faker.number.int({ min: 100, max: 10000 }),
        likes: faker.number.int({ min: 10, max: 1000 }),
      },
    });

    // Create comments for each post
    await createCommentsForPost(post.id, users);
  }

  // Create posts for Pygame series
  for (let i = 1; i <= 7; i++) {
    const post = await prisma.post.upsert({
      where: { slug: `pygame-tutorial-${i}` },
      update: {
        title: `Pygame Tutorial ${i}: ${getPygameTopicForIndex(i)}`,
        content: generateMarkdownContent(),
        published: true,
        category: { connect: { id: gameCategory.id } },
        series: { connect: { id: pygameSeries.id } },
        orderInSeries: i,
        slug: `pygame-tutorial-${i}`,
        views: faker.number.int({ min: 100, max: 10000 }),
        likes: faker.number.int({ min: 10, max: 1000 }),
      },
      create: {
        title: `Pygame Tutorial ${i}: ${getPygameTopicForIndex(i)}`,
        content: generateMarkdownContent(),
        published: true,
        category: { connect: { id: gameCategory.id } },
        series: { connect: { id: pygameSeries.id } },
        orderInSeries: i,
        slug: `pygame-tutorial-${i}`,
        views: faker.number.int({ min: 100, max: 10000 }),
        likes: faker.number.int({ min: 10, max: 1000 }),
      },
    });

    // Create comments for each post
    await createCommentsForPost(post.id, users);
  }

  console.log("Seed data created");
}

async function createCommentsForPost(postId: number, users: any[]) {
  const commentCount = faker.number.int({ min: 3, max: 10 });

  for (let i = 0; i < commentCount; i++) {
    const comment = await prisma.comment.create({
      data: {
        content: faker.lorem.paragraph(),
        postId,
        authorId: users[faker.number.int({ min: 0, max: users.length - 1 })].id,
        likes: faker.number.int({ min: 0, max: 100 }),
        dislikes: faker.number.int({ min: 0, max: 50 }),
      },
    });

    // Add nested comments (replies)
    const replyCount = faker.number.int({ min: 0, max: 3 });
    for (let j = 0; j < replyCount; j++) {
      await prisma.comment.create({
        data: {
          content: faker.lorem.sentence(),
          postId,
          authorId:
            users[faker.number.int({ min: 0, max: users.length - 1 })].id,
          parentId: comment.id,
          likes: faker.number.int({ min: 0, max: 50 }),
          dislikes: faker.number.int({ min: 0, max: 25 }),
        },
      });
    }
  }
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
