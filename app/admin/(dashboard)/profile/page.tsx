"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { Save, User, Briefcase, Link as LinkIcon, Camera, Loader2 } from "lucide-react";
import Image from "next/image";
import Loader from "@/components/ui/Loader";

// Match the Mongoose Schema Interface
interface ProfileForm {
    photo: string;
    fullName: string;
    tagline: string;
    typingDesignations: string; // UI string, converted to array on submit
    email: string;
    phone: string;
    dob: string;
    location: string;
    nationality: string;
    experienceYears: string;
    currentCompany: string;
    resumeUrl: string;
    availabilityStatus: string;
    socialLinks: {
        github: string;
        linkedin: string;
        portfolio: string;
    };
}

export default function AdminProfilePage() {
    const { register, handleSubmit, reset, watch, setValue } = useForm<ProfileForm>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    const currentPhotoUrl = watch("photo");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await axios.get("/api/profile");
                if (data && data._id) {
                    reset({
                        ...data,
                        typingDesignations: data.typingDesignations?.join(", ") || "",
                    });
                }
            } catch (error) {
                toast.error("Failed to load profile data");
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, [reset]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedImage(e.target.files[0]);
            setValue("photo", URL.createObjectURL(e.target.files[0]));
        }
    };

    const onSubmit = async (data: ProfileForm) => {
        setIsSubmitting(true);
        try {
            let finalPhotoUrl = data.photo;

            if (selectedImage) {
                const formData = new FormData();
                formData.append("file", selectedImage);
                const uploadToast = toast.loading("Uploading photo...");
                const uploadRes = await axios.post("/api/upload", formData);
                finalPhotoUrl = uploadRes.data.url;
                toast.dismiss(uploadToast);
            }

            const payload = {
                ...data,
                photo: finalPhotoUrl,
                typingDesignations: data.typingDesignations
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean),
            };

            await axios.put("/api/profile", payload);
            toast.success("Profile updated successfully!");
            setSelectedImage(null);
        } catch (error) {
            toast.error("Failed to update profile");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return<div className="flex h-64 items-center justify-center"><Loader/> </div>;
    }

    return (
        <div className="mx-auto max-w-5xl pb-12">
            <h1 className="mb-8 text-3xl font-bold text-neutral-900 dark:text-white">Sidebar Profile</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Identity & Photo */}
                <div className="rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="border-b border-neutral-200 bg-neutral-50 px-6 py-4 dark:border-neutral-800 dark:bg-neutral-950/50">
                        <h2 className="flex items-center gap-2 text-lg font-bold"><User className="text-blue-500" size={20} /> Core Identity</h2>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-8">
                        <div className="md:col-span-4 flex flex-col items-center gap-4">
                            <div className="relative h-48 w-48 overflow-hidden rounded-2xl border-2 border-dashed border-neutral-300 dark:border-neutral-700">
                                {currentPhotoUrl ? (
                                    <Image src={currentPhotoUrl} alt="Profile" fill className="object-cover" />
                                ) : (
                                    <div className="flex h-full flex-col items-center justify-center text-neutral-400 bg-neutral-50 dark:bg-neutral-950">
                                        <Camera size={32} className="mb-2" />
                                        <span className="text-xs">No Photo</span>
                                    </div>
                                )}
                            </div>
                            <label className="cursor-pointer rounded-lg bg-neutral-100 px-4 py-2 text-sm font-medium transition hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700">
                                Change Photo
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                            </label>
                            <input type="hidden" {...register("photo")} />
                        </div>

                        <div className="md:col-span-8 space-y-6">
                            <div>
                                <label className="mb-2 block text-sm font-medium">Full Name</label>
                                <input {...register("fullName", { required: true })} className="w-full rounded-lg border border-neutral-300 bg-transparent p-3 outline-none focus:border-blue-500 dark:border-neutral-700" />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium">Professional Tagline</label>
                                <input {...register("tagline", { required: true })} className="w-full rounded-lg border border-neutral-300 bg-transparent p-3 outline-none focus:border-blue-500 dark:border-neutral-700" />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium">Typing Designations (Comma Separated)</label>
                                <input {...register("typingDesignations", { required: true })} placeholder="Frontend Dev, UI/UX Designer" className="w-full rounded-lg border border-neutral-300 bg-transparent p-3 outline-none focus:border-blue-500 dark:border-neutral-700" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Details */}
                <div className="rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="border-b border-neutral-200 bg-neutral-50 px-6 py-4 dark:border-neutral-800 dark:bg-neutral-950/50">
                        <h2 className="flex items-center gap-2 text-lg font-bold"><Briefcase className="text-emerald-500" size={20} /> Details</h2>
                    </div>
                    <div className="p-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium">Email Address</label>
                            <input {...register("email", { required: true })} type="email" className="w-full rounded-lg border border-neutral-300 bg-transparent p-3 dark:border-neutral-700" />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium">Phone</label>
                            <input {...register("phone")} className="w-full rounded-lg border border-neutral-300 bg-transparent p-3 dark:border-neutral-700" />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium">Location</label>
                            <input {...register("location", { required: true })} className="w-full rounded-lg border border-neutral-300 bg-transparent p-3 dark:border-neutral-700" />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium">Current Company</label>
                            <input {...register("currentCompany")} className="w-full rounded-lg border border-neutral-300 bg-transparent p-3 dark:border-neutral-700" />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium">Nationality</label>
                            <input {...register("nationality")} className="w-full rounded-lg border border-neutral-300 bg-transparent p-3 dark:border-neutral-700" />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium">Date of Birth</label>
                            <input {...register("dob")} type="date" className="w-full rounded-lg border border-neutral-300 bg-transparent p-3 dark:border-neutral-700 [color-scheme:light] dark:[color-scheme:dark]" />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium">Years of Experience</label>
                            <input {...register("experienceYears")} className="w-full rounded-lg border border-neutral-300 bg-transparent p-3 dark:border-neutral-700" />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium">Availability Status</label>
                            <select {...register("availabilityStatus")} className="w-full rounded-lg border border-neutral-300 bg-transparent p-3 dark:border-neutral-700">
                                <option value="Available">Available</option>
                                <option value="Freelance Only">Freelance Only</option>
                                <option value="Not Available">Not Available</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-medium">Resume URL</label>
                            <input {...register("resumeUrl")} className="w-full rounded-lg border border-neutral-300 bg-transparent p-3 dark:border-neutral-700" />
                        </div>
                    </div>
                </div>

                {/* Social Links */}
                <div className="rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="border-b border-neutral-200 bg-neutral-50 px-6 py-4 dark:border-neutral-800 dark:bg-neutral-950/50">
                        <h2 className="flex items-center gap-2 text-lg font-bold"><LinkIcon className="text-purple-500" size={20} /> Social Links</h2>
                    </div>
                    <div className="p-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                        {["github", "linkedin", "portfolio"].map((network) => (
                            <div key={network}>
                                <label className="mb-2 block text-sm font-medium capitalize">{network}</label>
                                <input {...register(`socialLinks.${network as keyof ProfileForm["socialLinks"]}`)} type="url" className="w-full rounded-lg border border-neutral-300 bg-transparent p-3 dark:border-neutral-700" />
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 text-lg font-bold text-white transition hover:bg-blue-700 disabled:opacity-50"
                >
                    {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />}
                    {isSubmitting ? "Saving Profile..." : "Save Profile"}
                </button>
            </form>
        </div>
    );
}