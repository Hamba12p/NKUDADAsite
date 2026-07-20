import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { getAllBlogPosts } from "@/lib/content";
import { Plus, Pencil, Eye } from "lucide-react";

export const metadata = { title: "Blog Posts" };

export default function AdminBlogListPage() {
  const posts = getAllBlogPosts({ includeUnpublished: true });

  return (
    <AdminShell>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 className="admin-page-title">Blog Posts</h1>
          <p className="admin-page-sub">{posts.length} post{posts.length === 1 ? "" : "s"} total.</p>
        </div>
        <Link href="/admin/blog/new" className="admin-save-btn" style={{ textDecoration: "none" }}>
          <Plus size={15} /> New post
        </Link>
      </div>

      <div className="admin-card" style={{ padding: 0 }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Date</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.slug}>
                <td>{post.title}</td>
                <td>{post.date}</td>
                <td>
                  <span className={`admin-badge ${post.published ? "published" : "draft"}`}>
                    {post.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td>
                  <div className="admin-table-actions">
                    <Link href={`/admin/blog/${post.slug}/edit`} className="admin-icon-btn">
                      <Pencil size={13} /> Edit
                    </Link>
                    {post.published && (
                      <Link href={`/blog/${post.slug}`} target="_blank" className="admin-icon-btn">
                        <Eye size={13} /> View
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", color: "var(--muted)", padding: "32px" }}>
                  No posts yet — create your first one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
