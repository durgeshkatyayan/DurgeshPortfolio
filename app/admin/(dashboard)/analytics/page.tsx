"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { 
  Activity, Users, Clock, MousePointerClick, 
  Monitor, Globe, Compass, ArrowUpRight 
} from "lucide-react";
import Loader from "@/components/ui/Loader";

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get("/api/admin/analytics");
        setData(res.data);
      } catch (error) {
        console.error("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="flex min-h-[70vh] items-center justify-center"><Loader /></div>;
  }

  if (!data) return <div className="p-8 text-neutral-400">Failed to load data.</div>;

  const { overview, topPages, topBrowsers, topOS, recentLogs } = data;

  // Helper function to format seconds into MM:SS
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-8 py-8 pb-24 text-white">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2 flex items-center gap-3">
          <Activity className="text-blue-500" size={32} />
          Traffic & Analytics
        </h1>
        <p className="text-neutral-400 text-sm">Monitor user behavior, page views, and engagement metrics.</p>
      </div>

      {/* 1. Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Total Page Views", value: overview.totalViews, icon: Globe, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Unique Visitors", value: overview.uniqueVisitors, icon: Users, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Avg. Time on Site", value: formatTime(overview.avgTime), icon: Clock, color: "text-purple-500", bg: "bg-purple-500/10" },
          { label: "Avg. Bounce Rate", value: `${overview.bounceRate}%`, icon: MousePointerClick, color: "text-rose-500", bg: "bg-rose-500/10" }
        ].map((stat, i) => (
          <div key={i} className="bg-[#111113] rounded-2xl border border-neutral-800/60 p-6 flex items-center gap-5 shadow-sm">
            <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-400 mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* 2. Top Metrics (Pages, Browsers, OS) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Top Pages */}
        <div className="bg-[#111113] rounded-2xl border border-neutral-800/60 p-6 shadow-sm lg:col-span-1">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Compass className="text-neutral-400" size={18} /> Top Pages
          </h3>
          <div className="space-y-4">
            {topPages.map((page: any, i: number) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-neutral-300 truncate pr-4">{page._id}</span>
                  <span className="text-white font-bold">{page.views}</span>
                </div>
                <div className="w-full bg-neutral-900 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-blue-500 h-1.5 rounded-full" 
                    style={{ width: `${(page.views / overview.totalViews) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Browsers */}
        <div className="bg-[#111113] rounded-2xl border border-neutral-800/60 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Globe className="text-neutral-400" size={18} /> Browsers
          </h3>
          <div className="space-y-4">
            {topBrowsers.map((b: any, i: number) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-neutral-800/50 last:border-0">
                <span className="text-neutral-300 text-sm">{b._id || "Unknown"}</span>
                <span className="text-white font-bold text-sm bg-neutral-800 px-3 py-1 rounded-lg">{b.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top OS */}
        <div className="bg-[#111113] rounded-2xl border border-neutral-800/60 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Monitor className="text-neutral-400" size={18} /> Operating Systems
          </h3>
          <div className="space-y-4">
            {topOS.map((os: any, i: number) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-neutral-800/50 last:border-0">
                <span className="text-neutral-300 text-sm">{os._id || "Unknown"}</span>
                <span className="text-white font-bold text-sm bg-neutral-800 px-3 py-1 rounded-lg">{os.count}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 3. Recent Logs Table */}
      <div className="bg-[#111113] rounded-2xl border border-neutral-800/60 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-neutral-800/60">
          <h3 className="text-lg font-bold text-white">Recent Visitor Activity</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-900/50 text-neutral-400">
              <tr>
                <th className="px-6 py-4 font-semibold">Path / Entry</th>
                <th className="px-6 py-4 font-semibold">System / Browser</th>
                <th className="px-6 py-4 font-semibold">Time Spent</th>
                <th className="px-6 py-4 font-semibold">Scroll Depth</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/50">
              {recentLogs.map((log: any) => (
                <tr key={log._id} className="hover:bg-neutral-900/30 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-medium text-white block mb-1">{log.path}</span>
                    <span className="text-xs text-neutral-500">
                      {new Date(log.createdAt).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-neutral-300">
                    <span className="block mb-1">{log.os || "Unknown OS"}</span>
                    <span className="text-xs text-neutral-500">{log.browser} • {log.device}</span>
                  </td>
                  <td className="px-6 py-4 text-neutral-300">
                    {formatTime(log.duration)}
                  </td>
                  <td className="px-6 py-4 text-neutral-300">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${log.scrollDepth}%` }} />
                      </div>
                      <span className="text-xs">{log.scrollDepth}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {log.isBounce ? (
                      <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-500 rounded-full">
                        Bounced
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 rounded-full">
                        Engaged
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {recentLogs.length === 0 && (
          <div className="p-8 text-center text-neutral-500">No recent visitor logs found.</div>
        )}
      </div>

    </div>
  );
}