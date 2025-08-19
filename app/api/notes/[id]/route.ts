import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import Note from "../../../../models/Notes";

type Context = {
  params: { id: string };
};

export async function GET(_req: Request, { params }: Context) {
  await connectDB();
  const note = await Note.findById(params.id);

  if (!note) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }

  return NextResponse.json(note);
}

export async function PUT(req: Request, { params }: Context) {
  await connectDB();
  const body = await req.json();
  const note = await Note.findByIdAndUpdate(params.id, body, { new: true });

  if (!note) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }

  return NextResponse.json(note);
}

export async function DELETE(_req: Request, { params }: Context) {
  await connectDB();
  const deleted = await Note.findByIdAndDelete(params.id);

  if (!deleted) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}

export async function PATCH(req: Request, { params }: Context) {
  await connectDB();
  const updates = await req.json();
  const note = await Note.findByIdAndUpdate(params.id, updates, { new: true });

  if (!note) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }

  return NextResponse.json(note);
}
