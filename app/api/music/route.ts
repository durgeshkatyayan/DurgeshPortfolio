import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Music from "@/models/Music";

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const genre = searchParams.get("genre");

    const query = genre && genre !== "All" ? { genre } : {};
    const songs = await Music.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: songs });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// app/api/music/route.ts
export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();

    // Map incoming body keys to match Mongoose schema
    const songData = {
      songName: body.songName || body.title,
      genre: body.genre || body.category,
      artist: body.artist || "Unknown Artist",
      audioUrl: body.audioUrl,
      coverImage: body.coverImage,
      duration: body.duration,
    };

    const newSong = await Music.create(songData);
    return NextResponse.json({ success: true, data: newSong }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}