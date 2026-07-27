"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { Save, Code2, Plus, Pencil, Trash2, Loader2, X } from "lucide-react";
import Loader from "@/components/ui/Loader";

interface SkillForm {
  _id?: string;
  name: string;
  category: string;
  icon: string;
  percentage?: number;
  order: number;
}

export default function AdminSkillsPage() {
  const { register, handleSubmit, reset } = useForm<SkillForm>({ defaultValues: { order: 0 } });
  const [skills, setSkills] = useState<SkillForm[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchSkills = async () => {
    try {
      const { data } = await axios.get("/api/skills");
      setSkills(data);
    } catch (error) {
      toast.error("Failed to load skills");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchSkills(); }, []);

  const onSubmit = async (data: SkillForm) => {
    setIsSubmitting(true);
    try {
      if (editingId) {
        await axios.put("/api/skills", { ...data, _id: editingId });
        toast.success("Skill updated!");
      } else {
        await axios.post("/api/skills", data);
        toast.success("Skill added!");
      }
      reset({ name: "", category: "", icon: "", percentage: 0, order: 0 });
      setEditingId(null);
      fetchSkills();
    } catch (error) {
      toast.error("Failed to save skill");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (skill: SkillForm) => {
    setEditingId(skill._id as string);
    reset(skill);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this skill?")) return;
    try {
      await axios.delete(`/api/skills?id=${id}`);
      toast.success("Deleted successfully!");
      fetchSkills();
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  if (isLoading) return <div className="flex min-h-[70vh] items-center justify-center"><Loader /></div>;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 pb-24">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white">Skills Management</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form */}
        <div className="lg:col-span-5">
          <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl border bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sticky top-24 space-y-4">
            <h2 className="flex justify-between font-bold text-lg dark:text-white mb-2">
              <span className="flex items-center gap-2"><Code2 className="text-blue-500"/> {editingId ? "Edit Skill" : "Add Skill"}</span>
              {editingId && <button type="button" onClick={() => { setEditingId(null); reset(); }}><X size={20}/></button>}
            </h2>
            
            <input {...register("name", { required: true })} placeholder="Skill Name (e.g. React)" className="w-full rounded-xl border p-3 dark:bg-transparent dark:border-neutral-700 outline-none focus:border-blue-500" />
            <input {...register("category", { required: true })} placeholder="Category (e.g. Frontend)" className="w-full rounded-xl border p-3 dark:bg-transparent dark:border-neutral-700 outline-none focus:border-blue-500" />
            <textarea {...register("icon", { required: true })} rows={3} placeholder="SVG SVG Code here..." className="w-full rounded-xl border p-3 dark:bg-transparent dark:border-neutral-700 outline-none focus:border-blue-500" />
            <input type="number" {...register("percentage")} placeholder="Proficiency % (Optional)" className="w-full rounded-xl border p-3 dark:bg-transparent dark:border-neutral-700 outline-none focus:border-blue-500" />
            <input type="number" {...register("order")} placeholder="Sort Order" className="w-full rounded-xl border p-3 dark:bg-transparent dark:border-neutral-700 outline-none focus:border-blue-500" />

            <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-blue-600 p-3.5 font-bold text-white transition hover:bg-blue-700 flex justify-center gap-2">
              {isSubmitting ? <Loader2 className="animate-spin" /> : (editingId ? <Save /> : <Plus />)} Save Skill
            </button>
          </form>
        </div>

        {/* List */}
        <div className="lg:col-span-7 space-y-4">
          {skills.map((skill) => (
            <div key={skill._id} className="flex items-center justify-between rounded-2xl border bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900 shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 text-neutral-500" dangerouslySetInnerHTML={{ __html: skill.icon }} />
                <div>
                  <h4 className="font-bold dark:text-white">{skill.name}</h4>
                  <p className="text-xs text-neutral-500">{skill.category} • Order: {skill.order}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(skill)} className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-neutral-500 hover:text-blue-500"><Pencil size={16}/></button>
                <button onClick={() => handleDelete(skill._id!)} className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-neutral-500 hover:text-red-500"><Trash2 size={16}/></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}