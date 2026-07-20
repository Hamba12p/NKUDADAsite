"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import { Field, FieldRow, Checkbox } from "./FormPrimitives";

const emptyPost = {
  title: "",
  slug: "",
  excerpt: "",
  coverImage: "",
  author: "NK Udada Foundation",
  date: new Date().toISOString().slice(0, 10),
  published: true,
  body: ""
};

export default function BlogPostEditor({ initialPost, mode }) {
  const [post, setPost] = useState(initialPost || emptyPost);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const router = useRouter();

  function field(key) {
    return (value) => setPost((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setStatus("saving");
    setMessage("");
    try {
      const url = mode === "create" ? "/api/admin/blog" : `/api/admin/blog/${initialPost.slug}`;
      const method = mode === "create" ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(post)
      });
      const result = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMessage(result.error || "Save failed.");
        return;
      }
      setStatus("success");
      setMessage("Saved. Redirecting…");
      setTimeout(() => {
        router.push("/admin/blog");
        router.refresh();
      }, 900);
    } catch {
      setStatus("error");
      setMessage("Network error — try again.");
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete "${post.title}"? This can't be undone from the admin portal.`)) return;
    setStatus("saving");
    try {
      const res = await fetch(`/api/admin/blog/${initialPost.slug}`, { method: "DELETE" });
      if (!res.ok) {
        const result = await res.json();
        setStatus("error");
        setMessage(result.error || "Delete failed.");
        return;
      }
      router.push("/admin/blog");
      router.refresh();
    } catch {
      setStatus("error");
      setMessage("Network error — try again.");
    }
  }

  return (
    <div>
      <h1 className="admin-page-title">{mode === "create" ? "New Post" : "Edit Post"}</h1>
      <p className="admin-page-sub">
        {mode === "create"
          ? "Write a new update. The URL slug is generated from the title unless you set one below."
          : `Editing /blog/${initialPost.slug}`}
      </p>

      <div className="admin-card">
        <Field label="Title" value={post.title} onChange={field("title")} />
        {mode === "create" && (
          <Field label="URL slug (optional — auto-generated from title if left blank)" value={post.slug} onChange={field("slug")} />
        )}
        <Field label="Excerpt (shown on the blog list page)" value={post.excerpt} textarea onChange={field("excerpt")} />
        <FieldRow>
          <Field label="Cover image path" value={post.coverImage} onChange={field("coverImage")} />
          <Field label="Author" value={post.author} onChange={field("author")} />
        </FieldRow>
        <FieldRow>
          <Field label="Date" type="date" value={post.date} onChange={field("date")} />
          <div style={{ display: "flex", alignItems: "center", marginTop: "22px" }}>
            <Checkbox label="Published (visible on the site)" checked={post.published} onChange={field("published")} />
          </div>
        </FieldRow>
        <Field
          label="Body — plain text or simple markdown (blank lines separate paragraphs, **bold**, [links](https://...))"
          value={post.body}
          textarea
          onChange={field("body")}
        />
        <p style={{ fontSize: "12px", color: "var(--muted)" }}>
          Cover image path examples: <code>/assets/images/IMG_5609.jpg</code> (an existing photo) or a full <code>https://</code> URL.
        </p>
      </div>

      <div className="admin-save-bar" style={{ justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button className="admin-save-btn" onClick={handleSave} disabled={status === "saving"}>
            <Save size={15} /> {status === "saving" ? "Saving…" : "Save post"}
          </button>
          {status === "success" && (
            <span className="admin-save-status success"><CheckCircle2 size={14} style={{ verticalAlign: "-2px", marginRight: "4px" }} />{message}</span>
          )}
          {status === "error" && (
            <span className="admin-save-status error"><AlertCircle size={14} style={{ verticalAlign: "-2px", marginRight: "4px" }} />{message}</span>
          )}
        </div>
        {mode === "edit" && (
          <button className="admin-icon-btn danger" onClick={handleDelete} disabled={status === "saving"}>
            <Trash2 size={14} /> Delete post
          </button>
        )}
      </div>
    </div>
  );
}
