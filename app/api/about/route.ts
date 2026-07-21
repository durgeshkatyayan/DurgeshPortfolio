import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import About from "@/models/About";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    await connectToDatabase();
    const aboutData = await About.findOne();
    return NextResponse.json(aboutData || {}, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch about data" }, { status: 500 });
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
    
    let about = await About.findOne();
    
    if (about) {
      about = await About.findByIdAndUpdate(about._id, body, { new: true });
    } else {
      about = await About.create(body);
    }

    return NextResponse.json(about, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update about data" }, { status: 500 });
  }
}