import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET: Fetch bookings for Admin Dashboard
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const bookings = await Booking.find().sort({ date: 1, time: 1 });
    
    return NextResponse.json(bookings, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

// POST: Public endpoint to create a new booking request
export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    
    const newBooking = await Booking.create(body);
    
    // Optional: You can integrate lib/mail.ts here to send the Admin an email about the new booking
    
    return NextResponse.json(newBooking, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}