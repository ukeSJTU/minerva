"use client";

import React, { useState, useEffect } from "react";
import { serialize } from "next-mdx-remote/serialize";
import { notFound } from "next/navigation";
import { CommentSection } from "@/components/comment_section";
import MDXContent from "@/components/mdx_content";
import { PostBanner } from "@/components/banner";
import { Post } from "@prisma/client";
import { Navbar } from "@/components/navbar";

interface PostPageProps {
  params: { id: string };
}

const PostPage = ({ params }: PostPageProps) => {
  const id = params.id;
  const [postData, setPostData] = useState<Post | null>(null);
  const [serializedContent, setSerializedContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch post");
        }
        const data: Post = await res.json();
        setPostData(data);

        // Serialize the MDX content
        const serialized = await serialize(data.content);
        setSerializedContent(serialized);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching post", error);
        setPostData(null);
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!postData) {
    return notFound();
  }

  return (
    <div className="w-[100vw]">
      <PostBanner
        post={postData}
        onCommentClick={() => {
          const commentsSection = document.getElementById("comments");
          commentsSection?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        <Navbar />
      </PostBanner>
      <div className="container mx-auto px-4 py-8">
        <div className="prose prose-lg">
          {serializedContent && <MDXContent source={serializedContent} />}
        </div>
        <div id="comments">
          <CommentSection postId={parseInt(id)} />
        </div>
      </div>
    </div>
  );
};

export default PostPage;
