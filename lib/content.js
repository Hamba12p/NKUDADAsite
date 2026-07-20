import fs from "fs";
import path from "path";

const CONTENT_DIR = path.join(process.cwd(), "content");
const BLOG_DIR = path.join(CONTENT_DIR, "blog");

export function getSiteContent() {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, "site.json"), "utf-8");
  return JSON.parse(raw);
}

export function getGalleryContent() {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, "gallery.json"), "utf-8");
  return JSON.parse(raw);
}

export function getAllBlogPosts({ includeUnpublished = false } = {}) {
  if (!fs.existsSync(BLOG_DIR)) return [];
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".json"));
  const posts = files.map((f) => {
    const raw = fs.readFileSync(path.join(BLOG_DIR, f), "utf-8");
    return JSON.parse(raw);
  });
  const filtered = includeUnpublished ? posts : posts.filter((p) => p.published);
  return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function getBlogPost(slug) {
  const filePath = path.join(BLOG_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

export function slugify(input) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
