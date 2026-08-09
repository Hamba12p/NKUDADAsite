import { NextResponse } from "next/server";
import { putFile } from "@/lib/github";

// Only these fields are ever written to the repo. This is deliberate:
// health notes and consent status are treated as local/exportable-only data
// and must never reach a committed file, even if a client sends extra keys.
const ALLOWED_FIELDS = ["id", "name", "gender", "age", "school", "addedAt"];

function sanitizeStudent(raw) {
  const clean = {};
  for (const key of ALLOWED_FIELDS) {
    clean[key] = typeof raw?.[key] === "string" || typeof raw?.[key] === "number" ? raw[key] : "";
  }
  return clean;
}

export async function PUT(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!Array.isArray(body?.students)) {
    return NextResponse.json({ error: "Expected a 'students' array." }, { status: 400 });
  }

  const content = { students: body.students.map(sanitizeStudent) };

  try {
    await putFile("content/outreach.json", content, "Update outreach roll call via admin portal");
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, saved: content.students.length });
}
