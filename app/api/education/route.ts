import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Education from "@/models/Education";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET: Fetch all education records
export async function GET() {
  try {
    await connectToDatabase();
    const educations = await Education.find().sort({ order: 1, year: -1 });
    return NextResponse.json(educations, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch education records" }, { status: 500 });
  }
}

// POST: Create a new education record
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
    return NextResponse.json({ error: "Failed to create education record" }, { status: 500 });
  }
}

// PUT: Update an existing education record
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const body = await req.json();
    const { _id, ...updateData } = body;

    const updatedEducation = await Education.findByIdAndUpdate(_id, updateData, { new: true });
    return NextResponse.json(updatedEducation, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update education record" }, { status: 500 });
  }
}

// DELETE: Remove an education record
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    await connectToDatabase();
    await Education.findByIdAndDelete(id);
    
    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete education record" }, { status: 500 });
  }
}