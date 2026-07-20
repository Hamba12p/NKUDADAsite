import { NextResponse } from "next/server";
import { putFile, getFile } from "@/lib/github";
import { slugify } from "@/lib/content";

export async function POST(request) {
  let post;
  try {
    post = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!post.title) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }

  const slug = post.slug ? slugify(post.slug) : slugify(post.title);
  if (!slug) {
    return NextResponse.json({ error: "Could not derive a slug from the title." }, { status: 400 });
  }

  const repoPath = `content/blog/${slug}.json`;

  let existing;
  try {
    existing = await getFile(repoPath);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
  if (existing) {
    return NextResponse.json(
      { error: "A post with this slug already exists. Choose a different title or slug." },
      { status: 409 }
    );
  }

  const fullPost = {
    slug,
    title: post.title,
    excerpt: post.excerpt || "",
    coverImage: post.coverImage || "",
    author: post.author || "NK Udada Foundation",
    date: post.date || new Date().toISOString().slice(0, 10),
    published: post.published !== false,
    body: post.body || ""
  };

  try {
    await putFile(repoPath, fullPost, `Add blog post: ${fullPost.title}`);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, slug });
}
