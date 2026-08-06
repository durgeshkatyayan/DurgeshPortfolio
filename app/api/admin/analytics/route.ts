import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Analytics from "@/models/Analytics";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    // 1. Authenticate Admin
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    // 2. Fetch Aggregated Overview (Totals, Averages, Bounce Rate)
    const overviewData = await Analytics.aggregate([
      {
        $group: {
          _id: null,
          totalViews: { $sum: 1 },
          uniqueVisitors: { $addToSet: "$visitorId" },
          avgDuration: { $avg: "$duration" },
          totalBounces: { $sum: { $cond: ["$isBounce", 1, 0] } }
        }
      }
    ]);

    const stats = overviewData[0] || { totalViews: 0, uniqueVisitors: [], avgDuration: 0, totalBounces: 0 };
    const uniqueVisitorCount = stats.uniqueVisitors.length;
    const bounceRate = stats.totalViews > 0 ? Math.round((stats.totalBounces / stats.totalViews) * 100) : 0;
    const avgTime = Math.round(stats.avgDuration || 0);

    // 3. Fetch Top Pages
    const topPages = await Analytics.aggregate([
      { $group: { _id: "$path", views: { $sum: 1 } } },
      { $sort: { views: -1 } },
      { $limit: 5 }
    ]);

    // 4. Fetch Top Browsers & OS
    const topBrowsers = await Analytics.aggregate([
      { $group: { _id: "$browser", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    const topOS = await Analytics.aggregate([
      { $group: { _id: "$os", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // 5. Fetch Recent Visitor Logs
    const recentLogs = await Analytics.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("-__v -clicks") // Exclude clicks array for lighter payload
      .lean();

    return NextResponse.json({
      overview: {
        totalViews: stats.totalViews,
        uniqueVisitors: uniqueVisitorCount,
        bounceRate,
        avgTime
      },
      topPages,
      topBrowsers,
      topOS,
      recentLogs
    }, { status: 200 });

  } catch (error: any) {
    console.error("Admin Analytics Error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics data" }, { status: 500 });
  }
}