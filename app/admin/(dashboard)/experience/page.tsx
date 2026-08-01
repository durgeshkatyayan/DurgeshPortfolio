"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import Image from "next/image";
import {
  Save,
  Briefcase,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  X,
  UploadCloud,
  Calendar,
  Building2,
  MapPin,
  Globe,
  Laptop,
} from "lucide-react";
import Loader from "@/components/ui/Loader";

// Type definitions matching the updated Mongoose Schema
export type EmploymentType =
  | "Full-time"
  | "Part-time"
  | "Contract"
  | "Internship"
  | "Freelance"
  | "Apprenticeship";

export type WorkMode = "Remote" | "Hybrid" | "On-site";

interface ExperienceForm {
  _id?: string;
  company: string;
  logo?: string;
  position: string;
  description: string;
  technologies: string; // Comma-separated string for form input
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  employmentType: EmploymentType;
  workMode: WorkMode;
  location?: string;
  companyUrl?: string;
  order: number;
}

export default function AdminExperiencePage() {
  const { register, handleSubmit, reset, setValue, watch } =
    useForm<ExperienceForm>({
      defaultValues: {
        order: 0,
        isCurrent: false,
        employmentType: "Full-time",
        workMode: "On-site",
        location: "",
        companyUrl: "",
      },
    });

  const [experiences, setExperiences] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const logoUrl = watch("logo");
  const isCurrent = watch("isCurrent");

  // Fetch all experience records
  const fetchExperiences = async () => {
    try {
      const { data } = await axios.get("/api/experience");
      setExperiences(data);
    } catch (error) {
      toast.error("Failed to load experience data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  // Handle Image Upload for Company Logo
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await axios.post("/api/upload", formData);
      setValue("logo", data.url);
      toast.success("Logo uploaded successfully!");
    } catch (error) {
      toast.error("Failed to upload logo");
    } finally {
      setIsUploading(false);
    }
  };

  // Form Submit Handler
  const onSubmit = async (data: ExperienceForm) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        technologies: data.technologies
          ? data.technologies.split(",").map((t) => t.trim()).filter(Boolean)
          : [],
        endDate: data.isCurrent ? null : data.endDate,
      };

      if (editingId) {
        await axios.put(`/api/experience/${editingId}`, payload);
        toast.success("Experience updated!");
      } else {
        await axios.post("/api/experience", payload);
        toast.success("New experience added!");
      }

      resetForm();
      fetchExperiences();
    } catch (error) {
      toast.error("Failed to save experience data");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    reset({
      order: 0,
      company: "",
      position: "",
      logo: "",
      description: "",
      technologies: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
      employmentType: "Full-time",
      workMode: "On-site",
      location: "",
      companyUrl: "",
    });
  };

  const formatDateForInput = (date?: string | Date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleEdit = (exp: any) => {
    setEditingId(exp._id);

    reset({
      ...exp,
      technologies: Array.isArray(exp.technologies)
        ? exp.technologies.join(", ")
        : "",
      startDate: formatDateForInput(exp.startDate),
      endDate: exp.endDate ? formatDateForInput(exp.endDate) : "",
      employmentType: exp.employmentType || "Full-time",
      workMode: exp.workMode || "On-site",
      location: exp.location || "",
      companyUrl: exp.companyUrl || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this role?")) return;
    try {
      await axios.delete(`/api/experience/${id}`);
      toast.success("Record deleted successfully!");
      fetchExperiences();
    } catch (error) {
      toast.error("Failed to delete record");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] w-full items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 pb-24">
      {/* Header */}
      <div className="mb-8 text-left">
        <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-3xl">
          Work Experience
        </h1>
        <p className="mt-1 text-sm sm:text-base text-neutral-500 dark:text-neutral-400">
          Manage your professional career timeline, work types, and technologies.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Sticky Form */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50/50 px-6 py-4 dark:border-neutral-800 dark:bg-neutral-950/50">
              <h2 className="flex items-center gap-2 text-base font-bold text-neutral-900 dark:text-white sm:text-lg">
                <Briefcase className="text-blue-500" size={20} />
                {editingId ? "Edit Experience" : "Add New Experience"}
              </h2>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg p-1 text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <div className="p-6 space-y-4 max-h-[calc(100vh-160px)] overflow-y-auto">
              {/* Logo Upload Section */}
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                  Company Logo
                </label>
                <div className="flex items-center gap-4">
                  {logoUrl ? (
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-700">
                      <Image
                        src={logoUrl}
                        alt="Logo preview"
                        fill
                        className="object-contain p-1.5"
                      />
                    </div>
                  ) : (
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 text-neutral-400">
                      <Building2 size={24} />
                    </div>
                  )}
                  <label className="flex cursor-pointer items-center gap-2 rounded-xl bg-neutral-100 px-4 py-2.5 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700">
                    {isUploading ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <UploadCloud size={16} />
                    )}
                    {isUploading ? "Uploading..." : "Upload Logo"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                    />
                  </label>
                </div>
              </div>

              {/* Company & Position */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                    Company Name *
                  </label>
                  <input
                    {...register("company", { required: true })}
                    placeholder="e.g. Z Vertex IT"
                    className="w-full rounded-xl border border-neutral-300 bg-transparent p-2.5 text-sm outline-none focus:border-blue-500 dark:border-neutral-700"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                    Job Title / Position *
                  </label>
                  <input
                    {...register("position", { required: true })}
                    placeholder="e.g. MERN Stack Developer"
                    className="w-full rounded-xl border border-neutral-300 bg-transparent p-2.5 text-sm outline-none focus:border-blue-500 dark:border-neutral-700"
                  />
                </div>
              </div>

              {/* Employment Type & Work Mode */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                    Employment Type *
                  </label>
                  <select
                    {...register("employmentType", { required: true })}
                    className="w-full rounded-xl border border-neutral-300 bg-white p-2.5 text-sm outline-none focus:border-blue-500 dark:border-neutral-700 dark:bg-neutral-900"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Apprenticeship">Apprenticeship</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                    Work Mode *
                  </label>
                  <select
                    {...register("workMode", { required: true })}
                    className="w-full rounded-xl border border-neutral-300 bg-white p-2.5 text-sm outline-none focus:border-blue-500 dark:border-neutral-700 dark:bg-neutral-900"
                  >
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>
              </div>

              {/* Location & Website URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                    Location
                  </label>
                  <input
                    {...register("location")}
                    placeholder="e.g. Lucknow, India"
                    className="w-full rounded-xl border border-neutral-300 bg-transparent p-2.5 text-sm outline-none focus:border-blue-500 dark:border-neutral-700"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                    Company Website URL
                  </label>
                  <input
                    {...register("companyUrl")}
                    placeholder="https://company.com"
                    className="w-full rounded-xl border border-neutral-300 bg-transparent p-2.5 text-sm outline-none focus:border-blue-500 dark:border-neutral-700"
                  />
                </div>
              </div>

              {/* Start & End Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    {...register("startDate", { required: true })}
                    className="w-full rounded-xl border border-neutral-300 bg-transparent p-2.5 text-sm outline-none focus:border-blue-500 dark:border-neutral-700"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                    End Date
                  </label>
                  <input
                    type="date"
                    {...register("endDate")}
                    disabled={isCurrent}
                    className="w-full rounded-xl border border-neutral-300 bg-transparent p-2.5 text-sm outline-none focus:border-blue-500 dark:border-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Current Job Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isCurrent"
                  {...register("isCurrent")}
                  className="h-4 w-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-600 dark:border-neutral-700 dark:bg-neutral-900"
                />
                <label
                  htmlFor="isCurrent"
                  className="text-sm font-medium text-neutral-700 dark:text-neutral-300 cursor-pointer"
                >
                  I currently work in this role
                </label>
              </div>

              {/* Technologies */}
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                  Technologies Used
                </label>
                <input
                  {...register("technologies")}
                  placeholder="React, Express, MongoDB, Tailwind..."
                  className="w-full rounded-xl border border-neutral-300 bg-transparent p-2.5 text-sm outline-none focus:border-blue-500 dark:border-neutral-700"
                />
                <p className="mt-1 text-[11px] text-neutral-500">
                  Separate technologies with commas.
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                  Description *
                </label>
                <textarea
                  {...register("description", { required: true })}
                  rows={3}
                  placeholder="Summarize key responsibilities, leadership, or major features built..."
                  className="w-full resize-y rounded-xl border border-neutral-300 bg-transparent p-2.5 text-sm outline-none focus:border-blue-500 dark:border-neutral-700"
                />
              </div>

              {/* Sort Order */}
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                  Display Order
                </label>
                <input
                  type="number"
                  {...register("order", { valueAsNumber: true })}
                  className="w-full rounded-xl border border-neutral-300 bg-transparent p-2.5 text-sm outline-none focus:border-blue-500 dark:border-neutral-700"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : editingId ? (
                  <Save size={18} />
                ) : (
                  <Plus size={18} />
                )}
                {isSubmitting
                  ? "Saving..."
                  : editingId
                  ? "Update Experience"
                  : "Add Experience"}
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: Experience List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
              Experience History
            </h3>
            <span className="text-xs font-medium text-neutral-500">
              Total: {experiences.length}
            </span>
          </div>

          {experiences.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-neutral-200 p-12 text-center dark:border-neutral-800">
              <Briefcase className="mx-auto mb-3 text-neutral-400" size={36} />
              <p className="text-sm font-medium text-neutral-500">
                No work experience records added yet.
              </p>
            </div>
          ) : (
            experiences.map((exp) => {
              const startDate = new Date(exp.startDate).toLocaleDateString(
                "en-US",
                { month: "short", year: "numeric" }
              );
              const endDate = exp.isCurrent
                ? "Present"
                : new Date(exp.endDate).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  });

              return (
                <div
                  key={exp._id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 sm:flex-row"
                >
                  <div className="flex-1 pr-0 sm:pr-4">
                    <div className="flex items-start gap-4">
                      {/* Logo or Placeholder */}
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800">
                        {exp.logo ? (
                          <Image
                            src={exp.logo}
                            alt={exp.company}
                            fill
                            className="object-contain p-1.5"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-neutral-400">
                            <Building2 size={20} />
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-base font-bold text-neutral-900 dark:text-white">
                            {exp.position}
                          </h4>
                          {exp.isCurrent && (
                            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                              Current
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-600 dark:text-neutral-400">
                          {exp.companyUrl ? (
                            <a
                              href={exp.companyUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1 font-semibold text-blue-600 hover:underline dark:text-blue-400"
                            >
                              {exp.company} <Globe size={12} />
                            </a>
                          ) : (
                            <span className="font-semibold text-neutral-900 dark:text-neutral-200">
                              {exp.company}
                            </span>
                          )}

                          {exp.employmentType && (
                            <>
                              <span>•</span>
                              <span className="font-medium text-neutral-500">
                                {exp.employmentType}
                              </span>
                            </>
                          )}
                        </div>

                        {/* Badges for Work Mode & Location */}
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-xs text-neutral-500 dark:text-neutral-400">
                          <span className="flex items-center gap-1">
                            <Calendar size={13} /> {startDate} – {endDate}
                          </span>

                          {exp.workMode && (
                            <span className="flex items-center gap-1">
                              <Laptop size={13} /> {exp.workMode}
                            </span>
                          )}

                          {exp.location && (
                            <span className="flex items-center gap-1">
                              <MapPin size={13} /> {exp.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300 line-clamp-3">
                      {exp.description}
                    </p>

                    {/* Technologies Tag Array */}
                    {exp.technologies && exp.technologies.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {exp.technologies.map((tech: string, idx: number) => (
                          <span
                            key={idx}
                            className="rounded-md border border-neutral-200 bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions Column */}
                  <div className="mt-4 flex sm:mt-0 sm:flex-col items-center justify-end gap-2 shrink-0">
                    <button
                      onClick={() => handleEdit(exp)}
                      className="rounded-xl bg-neutral-100 p-2 text-neutral-600 transition hover:bg-blue-50 hover:text-blue-600 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-blue-950/50 dark:hover:text-blue-400"
                      title="Edit Role"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(exp._id)}
                      className="rounded-xl bg-neutral-100 p-2 text-neutral-600 transition hover:bg-red-50 hover:text-red-600 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-red-950/50 dark:hover:text-red-400"
                      title="Delete Role"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}