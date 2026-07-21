import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";
import Blog from "@/models/Blog";
import Message from "@/models/Message";
import Booking from "@/models/Booking";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const [
      totalProjects,
      totalBlogs,
      unreadMessages,
      pendingBookings
    ] = await Promise.all([
      Project.countDocuments(),
      Blog.countDocuments(),
      Message.countDocuments({ isRead: false }),
      Booking.countDocuments({ status: "pending" })
    ]);

    return NextResponse.json({
      projects: totalProjects,
      blogs: totalBlogs,
      messages: unreadMessages,
      bookings: pendingBookings
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}