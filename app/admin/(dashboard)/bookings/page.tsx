"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { CalendarDays, Clock, Video, Building2 } from "lucide-react";

interface Booking {
  _id: string;
  name: string;
  email: string;
  company?: string;
  date: string;
  time: string;
  purpose: string;
  status: "pending" | "accepted" | "rejected" | "cancelled" | "completed";
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await axios.get("/api/bookings");
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await axios.patch(`/api/bookings/${id}`, { status: newStatus });
      toast.success(`Booking marked as ${newStatus}`);
      fetchBookings(); // Refresh list
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const statusColors: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-500",
    accepted: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-500",
    rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-500",
    cancelled: "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400",
    completed: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-500",
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Meeting Requests</h1>

      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="h-40 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {bookings.map((booking) => (
            <div key={booking._id} className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">{booking.name}</h3>
                  <a href={`mailto:${booking.email}`} className="text-blue-500 text-sm hover:underline">{booking.email}</a>
                  {booking.company && (
                    <p className="text-xs text-neutral-500 flex items-center gap-1 mt-1">
                      <Building2 size={12} /> {booking.company}
                    </p>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${statusColors[booking.status]}`}>
                  {booking.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-neutral-50 dark:bg-neutral-950 p-4 rounded-lg mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <CalendarDays size={16} className="text-neutral-400" />
                  <span className="font-medium">{new Date(booking.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock size={16} className="text-neutral-400" />
                  <span className="font-medium">{booking.time}</span>
                </div>
              </div>

              <div className="mb-6 flex-grow">
                <h4 className="text-xs font-semibold uppercase text-neutral-400 mb-2 flex items-center gap-1">
                  <Video size={14} /> Purpose of Meeting
                </h4>
                <p className="text-sm text-neutral-700 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-950 p-3 rounded border border-neutral-200 dark:border-neutral-800">
                  {booking.purpose}
                </p>
              </div>

              {/* Action Buttons */}
              {booking.status === "pending" && (
                <div className="flex gap-3 mt-auto">
                  <button 
                    onClick={() => updateStatus(booking._id, "accepted")}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg text-sm font-bold transition"
                  >
                    Accept
                  </button>
                  <button 
                    onClick={() => updateStatus(booking._id, "rejected")}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm font-bold transition"
                  >
                    Reject
                  </button>
                </div>
              )}
              {booking.status === "accepted" && (
                <button 
                  onClick={() => updateStatus(booking._id, "completed")}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-bold transition mt-auto"
                >
                  Mark as Completed
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}