"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";

interface Experience {
  _id: string;
  company: string;
  position: string;
  description: string;
  technologies: string[];
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
}

export default function ExperienceTimeline() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const { data } = await axios.get("/api/experience");
        setExperiences(data);
      } catch (error) {
        console.error("Failed to load experiences", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExperiences();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading timeline...</div>;
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white py-24 px-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-16 text-center tracking-tight">Professional Journey</h1>

      <div className="relative border-l border-neutral-800 ml-4 md:ml-0 md:mx-auto md:w-full">
        {experiences.map((exp, index) => {
          const dateOptions: Intl.DateTimeFormatOptions = { month: "short", year: "numeric" };
          const start = new Date(exp.startDate).toLocaleDateString("en-US", dateOptions);
          const end = exp.isCurrent ? "Present" : exp.endDate ? new Date(exp.endDate).toLocaleDateString("en-US", dateOptions) : "";

          return (
            <motion.div
              key={exp._id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="mb-12 ml-10 md:ml-0 md:flex md:items-center md:justify-between w-full"
            >
              {/* Timeline Dot */}
              <div className="absolute -left-3 md:left-1/2 md:-translate-x-1/2 bg-blue-600 w-6 h-6 rounded-full border-4 border-neutral-950 flex items-center justify-center">
                <Briefcase size={10} className="text-white" />
              </div>

              {/* Content Card */}
              <div className={`md:w-5/12 ${index % 2 === 0 ? 'md:pr-12 md:text-right md:ml-auto' : 'md:pl-12'}`}>
                <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl hover:border-neutral-700 transition">
                  <span className="text-blue-400 font-semibold text-sm block mb-2">{start} - {end}</span>
                  <h3 className="text-xl font-bold">{exp.position}</h3>
                  <h4 className="text-lg text-neutral-400 mb-4">{exp.company}</h4>
                  <p className="text-sm text-neutral-300 mb-4 leading-relaxed">{exp.description}</p>
                  
                  <div className={`flex flex-wrap gap-2 ${index % 2 === 0 ? 'md:justify-end' : ''}`}>
                    {exp.technologies.map((tech) => (
                      <span key={tech} className="text-xs bg-neutral-800 text-neutral-300 px-2 py-1 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </main>
  );
}