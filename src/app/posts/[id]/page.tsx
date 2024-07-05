"use client";

import React, { useState, useEffect } from "react";
import { serialize } from "next-mdx-remote/serialize";
import { notFound } from "next/navigation";
import { CommentSection } from "@/components/comment_section";
import MDXContent from "@/components/mdx_content";
import { PostBanner } from "@/components/banner";
import { Comment, Post } from "@prisma/client";
import { Navbar } from "@/components/navbar";
import FloatingSideBar from "@/components/posts/side_floating_bar";

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

  const handleCommentClick = () => {
    const commentsSection = document.getElementById("comments");
    commentsSection?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="w-full relative">
      <PostBanner post={postData} onCommentClick={handleCommentClick}>
        <Navbar />
      </PostBanner>
      <div className="container mx-auto px-4 py-8 flex">
        <FloatingSideBar
          likes={postData.likes}
          commentCount={postData.comments?.length || 0}
          onCommentClick={handleCommentClick}
          onScrollToTop={handleScrollToTop}
        />
        <div className="flex-grow ml-16">
          <div className="prose prose-lg max-w-4xl mx-auto">
            {serializedContent && <MDXContent source={serializedContent} />}
          </div>
          <div id="comments" className="mt-8">
            <CommentSection postId={parseInt(id)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPage;
