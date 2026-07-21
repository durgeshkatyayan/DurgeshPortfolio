"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { FolderKanban, FileText, Mail, Calendar } from "lucide-react";

interface AnalyticsData {
  projects: number;
  blogs: number;
  messages: number;
  bookings: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await axios.get("/api/analytics");
        setStats(data);
      } catch (error) {
        console.error("Failed to load analytics", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="animate-pulse space-y-4">
      <div className="h-8 bg-neutral-200 dark:bg-neutral-800 w-1/4 rounded"></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-neutral-200 dark:bg-neutral-800 rounded-xl"></div>
        ))}
      </div>
    </div>;
  }

  const statCards = [
    { title: "Total Projects", value: stats?.projects, icon: <FolderKanban size={24} className="text-blue-500" /> },
    { title: "Total Blogs", value: stats?.blogs, icon: <FileText size={24} className="text-emerald-500" /> },
    { title: "Unread Messages", value: stats?.messages, icon: <Mail size={24} className="text-rose-500" /> },
    { title: "Pending Bookings", value: stats?.bookings, icon: <Calendar size={24} className="text-amber-500" /> },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-neutral-900 dark:text-white">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div 
            key={index} 
            className="bg-white dark:bg-neutral-950 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center justify-between transition hover:-translate-y-1"
          >
            <div>
              <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{card.title}</p>
              <h2 className="text-3xl font-bold mt-2 text-neutral-900 dark:text-white">{card.value}</h2>
            </div>
            <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-full">
              {card.icon}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}