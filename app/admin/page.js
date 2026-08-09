import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { getAllBlogPosts, getGalleryContent, getOutreachContent } from "@/lib/content";
import { FileText, Newspaper, Images, Users, ArrowUpRight } from "lucide-react";

export const metadata = { title: "Admin Dashboard" };

export default function AdminDashboardPage() {
  const posts = getAllBlogPosts({ includeUnpublished: true });
  const gallery = getGalleryContent();
  const outreach = getOutreachContent();
  const outreachStats = outreach.students.reduce(
    (acc, s) => {
      acc.total += 1;
      if (s.gender === "Girl") acc.girls += 1;
      else if (s.gender === "Boy") acc.boys += 1;
      else acc.unspec += 1;
      return acc;
    },
    { total: 0, girls: 0, boys: 0, unspec: 0 }
  );

  return (
    <AdminShell>
      <h1 className="admin-page-title">Dashboard</h1>
      <p className="admin-page-sub">
        Edits save straight to GitHub and go live after the next deploy — usually under a minute.
      </p>

      {outreachStats.total > 0 && (
        <div className="admin-card" style={{ marginBottom: "20px" }}>
          <div className="admin-card-title" style={{ marginBottom: "14px" }}>Outreach so far</div>
          <div className="outreach-stats" style={{ marginBottom: 0 }}>
            <span className="outreach-pill">Total: {outreachStats.total}</span>
            <span className="outreach-pill girl">Girls: {outreachStats.girls}</span>
            <span className="outreach-pill boy">Boys: {outreachStats.boys}</span>
            <span className="outreach-pill unspec">Not specified: {outreachStats.unspec}</span>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
        <Link href="/admin/site" className="admin-card" style={{ textDecoration: "none", display: "block" }}>
          <FileText size={22} color="var(--purple)" />
          <div className="admin-card-title" style={{ marginTop: "14px", marginBottom: "6px" }}>Site Content</div>
          <p style={{ fontSize: "13px", color: "var(--muted)" }}>Edit every text section — hero, about, programs, team, and more.</p>
          <div style={{ marginTop: "14px", fontSize: "12px", color: "var(--purple)", display: "flex", alignItems: "center", gap: "4px" }}>
            Edit content <ArrowUpRight size={13} />
          </div>
        </Link>
        <Link href="/admin/blog" className="admin-card" style={{ textDecoration: "none", display: "block" }}>
          <Newspaper size={22} color="var(--purple)" />
          <div className="admin-card-title" style={{ marginTop: "14px", marginBottom: "6px" }}>Blog Posts</div>
          <p style={{ fontSize: "13px", color: "var(--muted)" }}>{posts.length} post{posts.length === 1 ? "" : "s"} — write, edit, or publish weekly updates.</p>
          <div style={{ marginTop: "14px", fontSize: "12px", color: "var(--purple)", display: "flex", alignItems: "center", gap: "4px" }}>
            Manage posts <ArrowUpRight size={13} />
          </div>
        </Link>
        <Link href="/admin/gallery" className="admin-card" style={{ textDecoration: "none", display: "block" }}>
          <Images size={22} color="var(--purple)" />
          <div className="admin-card-title" style={{ marginTop: "14px", marginBottom: "6px" }}>Gallery</div>
          <p style={{ fontSize: "13px", color: "var(--muted)" }}>{gallery.items.length} item{gallery.items.length === 1 ? "" : "s"} — captions, categories, and order.</p>
          <div style={{ marginTop: "14px", fontSize: "12px", color: "var(--purple)", display: "flex", alignItems: "center", gap: "4px" }}>
            Manage gallery <ArrowUpRight size={13} />
          </div>
        </Link>
        <Link href="/admin/outreach" className="admin-card" style={{ textDecoration: "none", display: "block" }}>
          <Users size={22} color="var(--purple)" />
          <div className="admin-card-title" style={{ marginTop: "14px", marginBottom: "6px" }}>Outreach</div>
          <p style={{ fontSize: "13px", color: "var(--muted)" }}>{outreach.students.length} student{outreach.students.length === 1 ? "" : "s"} registered — roll call for outreach events.</p>
          <div style={{ marginTop: "14px", fontSize: "12px", color: "var(--purple)", display: "flex", alignItems: "center", gap: "4px" }}>
            Open roll call <ArrowUpRight size={13} />
          </div>
        </Link>
      </div>
    </AdminShell>
  );
}
