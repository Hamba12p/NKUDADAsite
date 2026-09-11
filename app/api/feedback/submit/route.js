import { NextResponse } from "next/server";
import { getFile, putFile } from "@/lib/github";

const STORE_PATH = "content/feedback.json";
const MESSAGE_LIMIT = 800;
const MIN_FORM_AGE_MS = 3000;
const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT = 3;
const ROLES = new Set(["volunteer", "partner", "other"]);
const attempts = new Map();

function clean(value, max) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function requestIp(request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") || "unknown";
}

function isRateLimited(ip, now) {
  const recent = (attempts.get(ip) || []).filter((time) => now - time < RATE_WINDOW_MS);
  attempts.set(ip, recent);
  return recent.length >= RATE_LIMIT;
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (clean(body?.website, 200)) return NextResponse.json({ ok: true });

  const now = Date.now();
  const startedAt = Number(body?.startedAt);
  if (!Number.isFinite(startedAt) || now - startedAt < MIN_FORM_AGE_MS || now - startedAt > 24 * 60 * 60 * 1000) {
    return NextResponse.json({ error: "Please take a moment before submitting." }, { status: 400 });
  }

  const ip = requestIp(request);
  if (isRateLimited(ip, now)) {
    return NextResponse.json({ error: "Too many submissions. Please try again later." }, { status: 429 });
  }

  const rawMessage = typeof body?.message === "string" ? body.message.trim() : "";
  if (!rawMessage) return NextResponse.json({ error: "Please enter a message." }, { status: 400 });
  if (rawMessage.length > MESSAGE_LIMIT) {
    return NextResponse.json({ error: `Please keep your message under ${MESSAGE_LIMIT} characters.` }, { status: 400 });
  }

  const anonymous = Boolean(body?.anonymous);
  const submission = {
    id: crypto.randomUUID(),
    message: rawMessage,
    name: anonymous ? "" : clean(body?.name, 120),
    anonymous,
    role: ROLES.has(body?.role) ? body.role : "other",
    approved: false,
    featuredOnHomepage: false,
    submittedAt: new Date(now).toISOString()
  };

  try {
    const existing = await getFile(STORE_PATH);
    const content = existing ? JSON.parse(existing.content) : { photoEntries: [], submissions: [] };
    const next = {
      photoEntries: Array.isArray(content?.photoEntries) ? content.photoEntries : [],
      submissions: [...(Array.isArray(content?.submissions) ? content.submissions : []), submission]
    };
    await putFile(STORE_PATH, next, "Add feedback submission for review");
    attempts.set(ip, [...(attempts.get(ip) || []), now]);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Feedback persistence failed:", error);
    return NextResponse.json({ error: "Unable to save your feedback right now. Please try again." }, { status: 500 });
  }
}
