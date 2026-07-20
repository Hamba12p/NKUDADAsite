import AdminShell from "@/components/admin/AdminShell";
import BlogPostEditor from "@/components/admin/BlogPostEditor";

export const metadata = { title: "New Blog Post" };

export default function AdminNewBlogPostPage() {
  return (
    <AdminShell>
      <BlogPostEditor mode="create" />
    </AdminShell>
  );
}
