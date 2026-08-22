import Link from "next/link";
import Image from "next/image";
import { getAllBlogPosts } from "@/lib/content";

export const metadata = { title: "Blog — NK Udada Foundation" };

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

export default function BlogIndexPage() {
  const posts = getAllBlogPosts();

  return (
    <section id="blog-page" className="section-first">
      <span className="section-tag reveal">Weekly Blog</span>
      <h2 className="section-title reveal">
        Updates from <em>the field</em>
      </h2>
      <p className="section-sub reveal">
        Programme recaps, community stories, and news from NK Udada Foundation — posted weekly.
      </p>

      {posts.length === 0 ? (
        <div className="blog-empty">No posts published yet — check back soon.</div>
      ) : (
        <div className="blog-grid">
          {posts.map((post, i) => (
            <Link
              href={`/blog/${post.slug}`}
              className={`blog-card reveal reveal-delay-${(i % 4) + 1}`}
              key={post.slug}
            >
              {post.coverImage && (post.coverImage.startsWith("/") ? (
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  className="blog-card-image"
                  width={1600}
                  height={1000}
                  sizes="(max-width: 700px) 100vw, (max-width: 1050px) 50vw, 33vw"
                  quality={82}
                  priority={i === 0}
                />
              ) : (
                <img src={post.coverImage} alt={post.title} className="blog-card-image" loading="lazy" />
              ))}
              <div className="blog-card-body">
                <div className="blog-card-date">{formatDate(post.date)}</div>
                <div className="blog-card-title">{post.title}</div>
                <div className="blog-card-excerpt">{post.excerpt}</div>
                <div className="blog-card-author">{post.author}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
