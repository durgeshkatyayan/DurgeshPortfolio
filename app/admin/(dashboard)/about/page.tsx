"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { Save, User, FileText, Code, Loader2 } from "lucide-react";
import Loader from "@/components/ui/Loader";

// Interface for the Form State
interface AboutForm {
  description: string;
  biography: string;
  interests: string;
  languages: string;
  resumeUrl: string;
}

export default function AdminAboutPage() {
  const { register, handleSubmit, reset } = useForm<AboutForm>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch existing data on mount
  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const { data } = await axios.get("/api/about");
        if (data && data._id) {
          reset({
            description: data.description || "",
            biography: data.biography || "",
            resumeUrl: data.resumeUrl || "",
            // Convert database arrays to comma-separated strings for the input fields
            interests: data.interests?.join(", ") || "",
            languages: data.languages?.join(", ") || "",
          });
        }
      } catch (error) {
        toast.error("Failed to load about data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAboutData();
  }, [reset]);

  const onSubmit = async (data: AboutForm) => {
    setIsSubmitting(true);
    try {
      // Format the comma-separated strings back into arrays for MongoDB
      const payload = {
        ...data,
        interests: data.interests.split(",").map((i) => i.trim()).filter(Boolean),
        languages: data.languages.split(",").map((l) => l.trim()).filter(Boolean),
      };
      
      await axios.put("/api/about", payload);
      toast.success("About section updated successfully!");
    } catch (error) {
      toast.error("Failed to update about data");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show custom loader while fetching data, perfectly centered
  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] w-full items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-4 sm:px-6 md:px-8 md:py-6 pb-24">
      
      {/* Page Header */}
      <div className="mb-6 md:mb-5 text-center md:text-left">
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
          About Me Settings
        </h1>
        <p className="mt-2 text-sm sm:text-base text-neutral-500 dark:text-neutral-400">
          Manage the introduction and personal details shown on your homepage.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Biography Section */}
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900">
          <div className="border-b border-neutral-200 bg-neutral-50/50 px-6 py-5 dark:border-neutral-800 dark:bg-neutral-950/50">
            <h2 className="flex items-center gap-2 text-lg font-bold text-neutral-900 dark:text-white">
              <FileText className="text-blue-500" size={22} /> Core Introduction
            </h2>
          </div>
          
          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                Short Description (Heading)
              </label>
              <textarea 
                {...register("description", { required: true })} 
                rows={2}
                placeholder="I'm a full-stack developer specializing in..."
                className="w-full resize-y rounded-xl border border-neutral-300 bg-transparent p-4 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-neutral-700" 
              />
              <p className="mt-2 text-xs text-neutral-500">A brief one-liner or two highlighting what you do.</p>
            </div>
            
            <div>
              <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                Detailed Biography
              </label>
              <textarea 
                {...register("biography", { required: true })} 
                rows={6}
                placeholder="Write a deeper dive into your background, passion, and journey here..."
                className="w-full resize-y rounded-xl border border-neutral-300 bg-transparent p-4 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-neutral-700" 
              />
            </div>
          </div>
        </div>

        {/* Tags & Extras Section */}
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900">
          <div className="border-b border-neutral-200 bg-neutral-50/50 px-6 py-5 dark:border-neutral-800 dark:bg-neutral-950/50">
            <h2 className="flex items-center gap-2 text-lg font-bold text-neutral-900 dark:text-white">
              <Code className="text-emerald-500" size={22} /> Skills & Extras
            </h2>
          </div>
          
          <div className="p-6 sm:p-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                Programming Languages
              </label>
              <input 
                {...register("languages")} 
                placeholder="JavaScript, TypeScript, Python, C++"
                className="w-full rounded-xl border border-neutral-300 bg-transparent p-4 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-neutral-700" 
              />
              <p className="mt-2 text-xs text-neutral-500">Comma separated values.</p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                General Interests
              </label>
              <input 
                {...register("interests")} 
                placeholder="Web3, Open Source, UI/UX Design, Cricket"
                className="w-full rounded-xl border border-neutral-300 bg-transparent p-4 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-neutral-700" 
              />
              <p className="mt-2 text-xs text-neutral-500">Comma separated values.</p>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                Resume / CV URL
              </label>
              <input 
                {...register("resumeUrl")} 
                type="url"
                placeholder="https://link-to-your-resume.pdf"
                className="w-full rounded-xl border border-neutral-300 bg-transparent p-4 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-neutral-700" 
              />
              <p className="mt-2 text-xs text-neutral-500">Direct link to your downloadable PDF.</p>
            </div>
          </div>
        </div>

        {/* Submit Button (Sticky to bottom for mobile convenience) */}
        <div className="sticky bottom-4 z-10 sm:static sm:bottom-auto">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 text-base font-bold text-white shadow-xl shadow-blue-600/20 transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-neutral-900 disabled:opacity-70 active:scale-[0.98]"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={22} />
            ) : (
              <Save size={22} />
            )}
            {isSubmitting ? "Saving About Section..." : "Save About Settings"}
          </button>
        </div>
        
      </form>
    </div>
  );
}