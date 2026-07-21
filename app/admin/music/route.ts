import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Music from "@/models/Music";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const playlist = searchParams.get("playlist");

    const query = playlist ? { playlist } : {};
    const tracks = await Music.find(query).sort({ createdAt: -1 });

    return NextResponse.json(tracks, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch music" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const body = await req.json();
    const newTrack = await Music.create(body);

    return NextResponse.json(newTrack, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to upload track" }, { status: 500 });
  }
}