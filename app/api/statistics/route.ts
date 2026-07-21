import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Statistic from "@/models/Statistic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    await connectToDatabase();
    const stats = await Statistic.find().sort({ order: 1 });
    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch statistics" }, { status: 500 });
  }
}