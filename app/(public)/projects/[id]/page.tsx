import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";
import { notFound } from "next/navigation";
import {  ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import Image from "next/image";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  await connectToDatabase();
  const project = await Project.findById(id).lean();
  if (!project) return {};
  return {
    title: `${project.title} | Portfolio`,
    description: project.description,
  };
}

export default async function ProjectDetailsPage({ params }: Props) {
  const { id } = await params;
  await connectToDatabase();
  
  // Use .lean() for performance since we only need standard JS objects for rendering
  const project = await Project.findById(id).lean();

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen py-24 px-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <span className="text-blue-400 font-semibold uppercase tracking-wider text-sm">
          {project.category}
        </span>
        <h1 className="text-5xl font-bold mt-2 mb-6">{project.title}</h1>
        
        <div className="flex flex-wrap gap-4 mb-8">
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg hover:bg-neutral-800 transition">
              <FaGithub className="h-5 w-5" /> View Source
            </a>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              <ExternalLink size={18} /> Live Preview
            </a>
          )}
        </div>
      </div>

      {/* Main Media */}
      <div className="w-full aspect-video relative rounded-2xl overflow-hidden mb-12 border border-neutral-800">
        <Image src={project.thumbnail} alt={project.title} fill className="object-cover" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2 prose prose-invert max-w-none text-neutral-300">
          <h2 className="text-2xl font-bold text-white mb-4">About the Project</h2>
          <p className="whitespace-pre-wrap leading-relaxed">{project.description}</p>
        </div>

        <div className="space-y-8">
          <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800">
            <h3 className="text-lg font-bold mb-4">Technologies Used</h3>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech: string) => (
                <span key={tech} className="bg-neutral-950 border border-neutral-800 px-3 py-1 rounded-md text-sm text-neutral-300">
                  {tech}
                </span>
              ))}
            </div>
          </div>
          
          <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800">
            <h3 className="text-lg font-bold mb-2">Status</h3>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${project.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}