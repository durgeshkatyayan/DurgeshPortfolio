"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { Plus, Edit, Trash2, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

interface Project {
  _id: string;
  title: string;
  category: string;
  status: string;
  featured: boolean;
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

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await axios.delete(`/api/projects/${id}`);
      toast.success("Project deleted successfully");
      setProjects(projects.filter(p => p._id !== id));
    } catch (error) {
      toast.error("Failed to delete project");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Projects</h1>
        <Link 
          href="/admin/projects/new" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition"
        >
          <Plus size={20} /> Add Project
        </Link>
      </div>

      {loading ? (
        <div className="animate-pulse bg-white dark:bg-neutral-900 rounded-xl h-64 border border-neutral-200 dark:border-neutral-800"></div>
      ) : (
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
                <th className="p-4 font-semibold">Title</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project._id} className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition">
                  <td className="p-4 font-medium flex items-center gap-2">
                    {project.title}
                    {project.featured && <span className="px-2 py-0.5 text-[10px] bg-amber-100 text-amber-700 rounded-full uppercase font-bold tracking-wider">Featured</span>}
                  </td>
                  <td className="p-4 text-neutral-500">{project.category}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${project.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="p-4 flex justify-end gap-3">
                    <Link href={`/projects/${project._id}`} target="_blank" className="text-neutral-400 hover:text-blue-500 transition">
                      <ExternalLink size={18} />
                    </Link>
                    {/* Add Edit link pointing to an edit form */}
                    <button className="text-neutral-400 hover:text-emerald-500 transition">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(project._id)} className="text-neutral-400 hover:text-red-500 transition">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {projects.length === 0 && <div className="p-8 text-center text-neutral-500">No projects found.</div>}
        </div>
      )}
    </div>
  );
}