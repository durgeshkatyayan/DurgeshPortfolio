import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Analytics from "@/models/Analytics"; // Ensure you created this model from the previous step

// POST: Handle initial page load
export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const newRecord = await Analytics.create(body);
    return NextResponse.json(newRecord, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to log analytics" }, { status: 500 });
  }
}

// PUT: Handle page exit (update duration, scroll, clicks, bounce)
export async function PUT(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { pageViewId, duration, scrollDepth, clicks, isBounce } = body;

    if (!pageViewId) {
      return NextResponse.json({ error: "Missing pageViewId" }, { status: 400 });
    }

    const updatedRecord = await Analytics.findOneAndUpdate(
      { pageViewId },
      { $set: { duration, scrollDepth, clicks, isBounce } },
      { new: true }
    );

    return NextResponse.json(updatedRecord, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update analytics" }, { status: 500 });
  }
}