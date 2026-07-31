"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema, ProjectFormValues } from "@/validators/project";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Save,
  ArrowLeft,
  Layout,
  Link as LinkIcon,
  Settings,
  Image as ImageIcon,
  UploadCloud,
  Loader2,
  Code,
} from "lucide-react";

export default function ProjectFormPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | undefined; // Get ID if editing
  const isEditing = Boolean(id);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingProject, setIsLoadingProject] = useState(isEditing);

  // 1. Initialize useForm FIRST so reset and setValue are available
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<ProjectFormValues>({
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
    },
  });

  // 2. Fetch existing project details if editing
  useEffect(() => {
    if (!id) return;

    async function fetchProject() {
      try {
        setIsLoadingProject(true);
        const { data } = await axios.get(`/api/projects/${id}`);

        reset({
          title: data.title || "",
          description: data.description || "",
          category: data.category || "",
          techStack: Array.isArray(data.techStack) ? data.techStack.join(", ") : data.techStack || "",
          githubUrl: data.githubUrl || "",
          liveUrl: data.liveUrl || "",
          thumbnail: data.thumbnail || "",
          featured: Boolean(data.featured),
          status: data.status || "completed",
        });
      } catch (error) {
        toast.error("Failed to load project details");
        console.error("Error fetching project:", error);
      } finally {
        setIsLoadingProject(false);
      }
    }

    fetchProject();
  }, [id, reset]);

  const thumbnailPreview = watch("thumbnail");

  // Handle Image Upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await axios.post("/api/upload", formData);
      setValue("thumbnail", data.url, { shouldValidate: true });
      toast.success("Thumbnail uploaded successfully!");
    } catch (error) {
      toast.error("Failed to upload thumbnail");
    } finally {
      setIsUploading(false);
    }
  };

  // 3. Dynamic submit handler (Handles POST for new, PUT for update)
  const onSubmit = async (data: ProjectFormValues) => {
    setIsSubmitting(true);
    try {
      const formattedData = {
        ...data,
        techStack: typeof data.techStack === "string"
          ? data.techStack.split(",").map((tech) => tech.trim()).filter(Boolean)
          : data.techStack,
      };

      if (isEditing) {
        await axios.put(`/api/projects/${id}`, formattedData);
        toast.success("Project updated successfully!");
      } else {
        await axios.post("/api/projects", formattedData);
        toast.success("Project created successfully!");
      }

      router.push("/admin/projects");
      router.refresh();
    } catch (error) {
      toast.error(isEditing ? "Failed to update project." : "Failed to create project.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-neutral-300 bg-transparent p-3.5 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-neutral-700 dark:text-white";
  const labelClass = "mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300";

  if (isLoadingProject) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={36} />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-8 md:py-6 pb-24">
      {/* Page Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/projects"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 transition hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-white"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-3xl">
              {isEditing ? "Update Project" : "Create New Project"}
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {isEditing ? "Update your portfolio case study." : "Add a new case study to your portfolio."}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Main Details */}
        <div className="lg:col-span-8 space-y-8">
          {/* Section 1: General Info */}
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div className="border-b border-neutral-200 bg-neutral-50/50 px-6 py-5 dark:border-neutral-800 dark:bg-neutral-950/50">
              <h2 className="flex items-center gap-2 text-lg font-bold text-neutral-900 dark:text-white">
                <Layout className="text-blue-500" size={20} /> General Information
              </h2>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className={labelClass}>Project Title *</label>
                <input
                  {...register("title")}
                  className={inputClass}
                  placeholder="E.g. E-Commerce Platform"
                />
                {errors.title && <p className="text-red-500 text-xs mt-1.5">{errors.title.message}</p>}
              </div>

              <div>
                <label className={labelClass}>Description *</label>
                <textarea
                  {...register("description")}
                  rows={5}
                  className={`${inputClass} resize-y`}
                  placeholder="Describe the project, your role, and the problems you solved..."
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1.5">{errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Category *</label>
                  <input
                    {...register("category")}
                    className={inputClass}
                    placeholder="E.g. Full Stack, Frontend, Mobile"
                  />
                  {errors.category && <p className="text-red-500 text-xs mt-1.5">{errors.category.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Tech Stack</label>
                  <div className="relative">
                    <Code className="absolute left-3.5 top-3.5 text-neutral-500" size={18} />
                    <input
                      {...register("techStack")}
                      className={`${inputClass} pl-10`}
                      placeholder="React, Next.js, MongoDB"
                    />
                  </div>
                  {errors.techStack && (
                    <p className="text-red-500 text-xs mt-1.5">{errors.techStack.message}</p>
                  )}
                  <p className="mt-1.5 text-xs text-neutral-500">Comma separated values.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: External Links */}
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div className="border-b border-neutral-200 bg-neutral-50/50 px-6 py-5 dark:border-neutral-800 dark:bg-neutral-950/50">
              <h2 className="flex items-center gap-2 text-lg font-bold text-neutral-900 dark:text-white">
                <LinkIcon className="text-emerald-500" size={20} /> External Links
              </h2>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>GitHub Repository</label>
                <input
                  {...register("githubUrl")}
                  type="url"
                  placeholder="https://github.com/your-username/repo"
                  className={inputClass}
                />
                {errors.githubUrl && <p className="text-red-500 text-xs mt-1.5">{errors.githubUrl.message}</p>}
              </div>
              <div>
                <label className={labelClass}>Live Demo URL</label>
                <input
                  {...register("liveUrl")}
                  type="url"
                  placeholder="https://your-project.com"
                  className={inputClass}
                />
                {errors.liveUrl && <p className="text-red-500 text-xs mt-1.5">{errors.liveUrl.message}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Sidebar (Media & Settings) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Thumbnail Section */}
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div className="border-b border-neutral-200 bg-neutral-50/50 px-6 py-5 dark:border-neutral-800 dark:bg-neutral-950/50">
              <h2 className="flex items-center gap-2 text-lg font-bold text-neutral-900 dark:text-white">
                <ImageIcon className="text-purple-500" size={20} /> Thumbnail
              </h2>
            </div>
            <div className="p-6">
              <div className="mb-4">
                {thumbnailPreview ? (
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-950">
                    <Image src={thumbnailPreview} alt="Thumbnail preview" fill className="object-cover" />
                  </div>
                ) : (
                  <div className="flex aspect-video w-full flex-col items-center justify-center rounded-xl border border-neutral-200 border-dashed bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900/50 text-neutral-400">
                    <ImageIcon size={32} className="mb-2 opacity-50" />
                    <span className="text-sm font-medium">No thumbnail selected</span>
                  </div>
                )}
              </div>

              <label className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm font-bold text-neutral-700 shadow-sm transition-all hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700">
                {isUploading ? <Loader2 className="animate-spin" size={18} /> : <UploadCloud size={18} />}
                {isUploading ? "Uploading..." : "Upload Thumbnail"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                />
              </label>
              {errors.thumbnail && (
                <p className="text-red-500 text-xs mt-2 text-center">{errors.thumbnail.message}</p>
              )}
            </div>
          </div>

          {/* Settings Section */}
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div className="border-b border-neutral-200 bg-neutral-50/50 px-6 py-5 dark:border-neutral-800 dark:bg-neutral-950/50">
              <h2 className="flex items-center gap-2 text-lg font-bold text-neutral-900 dark:text-white">
                <Settings className="text-amber-500" size={20} /> Publish Settings
              </h2>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className={labelClass}>Project Status</label>
                <select {...register("status")} className={inputClass}>
                  <option value="completed">Completed</option>
                  <option value="in-progress">In Progress</option>
                </select>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-neutral-200 dark:border-neutral-700 p-4">
                <div>
                  <label
                    htmlFor="featured"
                    className="block text-sm font-bold text-neutral-900 dark:text-white cursor-pointer"
                  >
                    Feature Project
                  </label>
                  <p className="text-xs text-neutral-500 mt-0.5">Show on your homepage</p>
                </div>
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    {...register("featured")}
                    className="peer h-6 w-11 cursor-pointer appearance-none rounded-full bg-neutral-300 transition-colors checked:bg-blue-600 dark:bg-neutral-700"
                  />
                  <div className="pointer-events-none absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-5"></div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70 active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Save size={18} />
                )}
                {isSubmitting
                  ? isEditing
                    ? "Updating Project..."
                    : "Creating Project..."
                  : isEditing
                  ? "Update Project"
                  : "Publish Project"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}