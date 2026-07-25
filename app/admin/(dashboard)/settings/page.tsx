"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "@/components/ui/Loader";

interface SettingsForm {
  siteName: string;
  defaultMetaTitle: string;
  defaultMetaDescription: string;
  keywords: string;
  siteUrl: string;
  twitterHandle: string;
}

export default function AdminSettingsPage() {
  const { register, handleSubmit, reset } = useForm<SettingsForm>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get("/api/settings");
        if (data && data._id) {
          // Join array to string for input
          reset({
            ...data,
            keywords: data.keywords?.join(", ") || ""
          });
        }
      } catch (error) {
        console.error("Failed to load settings", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [reset]);

  const onSubmit = async (data: SettingsForm) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        keywords: data.keywords.split(",").map(k => k.trim()).filter(Boolean)
      };
      
      await axios.put("/api/settings", payload);
      toast.success("Global settings updated!");
    } catch (error) {
      toast.error("Failed to update settings.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <Loader />
    </div>
  );
}

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Global Site Settings</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-neutral-900 p-8 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Site Name</label>
          <input
            {...register("siteName", { required: true })}
            className="w-full p-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Canonical Production URL</label>
          <input
            {...register("siteUrl", { required: true })}
            placeholder="https://myportfolio.com"
            className="w-full p-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent"
          />
        </div>

        <hr className="border-neutral-200 dark:border-neutral-800 my-6" />
        <h2 className="text-xl font-bold mb-4">Default SEO Configuration</h2>

        <div>
          <label className="block text-sm font-medium mb-2">Default Meta Title</label>
          <input
            {...register("defaultMetaTitle", { required: true })}
            className="w-full p-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Default Meta Description</label>
          <textarea
            {...register("defaultMetaDescription", { required: true })}
            rows={3}
            className="w-full p-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Global Keywords (comma separated)</label>
          <input
            {...register("keywords")}
            placeholder="Next.js, Developer, Portfolio"
            className="w-full p-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Twitter / X Handle</label>
          <input
            {...register("twitterHandle")}
            placeholder="@yourhandle"
            className="w-full p-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition disabled:opacity-50 mt-4"
        >
          {isSubmitting ? "Saving Configuration..." : "Save Settings"}
        </button>
      </form>
    </div>
  );
}