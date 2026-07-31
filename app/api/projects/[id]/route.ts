import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

type Props = {
  params: Promise<{ id: string }>;
};

// 1. GET: Fetch a single project by ID
export async function GET(req: Request, { params }: Props) {
  try {
    const { id } = await params; // Await params for Next.js 15+
    await connectToDatabase();

    const project = await Project.findById(id);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project, { status: 200 });
  } catch (error) {
    console.error("GET Project Error:", error);
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}

// 2. PUT: Update an existing project
export async function PUT(req: Request, { params }: Props) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as { role?: string }).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    await connectToDatabase();

    const updatedProject = await Project.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(updatedProject, { status: 200 });
  } catch (error) {
    console.error("PUT Project Error:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

// 3. DELETE: Remove a project
export async function DELETE(req: Request, { params }: Props) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as { role?: string }).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectToDatabase();

    const deletedProject = await Project.findByIdAndDelete(id);

    if (!deletedProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Project deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("DELETE Project Error:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}