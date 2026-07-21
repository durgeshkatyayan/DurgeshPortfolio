import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Meetup from "@/models/Meetup";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    await connectToDatabase();
    const meetups = await Meetup.find().sort({ date: -1 });
    return NextResponse.json(meetups, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch meetups" }, { status: 500 });
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
    const newMeetup = await Meetup.create(body);

    return NextResponse.json(newMeetup, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add meetup" }, { status: 500 });
  }
}