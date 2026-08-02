"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import Image from "next/image";
import { Save, Award, Plus, Pencil, Trash2, Loader2, X, UploadCloud, Building2, Calendar, Link as LinkIcon } from "lucide-react";
import Loader from "@/components/ui/Loader";

// Match the Mongoose Schema Interface
interface CertificateForm {
    _id?: string;
    title: string;
    organization: string;
    certificateImage: string; // Will store the uploaded logo URL
    url?: string;
    issueDate: string;
}

export default function AdminCertificatesPage() {
    const { register, handleSubmit, reset, setValue, watch } = useForm<CertificateForm>();
    const [certificates, setCertificates] = useState<CertificateForm[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const logoUrl = watch("certificateImage");

    // Fetch all certificate data
    const fetchCertificates = async () => {
        try {
            const { data } = await axios.get("/api/certificates");
            setCertificates(data);
        } catch (error) {
            toast.error("Failed to load certificates");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCertificates();
    }, []);

    // Handle Image Upload for Organization Logo
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const { data } = await axios.post("/api/upload", formData);
            setValue("certificateImage", data.url);
            toast.success("Logo uploaded successfully!");
        } catch (error) {
            toast.error("Failed to upload logo");
        } finally {
            setIsUploading(false);
        }
    };

    // Form Submit (Create or Update)
    const onSubmit = async (data: CertificateForm) => {
        if (!data.certificateImage) {
            toast.error("Please upload an organization logo.");
            return;
        }

        setIsSubmitting(true);
        try {
            if (editingId) {
                await axios.put("/api/certificates", { ...data, _id: editingId });
                toast.success("Certificate updated!");
            } else {
                await axios.post("/api/certificates", data);
                toast.success("New certificate added!");
            }
            resetForm();
            fetchCertificates();
        } catch (error) {
            toast.error("Failed to save certificate");
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setEditingId(null);
        reset({ title: "", organization: "", certificateImage: "", url: "", issueDate: "" });
    };

    // Populate form for editing
    const handleEdit = (cert: any) => {
        setEditingId(cert._id);
        
        // Format date for HTML date input (YYYY-MM-DD)
        const formatDateForInput = (dateString: string) => {
            if (!dateString) return "";
            return new Date(dateString).toISOString().split('T')[0];
        };

        reset({
            ...cert,
            issueDate: formatDateForInput(cert.issueDate),
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Handle Delete
    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this certificate?")) return;
        try {
            await axios.delete(`/api/certificates?id=${id}`);
            toast.success("Certificate deleted successfully!");
            fetchCertificates();
        } catch (error) {
            toast.error("Failed to delete certificate");
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
            <div className="mb-6 text-center md:text-left">
                <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-3xl">
                    Manage Certificates
                </h1>
                <p className="mt-1 text-sm sm:text-base text-neutral-500 dark:text-neutral-400">
                    Add your certifications, upload organization logos, and link to credentials.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* LEFT COLUMN: The Form */}
                <div className="lg:col-span-5 space-y-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sticky top-24">
                        <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50/50 px-6 py-5 dark:border-neutral-800 dark:bg-neutral-950/50">
                            <h2 className="flex items-center gap-2 text-lg font-bold text-neutral-900 dark:text-white">
                                <Award className="text-blue-500" size={22} />
                                {editingId ? "Edit Certificate" : "Add Certificate"}
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
                                <label className="mb-1.5 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">Organization Logo *</label>
                                <div className="flex items-center gap-4">
                                    {logoUrl ? (
                                        <div className="relative h-14 w-14 rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden bg-white shrink-0 shadow-inner">
                                            <Image src={logoUrl} alt="Logo preview" fill className="object-contain p-1.5" />
                                        </div>
                                    ) : (
                                        <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-neutral-200 border-dashed dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-400 shrink-0">
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

                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">Certificate Title *</label>
                                <input {...register("title", { required: true })} placeholder="AWS Certified Solutions Architect" className="w-full rounded-xl border border-neutral-300 bg-transparent p-3 text-sm outline-none focus:border-blue-500 dark:border-neutral-700" />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">Organization / Issuer *</label>
                                <input {...register("organization", { required: true })} placeholder="Amazon Web Services" className="w-full rounded-xl border border-neutral-300 bg-transparent p-3 text-sm outline-none focus:border-blue-500 dark:border-neutral-700" />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1.5 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">Issue Date *</label>
                                    <input type="date" {...register("issueDate", { required: true })} className="w-full rounded-xl border border-neutral-300 bg-transparent p-3 text-sm outline-none focus:border-blue-500 dark:border-neutral-700" />
                                </div>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">Credential URL</label>
                                <input type="url" {...register("url")} placeholder="https://coursera.org/verify/..." className="w-full rounded-xl border border-neutral-300 bg-transparent p-3 text-sm outline-none focus:border-blue-500 dark:border-neutral-700" />
                                <p className="mt-1 text-xs text-neutral-500">Link to verify the certificate.</p>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting || isUploading}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70"
                            >
                                {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : (editingId ? <Save size={18} /> : <Plus size={18} />)}
                                {isSubmitting ? "Saving..." : (editingId ? "Update Certificate" : "Add Certificate")}
                            </button>
                        </div>
                    </form>
                </div>

                {/* RIGHT COLUMN: The List */}
                <div className="lg:col-span-7 space-y-4">
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">Existing Certificates</h3>

                    {certificates.length === 0 ? (
                        <div className="rounded-2xl border border-neutral-200 border-dashed p-10 text-center dark:border-neutral-800">
                            <Award className="mx-auto mb-3 text-neutral-400" size={32} />
                            <p className="text-neutral-500">No certificates found. Add your first one!</p>
                        </div>
                    ) : (
                        certificates.map((cert) => {
                            const date = new Date(cert.issueDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

                            return (
                                <div key={cert._id} className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 sm:flex-row sm:items-center">

                                    <div className="flex-1 pr-4 flex items-center gap-5">
                                        {/* Logo Display */}
                                        {cert.certificateImage && (
                                            <div className="relative h-14 w-14 rounded-xl bg-white border border-neutral-200 dark:border-neutral-700 overflow-hidden shrink-0 hidden sm:block shadow-inner">
                                                <Image src={cert.certificateImage} alt={cert.organization} fill className="object-contain p-2" />
                                            </div>
                                        )}
                                        
                                        <div>
                                            <h4 className="text-lg font-bold text-neutral-900 dark:text-white leading-tight mb-1">{cert.title}</h4>
                                            
                                            <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                                                <span className="font-semibold text-blue-600 dark:text-blue-400">{cert.organization}</span>
                                                <span className="hidden sm:inline text-neutral-600">•</span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={14} /> {date}
                                                </span>
                                            </div>

                                            {cert.url && (
                                                <a href={cert.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-500 hover:text-emerald-400 transition-colors">
                                                    <LinkIcon size={12} /> View Credential
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="mt-4 flex gap-2 sm:mt-0 sm:flex-col items-end opacity-100 sm:opacity-0 transition-opacity group-hover:opacity-100 shrink-0">
                                        <button onClick={() => handleEdit(cert)} className="p-2 text-neutral-500 hover:text-blue-500 bg-neutral-100 dark:bg-neutral-800 rounded-lg transition" title="Edit">
                                            <Pencil size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(cert._id!)} className="p-2 text-neutral-500 hover:text-red-500 bg-neutral-100 dark:bg-neutral-800 rounded-lg transition" title="Delete">
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