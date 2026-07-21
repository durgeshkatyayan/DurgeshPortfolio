"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Project {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  techStack: string[];
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const categories = ["All", "Frontend", "Backend", "Full Stack", "Mobile"];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await axios.get("/api/projects");
        setProjects(data);
        setFilteredProjects(data);
      } catch (error) {
        console.error("Failed to load projects", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    let result = projects;
    if (activeCategory !== "All") {
      result = result.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());
    }
    if (searchQuery) {
      result = result.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    setFilteredProjects(result);
  }, [searchQuery, activeCategory, projects]);

  return (
    <main className="min-h-screen bg-neutral-950 text-white py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">My Portfolio</h1>
        <p className="text-neutral-400 max-w-2xl mx-auto">A collection of my latest work, side projects, and open-source contributions.</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition ${
                activeCategory === cat ? "bg-blue-600 text-white" : "bg-neutral-900 text-neutral-400 hover:bg-neutral-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-full bg-neutral-900 border border-neutral-800 focus:border-blue-500 outline-none transition"
          />
        </div>
      </div>

      {/* Grid with Skeleton Loaders */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          [1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse bg-neutral-900 rounded-2xl border border-neutral-800 p-4">
              <div className="h-48 bg-neutral-800 rounded-xl mb-4 w-full"></div>
              <div className="h-6 bg-neutral-800 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-neutral-800 rounded w-full mb-2"></div>
              <div className="h-4 bg-neutral-800 rounded w-5/6"></div>
            </div>
          ))
        ) : (
          <AnimatePresence>
            {filteredProjects.map((project, idx) => (
              <motion.div
                key={project._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden hover:border-neutral-600 transition group"
              >
                <Link href={`/projects/${project._id}`}>
                  <div className="relative h-56 w-full overflow-hidden">
                    <img src={project.thumbnail} alt={project.title} className="object-cover w-full h-full group-hover:scale-105 transition duration-500" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-white">{project.title}</h3>
                    <p className="text-neutral-400 text-sm line-clamp-2 mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.slice(0, 3).map((tech) => (
                        <span key={tech} className="text-xs bg-neutral-800 text-neutral-300 px-3 py-1 rounded-full">
                          {tech}
                        </span>
                      ))}
                      {project.techStack.length > 3 && (
                        <span className="text-xs bg-neutral-800 text-neutral-300 px-3 py-1 rounded-full">+{project.techStack.length - 3}</span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {!loading && filteredProjects.length === 0 && (
        <div className="text-center py-20 text-neutral-500">No projects found matching your criteria.</div>
      )}
    </main>
  );
}