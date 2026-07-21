"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Send, MapPin, Mail, Phone } from "lucide-react";

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
    <main className="min-h-screen bg-neutral-950 text-white py-24 px-6 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4">Get in Touch</h1>
        <p className="text-neutral-400 text-lg">Have a project in mind or just want to say hi? Send me a message.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Information */}
        <div className="space-y-8 bg-neutral-900 p-8 rounded-2xl border border-neutral-800">
          <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
          
          <div className="flex items-center gap-4">
            <div className="p-4 bg-blue-500/10 rounded-full text-blue-400">
              <Mail size={24} />
            </div>
            <div>
              <p className="text-sm text-neutral-400">Email</p>
              <p className="text-lg font-medium">hello@yourportfolio.com</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-4 bg-emerald-500/10 rounded-full text-emerald-400">
              <Phone size={24} />
            </div>
            <div>
              <p className="text-sm text-neutral-400">Phone / WhatsApp</p>
              <p className="text-lg font-medium">+1 (555) 123-4567</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-4 bg-purple-500/10 rounded-full text-purple-400">
              <MapPin size={24} />
            </div>
            <div>
              <p className="text-sm text-neutral-400">Location</p>
              <p className="text-lg font-medium">San Francisco, CA</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-neutral-900 p-8 rounded-2xl border border-neutral-800">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-neutral-300">Your Name</label>
              <input
                {...register("name", { required: "Name is required" })}
                className="w-full p-4 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-blue-500 outline-none transition"
                placeholder="John Doe"
              />
              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-neutral-300">Email Address</label>
                <input
                  type="email"
                  {...register("email", { required: "Email is required" })}
                  className="w-full p-4 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-blue-500 outline-none transition"
                  placeholder="john@example.com"
                />
                {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-neutral-300">Phone (Optional)</label>
                <input
                  {...register("phone")}
                  className="w-full p-4 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-blue-500 outline-none transition"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-neutral-300">Message</label>
              <textarea
                {...register("message", { required: "Message is required" })}
                rows={5}
                className="w-full p-4 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-blue-500 outline-none transition resize-none"
                placeholder="How can I help you?"
              />
              {errors.message && <p className="text-red-400 text-sm mt-1">{errors.message.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}