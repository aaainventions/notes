import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Note from "@/models/Notes"; // cleaner import path

export async function GET() {
  try {
    await connectDB();
    const notes = await Note.find().sort({ createdAt: -1 });
    return NextResponse.json(notes);
  } catch (err) {
    console.error("GET /api/notes error:", err);
    return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    
    if (!body.content || !body.date) {
      return NextResponse.json({ error: "Missing content or date" }, { status: 400 });
    }

    const note = await Note.create(body);
    return NextResponse.json(note, { status: 201 });
  } catch (err) {
    console.error("POST /api/notes error:", err);
    return NextResponse.json({ error: "Failed to create note" }, { status: 500 });
  }
}
