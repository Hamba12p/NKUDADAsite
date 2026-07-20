import { NextResponse } from "next/server";
import { putFile, deleteFile, getFile } from "@/lib/github";

export async function PUT(request, { params }) {
  const { slug } = params;
  let post;
  try {
    post = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const repoPath = `content/blog/${slug}.json`;
  let existing;
  try {
    existing = await getFile(repoPath);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
  if (!existing) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }

  const fullPost = {
    slug,
    title: post.title || "",
    excerpt: post.excerpt || "",
    coverImage: post.coverImage || "",
    author: post.author || "NK Udada Foundation",
    date: post.date || new Date().toISOString().slice(0, 10),
    published: post.published !== false,
    body: post.body || ""
  };

  try {
    await putFile(repoPath, fullPost, `Update blog post: ${fullPost.title}`);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(request, { params }) {
  const { slug } = params;
  const repoPath = `content/blog/${slug}.json`;

  try {
    await deleteFile(repoPath, `Delete blog post: ${slug}`);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
