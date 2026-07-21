import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Hero from "@/models/Hero";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    await connectToDatabase();
    const heroData = await Hero.findOne();
    return NextResponse.json(heroData || {}, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch hero data" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const body = await req.json();
    
    // Find the first document and update it, or create if it doesn't exist (upsert)
    let hero = await Hero.findOne();
    
    if (hero) {
      hero = await Hero.findByIdAndUpdate(hero._id, body, { new: true });
    } else {
      hero = await Hero.create(body);
    }

    return NextResponse.json(hero, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update hero data" }, { status: 500 });
  }
}