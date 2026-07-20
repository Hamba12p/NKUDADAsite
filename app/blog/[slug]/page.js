import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { ArrowLeft } from "lucide-react";
import { getBlogPost, getAllBlogPosts } from "@/lib/content";

export async function generateStaticParams() {
  const posts = getAllBlogPosts({ includeUnpublished: true });
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const post = getBlogPost(params.slug);
  if (!post) return {};
  return { title: `${post.title} — NK Udada Foundation`, description: post.excerpt };
}

function formatDate(dateStr) {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  } catch {
    return dateStr;
  }
}

export default function BlogPostPage({ params }) {
  const post = getBlogPost(params.slug);
  if (!post || !post.published) return notFound();

  const html = marked.parse(post.body || "");

  return (
    <section id="blog-page" className="section-first">
      <Link href="/blog" className="blog-back-link">
        <ArrowLeft size={16} /> Back to all posts
      </Link>

      <div className="blog-post-header">
        <div className="blog-post-meta">{formatDate(post.date)}</div>
        <h1 className="blog-post-title">{post.title}</h1>
        <div className="blog-post-author">By {post.author}</div>
      </div>

      {post.coverImage && (
        <img src={post.coverImage} alt={post.title} className="blog-post-cover" />
      )}

      <div className="blog-post-body" dangerouslySetInnerHTML={{ __html: html }} />
    </section>
  );
}
