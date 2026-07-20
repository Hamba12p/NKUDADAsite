import { NextResponse } from "next/server";
import { putFile } from "@/lib/github";

export async function PUT(request) {
  let content;
  try {
    content = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  try {
    await putFile("content/gallery.json", content, "Update gallery content via admin portal");
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
