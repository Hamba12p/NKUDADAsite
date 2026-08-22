import { NextResponse } from "next/server";
import { getFile, putFile } from "@/lib/github";

const STORE_PATH = "content/school-signups.json";
const MAX_LENGTH = 200;

function cleanString(value) {
  return typeof value === "string" ? value.trim().slice(0, MAX_LENGTH) : "";
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (cleanString(body?._gotcha)) {
    return NextResponse.json({ ok: true });
  }

  const schoolName = cleanString(body?.schoolName);
  const contactPerson = cleanString(body?.contactPerson);
  const contact = cleanString(body?.contact);
  const studentCount = cleanString(body?.studentCount);
  const preferredDates = cleanString(body?.preferredDates);

  if (!schoolName || !contactPerson || !contact || !studentCount || !preferredDates) {
    return NextResponse.json({ error: "Required school sign-up fields are missing." }, { status: 400 });
  }

  try {
    const existing = await getFile(STORE_PATH);
    const content = existing ? JSON.parse(existing.content) : { signups: [] };
    const signups = Array.isArray(content?.signups) ? content.signups : [];
    const signup = {
      id: crypto.randomUUID(),
      schoolName,
      contactPerson,
      contact,
      studentCount,
      preferredDates,
      addedAt: new Date().toISOString()
    };

    await putFile(
      STORE_PATH,
      { signups: [...signups, signup] },
      `Add school visit request: ${schoolName}`
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("School sign-up persistence failed:", error);
    return NextResponse.json({ error: "Unable to save the school visit request." }, { status: 500 });
  }
}
