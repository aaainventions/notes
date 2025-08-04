import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Note from "@/models/Notes";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const note = await Note.findById(params.id);

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json(note);
  } catch (err) {
    console.error(`GET /api/notes/${params.id} error:`, err);
    return NextResponse.json({ error: "Failed to fetch note" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const body = await req.json();

    const note = await Note.findByIdAndUpdate(params.id, body, { new: true });

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json(note);
  } catch (err) {
    console.error(`PUT /api/notes/${params.id} error:`, err);
    return NextResponse.json({ error: "Failed to update note" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const deleted = await Note.findByIdAndDelete(params.id);

    if (!deleted) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(`DELETE /api/notes/${params.id} error:`, err);
    return NextResponse.json({ error: "Failed to delete note" }, { status: 500 });
  }
}
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const updates = await req.json();
  const note = await Note.findByIdAndUpdate(params.id, updates, { new: true });
  return NextResponse.json(note);
}

