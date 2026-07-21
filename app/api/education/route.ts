import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Education from "@/models/Education";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    await connectToDatabase();
    const education = await Education.find().sort({ order: 1, year: -1 });
    return NextResponse.json(education, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch education records" }, { status: 500 });
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
    const newEducation = await Education.create(body);

    return NextResponse.json(newEducation, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add education record" }, { status: 500 });
  }
}