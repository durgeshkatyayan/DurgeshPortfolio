import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Music from "@/models/Music";

// 1. UPDATE SONG (PUT)
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    
    // Unwrap params promise
    const { id } = await params;
    const body = await req.json();

    const updatedSong = await Music.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedSong) {
      return NextResponse.json(
        { success: false, message: "Song not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedSong });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// 2. DELETE SONG (DELETE)
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    // Unwrap params promise
    const { id } = await params;
    const deletedSong = await Music.findByIdAndDelete(id);

    if (!deletedSong) {
      return NextResponse.json(
        { success: false, message: "Song not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: deletedSong });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}