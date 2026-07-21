import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";
import Hero from '@/models/Hero';
import Link from "next/link";
import Image from "next/image";

// Revalidate every hour for ISR, or set to 0 for dynamic
export const revalidate = 3600; 

async function getPortfolioData() {
  await connectToDatabase();
  const [heroData, featuredProjects] = await Promise.all([
    Hero.findOne(),
    Project.find({ featured: true }).limit(3).lean()
  ]);
  return { heroData, featuredProjects };
}

export default async function HomePage() {
  const { heroData, featuredProjects } = await getPortfolioData();

  if (!heroData) {
    return (
      <main className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <p className="text-neutral-400">Content is currently unavailable. Please configure your MongoDB connection.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      {/* HERO SECTION */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center">
        <h1 className="text-6xl font-bold mb-4 bg-clip-text text-transparent  from-blue-400 to-emerald-400">
          {heroData?.name || "Portfolio Name"}
        </h1>
        <p className="text-2xl text-neutral-400 mb-8">{heroData?.designation}</p>
        <div className="flex gap-4">
          <Link href="/projects" className="px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-neutral-200 transition">
            View Work
          </Link>
          <Link href="/contact" className="px-6 py-3 border border-neutral-700 font-semibold rounded-full hover:bg-neutral-800 transition">
            Contact Me
          </Link>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-12">Featured Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProjects.map((project) => (
            <div key={project._id.toString()} className="bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800 hover:border-neutral-600 transition">
              <div className="relative h-48 w-full">
                <Image src={project.thumbnail} alt={project.title} fill className="object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-neutral-400 mb-4 line-clamp-2">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech: string) => (
                    <span key={tech} className="text-xs bg-neutral-800 px-2 py-1 rounded-md">{tech}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}