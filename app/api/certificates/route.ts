import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Certificate from "@/models/Certificate";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    await connectToDatabase();
    const certificates = await Certificate.find().sort({ issueDate: -1 });
    return NextResponse.json(certificates, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch certificates" }, { status: 500 });
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
    const newCertificate = await Certificate.create(body);

    return NextResponse.json(newCertificate, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add certificate" }, { status: 500 });
  }
}