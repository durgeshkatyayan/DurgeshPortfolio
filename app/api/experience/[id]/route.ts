import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Experience from "@/models/Experience";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Update Experience
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const body = await req.json();

    const { id } = await params;

    const updatedExperience = await Experience.findByIdAndUpdate(
      id,
      body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedExperience) {
      return NextResponse.json(
        { error: "Experience not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedExperience);
  } catch (error) {
    console.error("PUT Error:", error);

    return NextResponse.json(
      { error: "Failed to update experience" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectToDatabase();

  const { id } = await params;

  const deletedExperience = await Experience.findByIdAndDelete(id);

  if (!deletedExperience) {
    return NextResponse.json(
      { error: "Experience not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(
    { message: "Experience deleted successfully" },
    { status: 200 }
  );
}