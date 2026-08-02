"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import {
  FolderKanban,
  FileText,
  Mail,
  Calendar,
  Music,
  Code2,
  ExternalLink,
  ArrowRight,
  Plus,
} from "lucide-react";

interface ProjectItem {
  _id: string;
  title: string;
  description: string;
  category?: string;
  techStack?: string[];
  liveUrl?: string;
}

interface AnalyticsData {
  projects: number;
  blogs: number;
  messages: number;
  bookings: number;
  songs: number;
  skills: number;
  recentProjects?: ProjectItem[];
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
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-9 bg-neutral-200 dark:bg-neutral-800 w-48 rounded-lg" />
        
        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-28 bg-neutral-200 dark:bg-neutral-800 rounded-xl"
            />
          ))}
        </div>

        {/* Projects Skeleton */}
        <div className="space-y-4 pt-4">
          <div className="h-6 bg-neutral-200 dark:bg-neutral-800 w-36 rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-44 bg-neutral-200 dark:bg-neutral-800 rounded-xl"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Projects",
      value: stats?.projects ?? 0,
      icon: <FolderKanban size={22} className="text-blue-500" />,
      href: "/admin/projects",
    },
    {
      title: "Total Blogs",
      value: stats?.blogs ?? 0,
      icon: <FileText size={22} className="text-emerald-500" />,
      href: "/admin/blogs",
    },
    {
      title: "Unread Messages",
      value: stats?.messages ?? 0,
      icon: <Mail size={22} className="text-rose-500" />,
      href: "/admin/messages",
    },
    {
      title: "Pending Bookings",
      value: stats?.bookings ?? 0,
      icon: <Calendar size={22} className="text-amber-500" />,
      href: "/admin/dashboard",
    },
    {
      title: "Total Songs",
      value: stats?.songs ?? 0,
      icon: <Music size={22} className="text-indigo-500" />,
      href: "/admin/music",
    },
    {
      title: "Skills & Tech",
      value: stats?.skills ?? 0,
      icon: <Code2 size={22} className="text-cyan-500" />,
      href: "/admin/skills",
    },
  ];

  return (
    <div className="space-y-10">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Overview of your portfolio analytics and recent work.
          </p>
        </div>

        <Link
          href="/admin/projects"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium rounded-xl transition shadow-lg shadow-blue-600/20 self-start sm:self-auto"
        >
          <Plus size={16} /> Manage Projects
        </Link>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
        {statCards.map((card, index) => (
          <Link
            key={index}
            href={card.href}
            className="group bg-white dark:bg-neutral-950 p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center justify-between transition hover:-translate-y-1 hover:border-neutral-300 dark:hover:border-neutral-700"
          >
            <div>
              <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                {card.title}
              </p>
              <h2 className="text-2xl font-bold mt-1 text-neutral-900 dark:text-white">
                {card.value}
              </h2>
            </div>
            <div className="p-3 bg-neutral-100 dark:bg-neutral-900 rounded-xl group-hover:scale-105 transition-transform">
              {card.icon}
            </div>
          </Link>
        ))}
      </div>

      {/* Projects Section */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderKanban className="text-blue-500" size={20} />
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white">
              Projects Overview
            </h2>
          </div>
          <Link
            href="/admin/projects"
            className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {stats?.recentProjects && stats.recentProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.recentProjects.map((project) => (
              <div
                key={project._id}
                className="bg-white dark:bg-neutral-950 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-700 transition"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-md border border-blue-200 dark:border-blue-900">
                      {project.category || "Project"}
                    </span>
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition"
                        title="Live Demo"
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-neutral-900 dark:text-white truncate">
                    {project.title}
                  </h3>

                  <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">
                    {project.description}
                  </p>
                </div>

                {project.techStack && project.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-4 mt-2 border-t border-neutral-100 dark:border-neutral-900">
                    {project.techStack.slice(0, 4).map((tech, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-medium bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 px-2 py-0.5 rounded-md"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.techStack.length > 4 && (
                      <span className="text-[10px] font-medium bg-neutral-100 dark:bg-neutral-900 text-neutral-500 px-1.5 py-0.5 rounded-md">
                        +{project.techStack.length - 4}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 p-8 text-center text-neutral-500 dark:text-neutral-400 space-y-3">
            <FolderKanban size={32} className="mx-auto text-neutral-400" />
            <p className="text-sm font-medium">No projects added yet.</p>
            <Link
              href="/admin/projects"
              className="inline-block text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              + Create your first project
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}