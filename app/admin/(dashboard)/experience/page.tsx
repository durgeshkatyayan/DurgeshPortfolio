"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import Image from "next/image";
import { Save, Briefcase, Plus, Pencil, Trash2, Loader2, X, UploadCloud, Calendar, Building2 } from "lucide-react";
import Loader from "@/components/ui/Loader";

// Form interface (technologies is handled as a comma-separated string in the form)
interface ExperienceForm {
    _id?: string;
    company: string;
    position: string;
    logo?: string;
    description: string;
    technologies: string; // Will convert to string[] on submit
    startDate: string;
    endDate?: string;
    isCurrent: boolean;
    order: number;
}

export default function AdminExperiencePage() {
    const { register, handleSubmit, reset, setValue, watch } = useForm<ExperienceForm>({
        defaultValues: { order: 0, isCurrent: false }
    });
    const [experiences, setExperiences] = useState<any[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const logoUrl = watch("logo");
    const isCurrent = watch("isCurrent");

    // Fetch all experience data
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

    // Form Submit (Create or Update)
    const onSubmit = async (data: ExperienceForm) => {
        setIsSubmitting(true);
        try {
            const payload = {
                ...data,
                // Convert comma-separated string to array
                technologies: data.technologies.split(",").map((t) => t.trim()).filter(Boolean),
                endDate: data.isCurrent ? null : data.endDate, // Clear endDate if current
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
            order: 0, company: "", position: "", logo: "", description: "",
            technologies: "", startDate: "", endDate: "", isCurrent: false
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
        endDate: exp.endDate
            ? formatDateForInput(exp.endDate)
            : "",
    });

    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
};

    // Handle Delete
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
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-8 md:py-4 pb-24">

            <div className="mb-6 text-center md:text-left">
                <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-3xl">
                    Work Experience
                </h1>
                <p className="mt-1 text-sm sm:text-base text-neutral-500 dark:text-neutral-400">
                    Manage your professional work history, roles, and responsibilities.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* LEFT COLUMN: The Form */}
                <div className="lg:col-span-5 space-y-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sticky top-24">
                        <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50/50 px-6 py-5 dark:border-neutral-800 dark:bg-neutral-950/50">
                            <h2 className="flex items-center gap-2 text-lg font-bold text-neutral-900 dark:text-white">
                                <Briefcase className="text-blue-500" size={22} />
                                {editingId ? "Edit Role" : "Add New Role"}
                            </h2>
                            {editingId && (
                                <button type="button" onClick={resetForm} className="text-neutral-500 hover:text-red-500 transition">
                                    <X size={20} />
                                </button>
                            )}
                        </div>

                        <div className="p-6 space-y-5">

                            {/* Logo Upload Section */}
                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">Company Logo</label>
                                <div className="flex items-center gap-4">
                                    {logoUrl ? (
                                        <div className="relative h-14 w-14 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden bg-white shrink-0">
                                            <Image src={logoUrl} alt="Logo preview" fill className="object-contain p-1.5" />
                                        </div>
                                    ) : (
                                        <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-neutral-200 border-dashed dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-400 shrink-0">
                                            <Building2 size={24} />
                                        </div>
                                    )}
                                    <label className="flex cursor-pointer items-center gap-2 rounded-xl bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700">
                                        {isUploading ? <Loader2 className="animate-spin" size={18} /> : <UploadCloud size={18} />}
                                        {isUploading ? "Uploading..." : "Upload Logo"}
                                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                                    </label>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1.5 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">Company Name *</label>
                                    <input {...register("company", { required: true })} placeholder="Iconiq Oakmount" className="w-full rounded-xl border border-neutral-300 bg-transparent p-3 text-sm outline-none focus:border-blue-500 dark:border-neutral-700" />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">Job Title / Position *</label>
                                    <input {...register("position", { required: true })} placeholder="Full Stack Developer" className="w-full rounded-xl border border-neutral-300 bg-transparent p-3 text-sm outline-none focus:border-blue-500 dark:border-neutral-700" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1.5 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">Start Date *</label>
                                    <input type="date" {...register("startDate", { required: true })} className="w-full rounded-xl border border-neutral-300 bg-transparent p-3 text-sm outline-none focus:border-blue-500 dark:border-neutral-700" />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">End Date</label>
                                    <input
                                        type="date"
                                        {...register("endDate")}
                                        disabled={isCurrent}
                                        className="w-full rounded-xl border border-neutral-300 bg-transparent p-3 text-sm outline-none focus:border-blue-500 dark:border-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="isCurrent" {...register("isCurrent")} className="h-4 w-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-600 dark:border-neutral-700 dark:bg-neutral-900" />
                                <label htmlFor="isCurrent" className="text-sm font-medium text-neutral-700 dark:text-neutral-300 cursor-pointer">
                                    I currently work here
                                </label>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">Technologies Used</label>
                                <input {...register("technologies")} placeholder="React, Node.js, MongoDB..." className="w-full rounded-xl border border-neutral-300 bg-transparent p-3 text-sm outline-none focus:border-blue-500 dark:border-neutral-700" />
                                <p className="mt-1 text-xs text-neutral-500">Comma separated values.</p>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">Description *</label>
                                <textarea {...register("description", { required: true })} rows={4} placeholder="Describe your responsibilities and achievements..." className="w-full resize-y rounded-xl border border-neutral-300 bg-transparent p-3 text-sm outline-none focus:border-blue-500 dark:border-neutral-700" />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">Sort Order</label>
                                <input type="number" {...register("order", { valueAsNumber: true })} className="w-full rounded-xl border border-neutral-300 bg-transparent p-3 text-sm outline-none focus:border-blue-500 dark:border-neutral-700" />
                                <p className="mt-1 text-xs text-neutral-500">Lower numbers appear first.</p>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70"
                            >
                                {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : (editingId ? <Save size={18} /> : <Plus size={18} />)}
                                {isSubmitting ? "Saving..." : (editingId ? "Update Experience" : "Add Experience")}
                            </button>
                        </div>
                    </form>
                </div>

                {/* RIGHT COLUMN: The List */}
                <div className="lg:col-span-7 space-y-4">
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">Existing Records</h3>

                    {experiences.length === 0 ? (
                        <div className="rounded-2xl border border-neutral-200 border-dashed p-10 text-center dark:border-neutral-800">
                            <Briefcase className="mx-auto mb-3 text-neutral-400" size={32} />
                            <p className="text-neutral-500">No work experience records found.</p>
                        </div>
                    ) : (
                        experiences.map((exp) => {
                            const startDate = new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                            const endDate = exp.isCurrent ? "Present" : new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

                            return (
                                <div key={exp._id} className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 sm:flex-row sm:items-start">

                                    <div className="flex-1 pr-4">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-3">
                                            {exp.logo && (
                                                <div className="relative h-12 w-12 rounded-lg bg-white border border-neutral-200 dark:border-neutral-700 overflow-hidden shrink-0 hidden sm:block">
                                                    <Image src={exp.logo} alt={exp.company} fill className="object-contain p-1.5" />
                                                </div>
                                            )}
                                            <div>
                                                <h4 className="text-lg font-bold text-neutral-900 dark:text-white leading-tight mb-1">{exp.position}</h4>
                                                <div className="flex flex-wrap items-center gap-2 text-sm">
                                                    <span className="font-semibold text-blue-600 dark:text-blue-400">{exp.company}</span>
                                                    <span className="hidden sm:inline text-neutral-600">•</span>
                                                    <span className="flex items-center gap-1 text-neutral-500 dark:text-neutral-400">
                                                        <Calendar size={14} /> {startDate} - {endDate}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3 line-clamp-2">{exp.description}</p>

                                        {exp.technologies && exp.technologies.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mt-2">
                                                {exp.technologies.slice(0, 5).map((tech: string, idx: number) => (
                                                    <span key={idx} className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md text-[10px] font-semibold text-neutral-600 dark:text-neutral-300 tracking-wide uppercase">
                                                        {tech}
                                                    </span>
                                                ))}
                                                {exp.technologies.length > 5 && (
                                                    <span className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md text-[10px] font-semibold text-neutral-600 dark:text-neutral-300 tracking-wide">
                                                        +{exp.technologies.length - 5}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-4 flex gap-2 sm:mt-0 sm:flex-col items-end opacity-100 sm:opacity-0 transition-opacity group-hover:opacity-100 shrink-0">
                                        <button onClick={() => handleEdit(exp)} className="p-2 text-neutral-500 hover:text-blue-500 bg-neutral-100 dark:bg-neutral-800 rounded-lg transition" title="Edit">
                                            <Pencil size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(exp._id)} className="p-2 text-neutral-500 hover:text-red-500 bg-neutral-100 dark:bg-neutral-800 rounded-lg transition" title="Delete">
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