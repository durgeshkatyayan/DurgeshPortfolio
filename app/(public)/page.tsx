import { connectToDatabase } from "@/lib/mongodb";
import Profile, { IProfile } from "@/models/Profile";
import Project from "@/models/Project";
import Skill from "@/models/Skill";
import Blog from "@/models/Blog";
import Statistic from "@/models/Statistic";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Code2, Terminal, ExternalLink } from "lucide-react";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
// import AnimatedCounter from "@/components/public/AnimatedCounter"; // The component we built earlier

export const revalidate = 3600; // ISR: Revalidate every hour

async function getHomepageData(): Promise<{
  profile: IProfile | null;
  featuredProjects: any[];
  topSkills: any[];
  latestBlogs: any[];
  statistics: any[];
}> {
  await connectToDatabase();

  const [
    profile,
    featuredProjects,
    topSkills,
    latestBlogs,
    statistics,
  ] = await Promise.all([
    Profile.findOne().lean<IProfile | null>(),
    Project.find({ featured: true }).limit(4).lean(),
    Skill.find().sort({ order: 1, percentage: -1 }).limit(8).lean(),
    Blog.find({ isPublished: true }).sort({ createdAt: -1 }).limit(2).lean(),
    Statistic.find().sort({ order: 1 }).lean(),
  ]);

  return {
    profile,
    featuredProjects,
    topSkills,
    latestBlogs,
    statistics,
  };
}

export default async function HomePage() {
  const { profile, featuredProjects, topSkills, latestBlogs, statistics } = await getHomepageData();;

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-neutral-500">Please configure your profile in the Admin Dashboard.</p>
      </div>
    );
  }

  return (
    <div className="space-y-24 pb-20">

      {/* 1. HERO SECTION (Right Panel specific) */}
      <section className="pt-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900 border border-neutral-800 text-sm text-neutral-300 mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          {profile.availabilityStatus} for new opportunities
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
          Building Digital <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400">
            Experiences.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mb-10 leading-relaxed">
          I'm a full-stack developer specializing in building exceptional digital experiences. Currently, I'm focused on building accessible, human-centered products at {profile.currentCompany}.
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <Link href="/projects" className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-neutral-200 transition flex items-center gap-2">
            View Projects <ArrowRight size={18} />
          </Link>
          <Link href="/contact" className="px-8 py-4 bg-neutral-900 border border-neutral-800 text-white font-bold rounded-full hover:bg-neutral-800 transition">
            Let's Talk
          </Link>
        </div>
      </section>

      {/* 2. STATISTICS SECTION */}
      {statistics && statistics.length > 0 && (
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {statistics.map((stat: any) => (
            <AnimatedCounter key={stat._id.toString()} value={stat.value} suffix={stat.suffix} label={stat.label} />
          ))}
        </section>
      )}

      {/* 3. FEATURED SKILLS */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <Code2 className="text-blue-500" /> Core Technologies
          </h2>
          <Link href="/skills" className="text-sm font-medium text-neutral-400 hover:text-white transition flex items-center gap-1">
            View All <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {topSkills.map((skill: any) => (
            <div key={skill._id.toString()} className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 p-5 rounded-2xl hover:bg-neutral-800 transition flex items-center gap-4">
              <div
                className="w-10 h-10 text-neutral-300"
                dangerouslySetInnerHTML={{ __html: skill.icon }}
              />
              <div>
                <h3 className="font-semibold">{skill.name}</h3>
                <p className="text-xs text-neutral-500">{skill.category}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FEATURED PROJECTS */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <Terminal className="text-purple-500" /> Selected Works
          </h2>
          <Link href="/projects" className="text-sm font-medium text-neutral-400 hover:text-white transition flex items-center gap-1">
            All Projects <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featuredProjects.map((project: any) => (
            <Link href={`/projects/${project._id}`} key={project._id.toString()} className="group block">
              <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-2 transition duration-500 group-hover:border-neutral-600">
                <div className="relative aspect-video rounded-2xl overflow-hidden mb-6">
                  <Image src={project.thumbnail} alt={project.title} fill className="object-cover group-hover:scale-105 transition duration-700" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition duration-500" />
                </div>
                <div className="px-4 pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition">{project.title}</h3>
                    <ExternalLink className="text-neutral-500 group-hover:text-white transition opacity-0 group-hover:opacity-100" size={20} />
                  </div>
                  <p className="text-neutral-400 text-sm line-clamp-2 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.slice(0, 3).map((tech: string) => (
                      <span key={tech} className="text-xs font-medium bg-neutral-950 text-neutral-300 px-3 py-1.5 rounded-full border border-neutral-800">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. LATEST WRITINGS */}
      <section>
        <h2 className="text-3xl font-bold mb-8">Latest Writings</h2>
        <div className="grid grid-cols-1 gap-4">
          {latestBlogs.map((blog: any) => (
            <Link href={`/blog/${blog.slug}`} key={blog._id.toString()} className="flex flex-col md:flex-row gap-6 p-6 bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-2xl hover:bg-neutral-800 transition group">
              <div className="relative w-full md:w-48 h-32 flex-shrink-0 rounded-xl overflow-hidden">
                <Image src={blog.coverImage} alt={blog.title} fill className="object-cover group-hover:scale-110 transition duration-700" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-sm font-bold text-blue-400 mb-2 uppercase tracking-wider">{blog.category}</span>
                <h3 className="text-xl font-bold mb-2 group-hover:text-white transition">{blog.title}</h3>
                <p className="text-neutral-400 text-sm line-clamp-2">{blog.metaDescription || "Read more about this topic..."}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}