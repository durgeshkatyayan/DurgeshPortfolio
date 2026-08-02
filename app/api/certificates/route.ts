import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Certificate from "@/models/Certificate";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Adjust this import path if your authOptions is located elsewhere

// GET: Fetch all certificates (Public - no session required)
export async function GET() {
  try {
    await connectToDatabase();
    // Sort by issue date in descending order (newest first)
    const certificates = await Certificate.find().sort({ issueDate: -1 });
    return NextResponse.json(certificates, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch certificates" }, { status: 500 });
  }
}

// POST: Create a new certificate (Admin only)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const body = await req.json();
    const newCertificate = await Certificate.create(body);
    
    return NextResponse.json(newCertificate, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add certificate" }, { status: 500 });
  }
}

// PUT: Update an existing certificate (Admin only)
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const body = await req.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json({ error: "Certificate ID is required for updating" }, { status: 400 });
    }

    const updatedCertificate = await Certificate.findByIdAndUpdate(_id, updateData, { new: true });
    
    return NextResponse.json(updatedCertificate, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update certificate" }, { status: 500 });
  }
}

// DELETE: Remove a certificate (Admin only)
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extract the ID from the query parameters (e.g., /api/certificates?id=123)
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Certificate ID is required" }, { status: 400 });
    }

    await connectToDatabase();
    await Certificate.findByIdAndDelete(id);
    
    return NextResponse.json({ message: "Certificate deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete certificate" }, { status: 500 });
  }
}