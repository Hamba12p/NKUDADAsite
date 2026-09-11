import { NextResponse } from "next/server";
import { putFile } from "@/lib/github";
import { resolveImageSource } from "@/lib/image-path";

const STORE_PATH = "content/feedback.json";
const ROLES = new Set(["student", "volunteer", "partner", "other"]);

function text(value, max) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function normalizePhoto(entry) {
  const imageUrl = resolveImageSource(text(entry?.imageUrl, 500));
  if (!imageUrl) return null;
  const anonymous = Boolean(entry?.anonymous);
  return {
    id: text(entry?.id, 100) || crypto.randomUUID(),
    imageUrl,
    caption: text(entry?.caption, 1200),
    name: anonymous ? "" : text(entry?.name, 120),
    anonymous,
    role: ROLES.has(entry?.role) ? entry.role : "other",
    eventTag: text(entry?.eventTag, 160),
    featuredOnHomepage: Boolean(entry?.featuredOnHomepage),
    addedAt: text(entry?.addedAt, 40) || new Date().toISOString()
  };
}

function normalizeSubmission(entry) {
  const message = text(entry?.message, 800);
  if (!message) return null;
  const approved = Boolean(entry?.approved);
  const anonymous = Boolean(entry?.anonymous);
  return {
    id: text(entry?.id, 100) || crypto.randomUUID(),
    message,
    name: anonymous ? "" : text(entry?.name, 120),
    anonymous,
    role: ROLES.has(entry?.role) && entry.role !== "student" ? entry.role : "other",
    approved,
    featuredOnHomepage: approved && Boolean(entry?.featuredOnHomepage),
    submittedAt: text(entry?.submittedAt, 40) || new Date().toISOString(),
    ...(approved ? { approvedAt: text(entry?.approvedAt, 40) || new Date().toISOString() } : {})
  };
}

export async function PUT(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!Array.isArray(body?.photoEntries) || !Array.isArray(body?.submissions)) {
    return NextResponse.json({ error: "Expected photoEntries and submissions arrays." }, { status: 400 });
  }

  if (body.photoEntries.some((entry) => !text(entry?.imageUrl, 500))) {
    return NextResponse.json({ error: "Every photo entry needs an image filename, path, or URL." }, { status: 400 });
  }

  const content = {
    photoEntries: body.photoEntries.map(normalizePhoto).filter(Boolean),
    submissions: body.submissions.map(normalizeSubmission).filter(Boolean)
  };

  try {
    await putFile(STORE_PATH, content, "Update feedback via admin portal");
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, content });
}
