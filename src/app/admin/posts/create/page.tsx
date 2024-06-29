import { CreatePostForm } from "@/components/admin/create_post_form";

export default function CreatePostPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Create New Post</h1>
      <CreatePostForm />
    </div>
  );
}
