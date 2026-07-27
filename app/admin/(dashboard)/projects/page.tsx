"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { Plus, Edit, Trash2, ExternalLink, Briefcase, Star } from "lucide-react";
import toast from "react-hot-toast";
import Loader from "@/components/ui/Loader";

interface Project {
  _id: string;
  title: string;
  category: string;
  status: "completed" | "in-progress";
  featured: boolean;
  thumbnail: string; // Added to show rich previews
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const { data } = await axios.get("/api/projects");
      setProjects(data);
    } catch (error) {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await axios.delete(`/api/projects/${id}`);
      toast.success("Project deleted successfully");
      setProjects(projects.filter(p => p._id !== id));
    } catch (error) {
      toast.error("Failed to delete project");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] w-full items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-8 md:py-8 pb-24">
      
      {/* Page Header */}
      <div className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
            Manage Projects
          </h1>
          <p className="mt-2 text-sm sm:text-base text-neutral-500 dark:text-neutral-400">
            Create, edit, and organize your portfolio case studies.
          </p>
        </div>
        <Link 
          href="/admin/projects/new" 
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 active:scale-95"
        >
          <Plus size={18} /> Add New Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-3xl border border-neutral-200 border-dashed p-12 text-center dark:border-neutral-800">
          <Briefcase className="mx-auto mb-4 text-neutral-400" size={48} />
          <h3 className="text-xl font-bold text-white mb-2">No projects yet</h3>
          <p className="text-neutral-500 mb-6 max-w-sm mx-auto">
            You haven't added any projects to your portfolio. Click the button above to create your first case study.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {projects.map((project) => (
            <div 
              key={project._id} 
              className="group flex flex-col overflow-hidden rounded-[24px] border border-neutral-200 bg-white shadow-sm transition-all hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900 hover:dark:border-neutral-700"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video w-full overflow-hidden bg-neutral-100 dark:bg-neutral-950">
                {project.thumbnail ? (
                  <Image 
                    src={project.thumbnail} 
                    alt={project.title} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-neutral-400">
                    <Briefcase size={32} />
                  </div>
                )}
                
                {/* Image Overlay Gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Top Badges */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  {project.featured && (
                    <span className="flex items-center gap-1 rounded-full bg-amber-500/90 backdrop-blur-md px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-sm">
                      <Star size={12} className="fill-white" /> Featured
                    </span>
                  )}
                  <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-sm ${
                    project.status === 'completed' 
                      ? 'bg-emerald-500/90 text-white' 
                      : 'bg-blue-500/90 text-white'
                  }`}>
                    {project.status.replace('-', ' ')}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="flex flex-col flex-grow p-6">
                <span className="mb-2 text-xs font-bold uppercase tracking-widest text-blue-500">
                  {project.category}
                </span>
                <h3 className="mb-4 text-xl font-extrabold text-neutral-900 dark:text-white line-clamp-1">
                  {project.title}
                </h3>
                
                {/* Spacer to push actions to bottom */}
                <div className="mt-auto pt-4 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-end gap-2">
                  
                  <Link 
                    href={`/projects/${project._id}`} 
                    target="_blank" 
                    className="flex items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800 p-2.5 text-neutral-500 transition hover:bg-neutral-200 dark:hover:bg-neutral-700 dark:hover:text-white"
                    title="View Live Page"
                  >
                    <ExternalLink size={18} />
                  </Link>

                  <Link 
                    href={`/admin/projects/${project._id}`} 
                    className="flex items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800 p-2.5 text-neutral-500 transition hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400"
                    title="Edit Project"
                  >
                    <Edit size={18} />
                  </Link>

                  <button 
                    onClick={() => handleDelete(project._id, project.title)} 
                    className="flex items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800 p-2.5 text-neutral-500 transition hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                    title="Delete Project"
                  >
                    <Trash2 size={18} />
                  </button>
                  
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}