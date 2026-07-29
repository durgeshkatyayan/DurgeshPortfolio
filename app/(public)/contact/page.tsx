"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Mail, Loader2 } from "lucide-react";
import Image from "next/image";

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export default function ContactPage() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      await axios.post("/api/messages", data);
      toast.success("Message sent successfully! I will get back to you soon.");
      reset();
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // <main className="min-h-screen bg-[#0a0a0a] text-white px-2 md:px-0 flex  justify-center">
    <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 px-2 gap-6 md:px-0 lg:gap-8 items-center">


      <div className="flex flex-col justify-center max-w-lg">
        {/* Top Icon */}
        <div className="w-12 h-12 bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-xl border border-neutral-700/50 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(59,130,246,0.15)] relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-500/10" />
          <Mail className="text-blue-500 relative z-10" size={20} />
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold mb-3 tracking-tight text-neutral-100">
          Contact me
        </h1>

        <p className="text-neutral-400 text-sm md:text-base leading-relaxed mb-4">
          I am always looking for ways to improve my skills and take on new challenges.
          Contact me and let's discuss how we can build something great together.
        </p>

        {/* Inline Contact Info */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-400 font-medium mb-8">
          <a href="mailto:durgeshkatyayan@gmail.com" className="hover:text-white transition">
            contact@durgeshkatyayan.tech
          </a>
          <span className="text-neutral-700">•</span>
          <a href="tel:+918934902552" className="hover:text-white transition">
            +91 8934902552
          </a>
          <span className="text-neutral-700">•</span>
          <span className="hover:text-white transition cursor-default">
            Kanpur, India
          </span>
        </div>

        <div className="relative w-full h-48 md:h-64 rounded-xl flex items-center justify-center opacity-80">

          <Image
            className="object-contain opacity-30"
            src="../../world.svg"
            alt="World"
            // width={100}
            // height={100}
            fill
          />

          {/* Glowing Marker */}
          <div className="relative z-10 flex flex-col items-center bottom-16 left-4 md:left-11 md:bottom-18 translate-x-12 translate-y-4">
            <div className="px-3 py-1 bg-neutral-900 border border-neutral-700 rounded-full text-xs font-medium text-neutral-200 mb-2 shadow-lg">
              We are here
            </div>
            <div className="w-[1px] h-12 bg-gradient-to-b from-blue-400 to-transparent relative">
              <div className="absolute top-0 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.8)]" />
            </div>
            {/* <div className="w-16 h-4 bg-blue-500/20 blur-xl rounded-full absolute bottom-[-10px]" /> */}
            <div className="relative mt-[-2px] flex items-center justify-center">
              <div className="absolute w-16 h-16 rounded-full border border-cyan-400/30 animate-ping" />
              <div className="absolute w-12 h-12 rounded-full border border-cyan-400/40 animate-pulse" />
              <div className="absolute w-20 h-8 rounded-full bg-cyan-500/30 blur-xl" />
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_20px_6px_rgba(34,211,238,0.9)]" />
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Contact Form */}
      <div className="relative bg-[#111113] p-6 md:p-10 rounded-[32px] border border-neutral-800/60 shadow-2xl overflow-hidden">

        {/* Subtle Grid Pattern Overlay (Top Right) */}
        <div
          className="absolute top-0 right-0 w-64 h-64 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            maskImage: 'radial-gradient(circle at top right, black, transparent)'
          }}
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 relative z-10">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium mb-2 text-neutral-200">Full name</label>
            <input
              {...register("name", { required: "Name is required" })}
              className="w-full p-3.5 rounded-xl bg-[#18181b] border border-transparent focus:border-neutral-700 focus:bg-[#1f1f22] text-sm outline-none transition-all placeholder:text-neutral-600"
              placeholder="Durgesh Katyayan"
            />
            {errors.name && <p className="text-red-400 text-xs mt-1.5">{errors.name.message}</p>}
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-sm font-medium mb-2 text-neutral-200">Email Address</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full p-3.5 rounded-xl bg-[#18181b] border border-transparent focus:border-neutral-700 focus:bg-[#1f1f22] text-sm outline-none transition-all placeholder:text-neutral-600"
              placeholder="contact@durgeshkatyayan.tech"
            />
            {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email.message}</p>}
          </div>

          {/* Phone (Matching Company style in reference) */}
          <div>
            <label className="block text-sm font-medium mb-2 text-neutral-200">Phone</label>
            <input
              {...register("phone")}
              className="w-full p-3.5 rounded-xl bg-[#18181b] border border-transparent focus:border-neutral-700 focus:bg-[#1f1f22] text-sm outline-none transition-all placeholder:text-neutral-600"
              placeholder="+91 8934902552"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium mb-2 text-neutral-200">Message</label>
            <textarea
              {...register("message", { required: "Message is required" })}
              rows={5}
              className="w-full p-3.5 rounded-xl bg-[#18181b] border border-transparent focus:border-neutral-700 focus:bg-[#1f1f22] text-sm outline-none transition-all resize-none placeholder:text-neutral-600"
              placeholder="Type your message here"
            />
            {errors.message && <p className="text-red-400 text-xs mt-1.5">{errors.message.message}</p>}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-neutral-800 hover:bg-neutral-700 text-neutral-100 font-medium py-3 px-8 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>
      </div>

    </div>
    // </main>
  );
}