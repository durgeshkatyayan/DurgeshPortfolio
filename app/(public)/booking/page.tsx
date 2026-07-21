"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { CalendarDays, Clock, Video } from "lucide-react";

interface BookingFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  date: string;
  time: string;
  purpose: string;
}

export default function BookingPage() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<BookingFormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    try {
      await axios.post("/api/bookings", data);
      toast.success("Meeting request sent! I will confirm shortly.");
      reset();
    } catch (error) {
      toast.error("Failed to request meeting. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-white py-24 px-6 max-w-4xl mx-auto relative z-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Book a Discovery Call</h1>
        <p className="text-neutral-400">Select a date and time to discuss your project, consulting, or collaboration.</p>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-neutral-300">Full Name</label>
              <input
                {...register("name", { required: "Name is required" })}
                className="w-full p-4 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-blue-500 outline-none transition"
              />
              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-neutral-300">Email Address</label>
              <input
                type="email"
                {...register("email", { required: "Email is required" })}
                className="w-full p-4 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-blue-500 outline-none transition"
              />
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-neutral-300">Phone (Optional)</label>
              <input
                {...register("phone")}
                className="w-full p-4 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-blue-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-neutral-300">Company (Optional)</label>
              <input
                {...register("company")}
                className="w-full p-4 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-blue-500 outline-none transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className=" text-sm font-medium mb-2 text-neutral-300 flex items-center gap-2">
                <CalendarDays size={16} /> Preferred Date
              </label>
              <input
                type="date"
                {...register("date", { required: "Date is required" })}
                className="w-full p-4 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-blue-500 outline-none transition"
              />
              {errors.date && <p className="text-red-400 text-sm mt-1">{errors.date.message}</p>}
            </div>

            <div>
              <label className=" text-sm font-medium mb-2 text-neutral-300 flex items-center gap-2">
                <Clock size={16} /> Preferred Time
              </label>
              <input
                type="time"
                {...register("time", { required: "Time is required" })}
                className="w-full p-4 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-blue-500 outline-none transition "
              />
              {errors.time && <p className="text-red-400 text-sm mt-1">{errors.time.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-neutral-300">Purpose of Meeting</label>
            <textarea
              {...register("purpose", { required: "Please briefly describe the purpose" })}
              rows={4}
              className="w-full p-4 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-blue-500 outline-none transition resize-none"
              placeholder="e.g., Discussing a freelance project, hiring inquiry, etc."
            />
            {errors.purpose && <p className="text-red-400 text-sm mt-1">{errors.purpose.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Video size={20} />
            {isSubmitting ? "Submitting Request..." : "Request Meeting"}
          </button>
        </form>
      </div>
    </main>
  );
}