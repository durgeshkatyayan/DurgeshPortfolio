"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { Save, Code2, Plus, Pencil, Trash2, Loader2, X } from "lucide-react";
import Loader from "@/components/ui/Loader";
import { SKILL_CATEGORIES } from "@/lib/skillCategories";

interface SkillForm {
  _id?: string;
  name: string;
  category: string;
  icon: string;
  percentage?: number;
  order: number;
}

const VALID_CATEGORIES = SKILL_CATEGORIES;
type CategoryType = (typeof VALID_CATEGORIES)[number];

export default function AdminSkillsPage() {
  const { register, handleSubmit, reset, formState: { errors }, setValue, watch } = useForm<SkillForm>({ 
    defaultValues: { 
      name: "", 
      category: "Frontend", 
      icon: "", 
      percentage: 0, 
      order: 0 
    } 
  });
  const [skills, setSkills] = useState<SkillForm[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [customCategory, setCustomCategory] = useState(false);

  const fetchSkills = async () => {
    try {
      const { data } = await axios.get("/api/skills");
      setSkills(data);
    } catch (error) {
      toast.error("Failed to load skills");
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchSkills(); }, []);

  const onSubmit = async (data: SkillForm) => {
    setIsSubmitting(true);
    try {
      // Prepare data
      const submitData = {
        name: data.name.trim(),
        category: data.category.trim(),
        icon: data.icon.trim(),
        order: Number(data.order) || 0,
        ...(data.percentage !== undefined && data.percentage !== null && data.percentage !== 0 && {
          percentage: Number(data.percentage)
        })
      };

      // console.log("Submitting data:", submitData);

      if (editingId) {
        await axios.put("/api/skills", { ...submitData, _id: editingId });
        toast.success("Skill updated!");
      } else {
        await axios.post("/api/skills", submitData);
        toast.success("Skill added!");
      }
      
      reset({ name: "", category: "Frontend", icon: "", percentage: 0, order: 0 });
      setEditingId(null);
      setCustomCategory(false);
      fetchSkills();
    } catch (error: any) {
      console.error("Submit error:", error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || "Failed to save skill";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (skill: SkillForm) => {
    setEditingId(skill._id as string);
    reset({
      name: skill.name,
      category: skill.category,
      icon: skill.icon,
      percentage: skill.percentage || 0,
      order: skill.order
    });
    // Check if category is in valid list
    if (!VALID_CATEGORIES.includes(skill.category as CategoryType)) {
      setCustomCategory(true);
    } else {
      setCustomCategory(false);
    }
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
      console.error("Delete error:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    reset({ name: "", category: "Frontend", icon: "", percentage: 0, order: 0 });
    setCustomCategory(false);
  };

  const currentCategory = watch("category");

  if (isLoading) return <div className="flex min-h-[70vh] items-center justify-center"><Loader /></div>;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 pb-24">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white">Skills Management</h1>
        <p className="text-neutral-500 dark:text-neutral-400 mt-1">Manage your skills and proficiencies</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form */}
        <div className="lg:col-span-5">
          <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl border bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sticky top-24 space-y-4">
            <h2 className="flex justify-between font-bold text-lg dark:text-white mb-2">
              <span className="flex items-center gap-2">
                <Code2 className="text-blue-500" size={20} /> 
                {editingId ? "Edit Skill" : "Add Skill"}
              </span>
              {editingId && (
                <button 
                  type="button" 
                  onClick={handleCancelEdit}
                  className="text-neutral-500 hover:text-red-500 transition"
                >
                  <X size={20} />
                </button>
              )}
            </h2>
            
            <div>
              <input 
                {...register("name", { 
                  required: "Skill name is required",
                  minLength: { value: 2, message: "Name must be at least 2 characters" }
                })} 
                placeholder="Skill Name (e.g. React)" 
                className="w-full rounded-xl border p-3 dark:bg-transparent dark:border-neutral-700 outline-none focus:border-blue-500" 
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <div className="flex gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => setCustomCategory(false)}
                  className={`px-3 py-1 rounded-lg text-sm transition ${!customCategory ? 'bg-blue-500 text-white' : 'bg-neutral-200 dark:bg-neutral-700'}`}
                >
                  Select Category
                </button>
                <button
                  type="button"
                  onClick={() => setCustomCategory(true)}
                  className={`px-3 py-1 rounded-lg text-sm transition ${customCategory ? 'bg-blue-500 text-white' : 'bg-neutral-200 dark:bg-neutral-700'}`}
                >
                  Custom Category
                </button>
              </div>

              {!customCategory ? (
                <select
                  {...register("category", { 
                    required: "Category is required" 
                  })}
                  className="w-full rounded-xl border p-3 dark:bg-transparent dark:border-neutral-700 outline-none focus:border-blue-500"
                >
                  {VALID_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              ) : (
                <input
                  {...register("category", { 
                    required: "Category is required" 
                  })}
                  placeholder="Custom Category (e.g. Full Stack Project)"
                  className="w-full rounded-xl border p-3 dark:bg-transparent dark:border-neutral-700 outline-none focus:border-blue-500"
                />
              )}
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
            </div>

            <div>
              <textarea 
                {...register("icon", { 
                  required: "SVG code is required" 
                })} 
                rows={3} 
                placeholder="SVG Code here..." 
                className="w-full rounded-xl border p-3 dark:bg-transparent dark:border-neutral-700 outline-none focus:border-blue-500 font-mono text-sm" 
              />
              {errors.icon && <p className="text-red-500 text-sm mt-1">{errors.icon.message}</p>}
            </div>

            <div>
              <input 
                type="number" 
                {...register("percentage", { 
                  min: { value: 0, message: "Minimum 0" },
                  max: { value: 100, message: "Maximum 100" }
                })} 
                placeholder="Proficiency % (0-100)" 
                className="w-full rounded-xl border p-3 dark:bg-transparent dark:border-neutral-700 outline-none focus:border-blue-500" 
              />
              {errors.percentage && <p className="text-red-500 text-sm mt-1">{errors.percentage.message}</p>}
            </div>

            <div>
              <input 
                type="number" 
                {...register("order", { 
                  required: "Order is required",
                  valueAsNumber: true
                })} 
                placeholder="Sort Order" 
                className="w-full rounded-xl border p-3 dark:bg-transparent dark:border-neutral-700 outline-none focus:border-blue-500" 
              />
              {errors.order && <p className="text-red-500 text-sm mt-1">{errors.order.message}</p>}
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full rounded-xl bg-blue-600 p-3.5 font-bold text-white transition hover:bg-blue-700 flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : (editingId ? <Save size={20} /> : <Plus size={20} />)} 
              {isSubmitting ? "Saving..." : (editingId ? "Update Skill" : "Add Skill")}
            </button>
          </form>
        </div>

        {/* List */}
        <div className="lg:col-span-7 space-y-4">
          {skills.length === 0 ? (
            <div className="text-center py-12 text-neutral-500 dark:text-neutral-400">
              <Code2 size={48} className="mx-auto mb-4 opacity-50" />
              <p>No skills added yet</p>
              <p className="text-sm">Add your first skill using the form</p>
            </div>
          ) : (
            skills.map((skill) => (
              <div key={skill._id} className="flex items-center justify-between rounded-2xl border bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900 shadow-sm hover:shadow-md transition">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div 
                    className="h-10 w-10 flex-shrink-0 text-neutral-500 dark:text-neutral-400" 
                    dangerouslySetInnerHTML={{ __html: skill.icon }} 
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold dark:text-white truncate">{skill.name}</h4>
                    <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                      <span className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-full">
                        {skill.category}
                      </span>
                      <span>• Order: {skill.order}</span>
                      {skill.percentage && (
                        <>
                          <span>•</span>
                          <span className="text-blue-500">{skill.percentage}%</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0 ml-2">
                  <button 
                    onClick={() => handleEdit(skill)} 
                    className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-neutral-500 hover:text-blue-500 transition"
                    title="Edit"
                  >
                    <Pencil size={16}/>
                  </button>
                  <button 
                    onClick={() => handleDelete(skill._id!)} 
                    className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-neutral-500 hover:text-red-500 transition"
                    title="Delete"
                  >
                    <Trash2 size={16}/>
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