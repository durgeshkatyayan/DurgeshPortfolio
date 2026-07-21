import { connectToDatabase } from "@/lib/mongodb";
import About, { type AboutDocument } from "@/models/About";
import Hero, { type HeroDocument } from "@/models/Hero";
import Education, { type EducationDocument } from "@/models/Education";
import Image from "next/image";
import { Download, GraduationCap } from "lucide-react";

export const revalidate = 3600;

export default async function AboutPage() {
  await connectToDatabase();
  
  const [aboutData, heroData, educationData] = await Promise.all([
    About.findOne().lean<AboutDocument>(),
    Hero.findOne().lean<HeroDocument>(),
    Education.find().sort({ order: 1, year: -1 }).lean<EducationDocument[]>()
  ]);

  if (!aboutData || !heroData) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <main className="min-h-screen py-24 px-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Image & Quick Info */}
        <div className="lg:col-span-5 space-y-8">
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl">
            <Image 
              src={heroData?.photo || "/default-profile.png"}
              alt={heroData?.name || "Profile"}
              fill 
              className="object-cover grayscale hover:grayscale-0 transition duration-700" 
            />
          </div>
          
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
            <h3 className="text-xl font-bold mb-4 border-b border-neutral-800 pb-2">Languages</h3>
            <div className="flex flex-wrap gap-2">
              {aboutData.languages?.map((lang: string) => (
                <span key={lang} className="bg-neutral-950 px-4 py-2 rounded-lg text-sm font-medium text-neutral-300">
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Biography & Education */}
        <div className="lg:col-span-7 space-y-12">
          <section>
            <h1 className="text-5xl font-bold mb-6">About Me</h1>
            <div 
              className="prose prose-invert prose-lg max-w-none text-neutral-300 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: aboutData.biography }}
            />
            {aboutData.resumeUrl && (
              <a 
                href={aboutData.resumeUrl} 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition"
              >
                <Download size={20} /> Download Resume
              </a>
            )}
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <GraduationCap className="text-blue-500" size={32} /> Education
            </h2>
            <div className="space-y-6">
              {educationData.map((edu) => (
                <div key={edu._id.toString()} className="relative pl-8 before:absolute before:left-0 before:top-2 before:w-3 before:h-3 before:bg-blue-500 before:rounded-full before:ring-4 before:ring-neutral-900 border-l border-neutral-800 ml-1">
                  <span className="text-blue-400 font-bold text-sm mb-1 block">{edu.year}</span>
                  <h3 className="text-xl font-bold text-white">{edu.degree}</h3>
                  <p className="text-neutral-400 font-medium">{edu.college}</p>
                  {edu.description && <p className="text-neutral-500 text-sm mt-2">{edu.description}</p>}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}