import Link from "next/link";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { HomepageBanner } from "@/components/banner";
import ProfileCard from "@/components/profile_card";
import PostCard from "@/components/posts/card";

export default async function Home() {
  const posts = await prisma.post.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="">
      <HomepageBanner
        imageUrl="/images/banner_1.jpg"
        title="Welcome to My Blog"
        quote="A blog about web development and programming."
      />
      <div className="container flex flex-row mx-auto justify-around px-4 py-16 text-center">
        <div className="w-1/3">
          <ProfileCard
            avatarUrl="/images/avatar.jpg"
            name="uke"
            motto="Earth to earth, dust to dust."
            yearsWriting={10}
            followers={29}
            posts={30}
          />
        </div>
        <div className="w-2/3">
          <div className="flex flex-col space-y-6">
            {posts.map((post, index) => (
              <PostCard
                key={post.id}
                post={post}
                imagePosition={index % 2 === 0 ? "left" : "right"}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
