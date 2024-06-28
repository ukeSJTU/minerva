import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HomepageBanner } from "@/components/banner";
import ProfileCard from "@/components/profile_card";

export default function Home() {
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
          <h1 className="text-4xl font-bold mb-6">Welcome to Our Blog</h1>
          <p className="text-xl mb-8">
            Discover insightful articles and stay updated with the latest
            trends.
          </p>
          <Button asChild>
            <Link href="/posts">View All Posts</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
