import { notFound } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import BlogPostEditor from "@/components/admin/BlogPostEditor";
import { getBlogPost } from "@/lib/content";

export async function generateMetadata({ params }) {
  const post = getBlogPost(params.slug);
  return { title: post ? `Edit — ${post.title}` : "Edit Post" };
}

export default function AdminEditBlogPostPage({ params }) {
  const post = getBlogPost(params.slug);
  if (!post) return notFound();

  return (
    <AdminShell>
      <BlogPostEditor mode="edit" initialPost={post} />
    </AdminShell>
  );
}
