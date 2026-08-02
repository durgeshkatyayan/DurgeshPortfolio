import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";
import Blog from "@/models/Blog";
import Message from "@/models/Message";
import Booking from "@/models/Booking";
import Music from "@/models/Music";
import Skill from "@/models/Skill"; // If you have a Skill model

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
    ] = await Promise.all([
      Project.countDocuments(),
      Blog.countDocuments(),
      Message.countDocuments({ isRead: false }).catch(() => 0),
      Booking.countDocuments({ status: "pending" }).catch(() => 0),
      Music.countDocuments().catch(() => 0),
      Skill.countDocuments().catch(() => 0),
      Project.find().sort({ createdAt: -1 }).limit(3).lean(),
    ]);

    // 2. Extract distinct technologies / languages used across projects
    const allProjectsTech = await Project.distinct("techStack");
    
    // Combine explicit skills model count OR distinct project technologies
    const totalTechLanguagesCount = Math.max(
      skillsModelCount,
      allProjectsTech.length
    );

    return NextResponse.json({
      projects: projectsCount,
      blogs: blogsCount,
      messages: messagesCount,
      bookings: bookingsCount,
      songs: songsCount,
      technologies: totalTechLanguagesCount,
      recentProjects,
    });
  } catch (error: any) {
    console.error("Analytics Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}