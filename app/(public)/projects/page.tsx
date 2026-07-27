"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ExternalLink, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { PinContainer } from "@/components/ui/3d-pin";

interface Project {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  featured: boolean;
  thumbnail: string;
  techStack: string[];
  githubUrl?: string; // Added optional githubUrl
  liveUrl?: string;   // Added optional liveUrl
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
    <main className="min-h-screen bg-neutral-950 text-white py-2 px-0 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2">My Projects</h1>
        <div className="w-[10rem] -top-1 left-66  relative">
          <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
          <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
          {/* <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" /> */}
          {/* <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" /> */}
          {/* <div className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div> */}
        </div>
        <p className="text-neutral-400 max-w-2xl mx-auto">A collection of my latest work, side projects, and open-source contributions.</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition ${activeCategory === cat ? "bg-blue-600 text-white" : "bg-neutral-900 text-neutral-400 hover:bg-neutral-800"
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          [1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse bg-neutral-900/50 rounded-3xl border border-neutral-800 p-4">
              <div className="aspect-video bg-neutral-800/80 rounded-2xl mb-4 w-full"></div>
              <div className="h-6 bg-neutral-800/80 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-neutral-800/80 rounded w-full mb-2"></div>
              <div className="h-4 bg-neutral-800/80 rounded w-5/6"></div>
            </div>
          ))
        ) : (
          <AnimatePresence>
            <PinContainer
              title="/ui.aceternity.com"
              href="https://twitter.com/mannupaaji"
            >
              {filteredProjects.map((project, idx) => (
                <motion.div
                  key={project._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="group flex flex-col bg-neutral-900/40 backdrop-blur-sm rounded-3xl border border-neutral-800/60 overflow-hidden hover:bg-neutral-900/80 hover:border-neutral-500 transition-all duration-500 shadow-sm hover:shadow-2xl hover:-translate-y-2"
                >
                  {/* Image Header (Clickable) */}
                  <Link href={`/projects/${project._id}`} className="relative aspect-video w-full overflow-hidden block bg-neutral-950 shrink-0 p-.5">
                    <div className="relative w-full h-full overflow-hidden border border-neutral-800/50 bg-neutral-900/50">
                      <img
                        src={project.thumbnail}
                        alt={project.title}

                        className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100"
                      />
                    </div>
                    {/* Overlay Gradient for depth */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </Link>

                  {/* Card Body */}
                  <div className="p-3 flex flex-col grow">
                    <Link href={`/projects/${project._id}`} className="inline-block mb-1">
                      <h3 className="text-xl font-extrabold text-white group-hover:text-blue-400 transition-colors duration-300">
                        {project.title}
                      </h3>
                    </Link>

                    <p className="text-neutral-400 text-xs line-clamp-2 mb-4 leading-relaxed">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.techStack?.slice(0, 5).map((tech) => (
                        <span key={tech} className="text-[11px] font-bold  tracking-wider bg-neutral-800/80 text-neutral-300 px-2 py-1 rounded-lg border border-neutral-700/50 shadow-sm">
                          {tech}
                        </span>
                      ))}
                      {project.techStack?.length > 5 && (
                        <span className="text-[11px] font-bold uppercase tracking-wider bg-neutral-800/80 text-neutral-300 px-3 py-1.5 rounded-lg border border-neutral-700/50 shadow-sm">
                          +{project.techStack.length - 5}
                        </span>
                      )}
                    </div>

                    <div className="mt-auto pt-2 border-t border-neutral-800/80 flex items-center justify-between">

                      {/* Left side: External Links */}
                      <div className="flex items-center gap-3">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 -ml-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                            title="View Source Code"
                          >
                            {/* Assuming you are using lucide-react or react-icons */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
                          </a>
                        )}
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 text-neutral-400 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-colors"
                            title="View Live Demo"
                          >
                            <ExternalLink size={20} />
                          </a>
                        )}
                      </div>

                      {/* Right side: View Details Link */}
                      <Link
                        href={`/projects/${project._id}`}
                        className="group/link flex items-center gap-1.5 text-sm font-bold text-blue-500 hover:text-blue-400 transition-colors"
                      >
                        Details <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                      </Link>

                    </div>
                  </div>
                </motion.div>
              ))}
         </PinContainer>
          </AnimatePresence>
        )}
      </div>

      {!loading && filteredProjects.length === 0 && (
        <div className="text-center py-20 text-neutral-500">No projects found matching your criteria.</div>
      )}
    </main>
  );
}