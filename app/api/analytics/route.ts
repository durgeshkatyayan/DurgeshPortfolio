import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";
import Blog from "@/models/Blog";
import Message from "@/models/Message";
import Booking from "@/models/Booking";
import Music from "@/models/Music";
import Skill from "@/models/Skill";
import Analytics from "@/models/Analytics"; // Import the new tracker model

export async function GET() {
  try {
    await connectToDatabase();

    // 1. Fetch counts across database collections
    const [
      projectsCount,
      blogsCount,
      messagesCount,
      bookingsCount,
      songsCount,
      skillsModelCount,
      recentProjects,
      totalPageViews, // NEW: Count total page visits
      uniqueVisitors, // NEW: Count unique visitors
    ] = await Promise.all([
      Project.countDocuments(),
      Blog.countDocuments(),
      Message.countDocuments({ isRead: false }).catch(() => 0),
      Booking.countDocuments({ status: "pending" }).catch(() => 0),
      Music.countDocuments().catch(() => 0),
      Skill.countDocuments().catch(() => 0),
      Project.find().sort({ createdAt: -1 }).limit(3).lean(),
      Analytics.countDocuments().catch(() => 0),
      Analytics.distinct("visitorId").then((ids) => ids.length).catch(() => 0),
    ]);

    // 2. Extract distinct technologies / languages used across projects
    const allProjectsTech = await Project.distinct("techStack");
    
    // Combine explicit skills model count OR distinct project technologies
    const totalTechLanguagesCount = Math.max(
      skillsModelCount,
      allProjectsTech.length
    );

    // 3. Return everything to your dashboard
    return NextResponse.json({
      projects: projectsCount,
      blogs: blogsCount,
      messages: messagesCount,
      bookings: bookingsCount,
      songs: songsCount,
      technologies: totalTechLanguagesCount,
      recentProjects,
      // Pass the new data to your admin UI
      visitorStats: {
        totalViews: totalPageViews,
        uniqueVisitors: uniqueVisitors,
      }
    });
  } catch (error: any) {
    console.error("Analytics Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}