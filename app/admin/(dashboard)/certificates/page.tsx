"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { Save, Award, Plus, Pencil, Trash2, Loader2, X } from "lucide-react";
import Loader from "@/components/ui/Loader";

interface CertificateForm {
  _id?: string;
  title: string;
  issuer: string;
  issueDate: string;
  url?: string;
  order: number;
}

export default function AdminCertificatesPage() {
  const { register, handleSubmit, reset } = useForm<CertificateForm>({ defaultValues: { order: 0 } });
  const [certificates, setCertificates] = useState<CertificateForm[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchCertificates = async () => {
    try {
      const { data } = await axios.get("/api/certificates");
      setCertificates(data);
    } catch (error) { toast.error("Failed to load certificates"); } 
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchCertificates(); }, []);

  const onSubmit = async (data: CertificateForm) => {
    setIsSubmitting(true);
    try {
      if (editingId) {
        await axios.put("/api/certificates", { ...data, _id: editingId });
        toast.success("Certificate updated!");
      } else {
        await axios.post("/api/certificates", data);
        toast.success("Certificate added!");
      }
      reset({ title: "", issuer: "", issueDate: "", url: "", order: 0 });
      setEditingId(null);
      fetchCertificates();
    } catch (error) { toast.error("Failed to save"); } 
    finally { setIsSubmitting(false); }
  };

  const handleEdit = (cert: CertificateForm) => {
    setEditingId(cert._id as string);
    reset(cert);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this certificate?")) return;
    try {
      await axios.delete(`/api/certificates?id=${id}`);
      toast.success("Deleted successfully!");
      fetchCertificates();
    } catch (error) { toast.error("Failed to delete"); }
  };

  if (isLoading) return <div className="flex min-h-[70vh] items-center justify-center"><Loader /></div>;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 pb-24">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white">Certificates</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5">
          <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl border bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sticky top-24 space-y-4">
            <h2 className="flex justify-between font-bold text-lg dark:text-white mb-2">
              <span className="flex items-center gap-2"><Award className="text-emerald-500"/> {editingId ? "Edit" : "Add"} Certificate</span>
              {editingId && <button type="button" onClick={() => { setEditingId(null); reset(); }}><X size={20}/></button>}
            </h2>
            
            <input {...register("title", { required: true })} placeholder="Certificate Title" className="w-full rounded-xl border p-3 dark:bg-transparent dark:border-neutral-700 outline-none focus:border-emerald-500" />
            <input {...register("issuer", { required: true })} placeholder="Issuer (e.g. Coursera, AWS)" className="w-full rounded-xl border p-3 dark:bg-transparent dark:border-neutral-700 outline-none focus:border-emerald-500" />
            <input type="text" {...register("issueDate")} placeholder="Issue Date (e.g. Aug 2023)" className="w-full rounded-xl border p-3 dark:bg-transparent dark:border-neutral-700 outline-none focus:border-emerald-500" />
            <input type="url" {...register("url")} placeholder="Credential URL" className="w-full rounded-xl border p-3 dark:bg-transparent dark:border-neutral-700 outline-none focus:border-emerald-500" />
            <input type="number" {...register("order")} placeholder="Sort Order" className="w-full rounded-xl border p-3 dark:bg-transparent dark:border-neutral-700 outline-none focus:border-emerald-500" />

            <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-emerald-600 p-3.5 font-bold text-white transition hover:bg-emerald-700 flex justify-center gap-2">
              {isSubmitting ? <Loader2 className="animate-spin" /> : (editingId ? <Save /> : <Plus />)} Save Certificate
            </button>
          </form>
        </div>

        <div className="lg:col-span-7 space-y-4">
          {certificates.map((cert) => (
            <div key={cert._id} className="flex items-start justify-between rounded-2xl border bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900 shadow-sm">
              <div>
                <h4 className="font-bold dark:text-white text-lg">{cert.title}</h4>
                <p className="text-sm text-neutral-500 mb-2">{cert.issuer} • {cert.issueDate}</p>
                {cert.url && <a href={cert.url} target="_blank" className="text-xs text-emerald-500 hover:underline">View Credential</a>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(cert)} className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-neutral-500 hover:text-emerald-500"><Pencil size={16}/></button>
                <button onClick={() => handleDelete(cert._id!)} className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-neutral-500 hover:text-red-500"><Trash2 size={16}/></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}