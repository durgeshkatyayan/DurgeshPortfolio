"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema, ProjectFormValues } from "@/validators/project";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function NewProjectPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
       title: "",
    description: "",
    thumbnail: "",
    images: [],
    techStack: "",
    githubUrl: "",
    liveUrl: "",
    category: "",
    featured: false,
    status: "completed",
    }
  });

  const onSubmit = async (data: ProjectFormValues) => {
    setIsSubmitting(true);
    try {
      // Convert comma-separated tech stack into an array
      const formattedData = {
        ...data,
        techStack: data.techStack.split(",").map((tech) => tech.trim()),
      };

      await axios.post("/api/projects", formattedData);
      toast.success("Project created successfully!");
      router.push("/admin/projects");
      router.refresh();
    } catch (error) {
      toast.error("Failed to create project.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-neutral-950 p-8 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
      <h1 className="text-2xl font-bold mb-6">Add New Project</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input 
            {...register("title")} 
            className="w-full p-3 rounded-md border dark:bg-neutral-900 dark:border-neutral-700"
            placeholder="E.g. E-Commerce Platform"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea 
            {...register("description")} 
            rows={4}
            className="w-full p-3 rounded-md border dark:bg-neutral-900 dark:border-neutral-700"
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <input 
              {...register("category")} 
              className="w-full p-3 rounded-md border dark:bg-neutral-900 dark:border-neutral-700"
            />
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select 
              {...register("status")} 
              className="w-full p-3 rounded-md border dark:bg-neutral-900 dark:border-neutral-700"
            >
              <option value="completed">Completed</option>
              <option value="in-progress">In Progress</option>
            </select>
          </div>
        </div>

        {/* Tech Stack */}
        <div>
          <label className="block text-sm font-medium mb-1">Tech Stack (Comma separated)</label>
          <input 
            {...register("techStack")} 
            className="w-full p-3 rounded-md border dark:bg-neutral-900 dark:border-neutral-700"
            placeholder="React, Next.js, MongoDB"
          />
          {errors.techStack && <p className="text-red-500 text-sm mt-1">{errors.techStack.message}</p>}
        </div>

        {/* URLs */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">GitHub URL</label>
            <input {...register("githubUrl")} className="w-full p-3 rounded-md border dark:bg-neutral-900 dark:border-neutral-700" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Live URL</label>
            <input {...register("liveUrl")} className="w-full p-3 rounded-md border dark:bg-neutral-900 dark:border-neutral-700" />
          </div>
        </div>

        {/* Checkbox */}
        <div className="flex items-center gap-2">
          <input type="checkbox" {...register("featured")} id="featured" className="w-5 h-5" />
          <label htmlFor="featured" className="text-sm font-medium">Feature this project on the homepage</label>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save Project"}
        </button>
      </form>
    </div>
  );
}