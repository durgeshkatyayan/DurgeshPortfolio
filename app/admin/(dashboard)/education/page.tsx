"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import Image from "next/image";
import { Save, GraduationCap, Plus, Pencil, Trash2, Loader2, X, UploadCloud, MapPin } from "lucide-react";
import Loader from "@/components/ui/Loader";

// Match the Mongoose Schema Interface
interface EducationForm {
    _id?: string;
    degree: string;
    college: string;
    university?: string;
    location?: string;
    logo?: string;
    year: string;
    grade?: string;
    description?: string;
    achievements?: string; // The extra section field
    order: number;
}

export default function AdminEducationPage() {
    const { register, handleSubmit, reset, setValue, watch } = useForm<EducationForm>({
        defaultValues: { order: 0 }
    });
    const [educations, setEducations] = useState<EducationForm[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const logoUrl = watch("logo");

    // Fetch all education data
    const fetchEducations = async () => {
        try {
            const { data } = await axios.get("/api/education");
            setEducations(data);
        } catch (error) {
            toast.error("Failed to load education data");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEducations();
    }, []);

    // Handle Image Upload
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const { data } = await axios.post("/api/upload", formData);
            setValue("logo", data.url); // Set the returned URL to the form state
            toast.success("Logo uploaded successfully!");
        } catch (error) {
            toast.error("Failed to upload logo");
        } finally {
            setIsUploading(false);
        }
    };

    // Handle Create or Update
    const onSubmit = async (data: EducationForm) => {
        setIsSubmitting(true);
        try {
            if (editingId) {
                await axios.put("/api/education", { ...data, _id: editingId });
                toast.success("Education record updated!");
            } else {
                await axios.post("/api/education", data);
                toast.success("New education record added!");
            }
            resetForm();
            fetchEducations(); // Refresh list
        } catch (error) {
            toast.error("Failed to save education data");
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setEditingId(null);
        reset({ order: 0, degree: "", college: "", university: "", location: "", logo: "", year: "", grade: "", description: "", achievements: "" });
    };

    // Populate form for editing
    const handleEdit = (edu: EducationForm) => {
        setEditingId(edu._id as string);
        reset(edu);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Handle Delete
    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this record?")) return;
        try {
            await axios.delete(`/api/education?id=${id}`);
            toast.success("Record deleted successfully!");
            fetchEducations();
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

            {/* Page Header */}
            <div className="mb-4 md:mb-6 text-center md:text-left">
                <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-3xl">
                    Education Timeline
                </h1>
                <p className="mt-1 text-sm sm:text-base text-neutral-500 dark:text-neutral-400">
                    Manage your academic background, degrees, and institutions.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* LEFT COLUMN: The Form */}
                <div className="lg:col-span-5 space-y-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sticky top-24">
                        <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50/50 px-6 py-5 dark:border-neutral-800 dark:bg-neutral-950/50">
                            <h2 className="flex items-center gap-2 text-lg font-bold text-neutral-900 dark:text-white">
                                <GraduationCap className="text-emerald-500" size={22} />
                                {editingId ? "Edit Record" : "Add New Record"}
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
                                <label className="mb-1.5 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">Institution Logo</label>
                                <div className="flex items-center gap-4">
                                    {logoUrl ? (
                                        <div className="relative h-14 w-14 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden bg-white">
                                            <Image src={logoUrl} alt="Logo preview" fill className="object-contain p-1" />
                                        </div>
                                    ) : (
                                        <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-neutral-200 border-dashed dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-400">
                                            <GraduationCap size={24} />
                                        </div>
                                    )}
                                    <label className="flex cursor-pointer items-center gap-2 rounded-xl bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700">
                                        {isUploading ? <Loader2 className="animate-spin" size={18} /> : <UploadCloud size={18} />}
                                        {isUploading ? "Uploading..." : "Upload Logo"}
                                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">Degree / Program *</label>
                                <input {...register("degree", { required: true })} placeholder="Master of Computer Applications" className="w-full rounded-xl border border-neutral-300 bg-transparent p-3 text-sm outline-none focus:border-blue-500 dark:border-neutral-700" />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1.5 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">College / Institution *</label>
                                    <input {...register("college", { required: true })} placeholder="CSJMU" className="w-full rounded-xl border border-neutral-300 bg-transparent p-3 text-sm outline-none focus:border-blue-500 dark:border-neutral-700" />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">Location</label>
                                    <input {...register("location")} placeholder="Kanpur, India" className="w-full rounded-xl border border-neutral-300 bg-transparent p-3 text-sm outline-none focus:border-blue-500 dark:border-neutral-700" />
                                </div>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">University (Optional)</label>
                                <input {...register("university")} placeholder="Chhatrapati Shahu Ji Maharaj University" className="w-full rounded-xl border border-neutral-300 bg-transparent p-3 text-sm outline-none focus:border-blue-500 dark:border-neutral-700" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1.5 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">Year / Duration *</label>
                                    <input {...register("year", { required: true })} placeholder="2023 - 2025" className="w-full rounded-xl border border-neutral-300 bg-transparent p-3 text-sm outline-none focus:border-blue-500 dark:border-neutral-700" />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">Grade / CGPA</label>
                                    <input {...register("grade")} placeholder="8.5 CGPA" className="w-full rounded-xl border border-neutral-300 bg-transparent p-3 text-sm outline-none focus:border-blue-500 dark:border-neutral-700" />
                                </div>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">Description (Optional)</label>
                                <textarea {...register("description")} rows={2} placeholder="Brief description of your coursework..." className="w-full resize-y rounded-xl border border-neutral-300 bg-transparent p-3 text-sm outline-none focus:border-blue-500 dark:border-neutral-700" />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">Achievements / Extra Section</label>
                                <textarea {...register("achievements")} rows={2} placeholder="Key achievements, awards, or specific skills acquired..." className="w-full resize-y rounded-xl border border-neutral-300 bg-transparent p-3 text-sm outline-none focus:border-blue-500 dark:border-neutral-700" />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">Sort Order</label>
                                <input type="number" {...register("order", { valueAsNumber: true })} className="w-full rounded-xl border border-neutral-300 bg-transparent p-3 text-sm outline-none focus:border-blue-500 dark:border-neutral-700" />
                                <p className="mt-1 text-xs text-neutral-500">Lower numbers appear first in the timeline.</p>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70"
                            >
                                {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : (editingId ? <Save size={18} /> : <Plus size={18} />)}
                                {isSubmitting ? "Saving..." : (editingId ? "Update Record" : "Add Education")}
                            </button>
                        </div>
                    </form>
                </div>

                {/* RIGHT COLUMN: The List */}
                <div className="lg:col-span-7 space-y-4">
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">Existing Records</h3>

                    {educations.length === 0 ? (
                        <div className="rounded-2xl border border-neutral-200 border-dashed p-10 text-center dark:border-neutral-800">
                            <GraduationCap className="mx-auto mb-3 text-neutral-400" size={32} />
                            <p className="text-neutral-500">No education records found. Add your first one!</p>
                        </div>
                    ) : (
                        educations.map((edu) => (
                            <div key={edu._id} className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 sm:flex-row sm:items-start">

                                <div className="flex-1 pr-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        {edu.logo && (
                                            <div className="relative h-10 w-10 rounded-md bg-white border border-neutral-200 dark:border-neutral-700 overflow-hidden shrink-0">
                                                <Image src={edu.logo} alt={edu.college} fill className="object-contain p-1" />
                                            </div>
                                        )}
                                        <div>
                                            <span className="inline-block px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold tracking-wider rounded-md">
                                                {edu.year}
                                            </span>
                                        </div>
                                    </div>

                                    <h4 className="text-lg font-bold text-neutral-900 dark:text-white mb-1">{edu.degree}</h4>
                                    
                                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2 flex flex-wrap items-center gap-1">
                                        {edu.college} 
                                        {edu.university && <span className="text-neutral-400 dark:text-neutral-500 font-normal"> • {edu.university}</span>}
                                        {edu.location && (
                                            <span className="text-neutral-500 flex items-center gap-1 ml-1 font-normal">
                                                <MapPin size={12} /> {edu.location}
                                            </span>
                                        )}
                                    </p>
                                    
                                    {edu.grade && (
                                        <p className="text-xs text-neutral-500 mb-2">Grade: <span className="font-semibold text-neutral-700 dark:text-neutral-300">{edu.grade}</span></p>
                                    )}
                                    
                                    {edu.description && (
                                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2 line-clamp-2">{edu.description}</p>
                                    )}

                                    {edu.achievements && (
                                        <div className="mt-2 bg-neutral-50 dark:bg-neutral-950/50 rounded-lg p-3 border border-neutral-100 dark:border-neutral-800/60">
                                            <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">Achievements</span>
                                            <p className="text-sm text-neutral-700 dark:text-neutral-300 line-clamp-2">{edu.achievements}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4 flex gap-2 sm:mt-0 sm:flex-col items-end opacity-100 sm:opacity-0 transition-opacity group-hover:opacity-100 shrink-0">
                                    <button onClick={() => handleEdit(edu)} className="p-2 text-neutral-500 hover:text-blue-500 bg-neutral-100 dark:bg-neutral-800 rounded-lg transition" title="Edit">
                                        <Pencil size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(edu._id!)} className="p-2 text-neutral-500 hover:text-red-500 bg-neutral-100 dark:bg-neutral-800 rounded-lg transition" title="Delete">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

            </div>
        </div>
    );
}