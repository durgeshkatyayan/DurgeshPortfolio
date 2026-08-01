"use client";

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Image from "next/image";
import Loader from "@/components/ui/Loader";
import { useScroll, useTransform, motion } from "motion/react";
import { SparklesCore } from "@/components/ui/sparkles";
import {
  Building2,
  Calendar,
  MapPin,
  Globe,
  Laptop,
  CheckCircle2,
  Wifi,
  Briefcase,
} from "lucide-react";

export type EmploymentType =
  | "Full-time"
  | "Part-time"
  | "Contract"
  | "Internship"
  | "Freelance"
  | "Training";

export type WorkMode = "Remote" | "Hybrid" | "On-site";

interface Experience {
  _id: string;
  company: string;
  logo?: string;
  position: string;
  description: string;
  technologies: string[];
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  employmentType?: EmploymentType;
  workMode?: WorkMode;
  location?: string;
  companyUrl?: string;
}

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [isContainerReady, setIsContainerReady] = useState(false);

  // Refs for timeline scroll animation
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  // Fetch Data from Backend
  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const { data } = await axios.get("/api/experience");

        // Sort descending by startDate (newest first)
        const sortedData = data.sort(
          (a: Experience, b: Experience) =>
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );

        setExperiences(sortedData);
      } catch (error) {
        console.error("Failed to load experiences", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  // Check if container is ready after loading completes
  useEffect(() => {
    if (!loading && containerRef.current) {
      setIsContainerReady(true);
    }
  }, [loading]);

  // Calculate height for the timeline line
  useEffect(() => {
    if (!ref.current) return;

    const updateHeight = () => {
      setHeight(ref.current?.getBoundingClientRect().height || 0);
    };

    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [experiences]);

  // Scroll Animation Logic
  const { scrollYProgress } = useScroll({
    target: isContainerReady ? containerRef : undefined,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  // Helper function for Work Mode badge styling
  const getWorkModeBadge = (mode?: WorkMode) => {
    if (!mode) return null;

    const styles: Record<WorkMode, string> = {
      Remote:
        "bg-purple-500/10 text-purple-600 dark:text-purple-300 border-purple-500/20",
      Hybrid:
        "bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/20",
      "On-site":
        "bg-sky-500/10 text-sky-600 dark:text-sky-300 border-sky-500/20",
    };

    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[mode]}`}
      >
        <Wifi size={11} className="shrink-0" />
        {mode}
      </span>
    );
  };

  // Show Loader while fetching
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-950">
        <Loader />
      </div>
    );
  }

  return (
    <div
      className="w-full bg-white dark:bg-neutral-950 font-sans px-3  transition-colors duration-300"
      ref={containerRef}
    >

      <div className="max-w-7xl mx-auto py-5 md:py-8 ">
        <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
          My Work Experience
        </h2>

        {/* Sparkle Banner FX */}
        <div className="md:w-[40rem] w-[20rem] top-0 -left-10 md:-left-28 relative">
          <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
          <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
          <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
          <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />
          <SparklesCore
            background="transparent"
            minSize={0.4}
            maxSize={1}
            particleDensity={1200}
            className="w-full h-full"
            particleColor="#FFFFFF"
          />

          {/* Radial Gradient mask */}
          <div className="absolute inset-0 w-full h-full bg-white dark:bg-neutral-950 [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]" />
        </div>

        <p className="text-neutral-600 dark:text-neutral-300 text-sm md:text-base max-w-2xl leading-relaxed mt-3">
          My journey is built on curiosity, continuous learning, and creating
          impactful digital experiences. Explore the milestones that reflect my
          growth as a Full Stack Developer, from academic achievements to
          professional projects and real-world solutions.
        </p>
      </div>

      <div ref={ref} className="relative max-w-7xl mx-auto pb-16 md:pb-24">
        {experiences.map((exp, index) => {
          const startYear = new Date(exp.startDate).getFullYear().toString();
          const dateOptions: Intl.DateTimeFormatOptions = {
            month: "short",
            year: "numeric",
          };
          const startMonth = new Date(exp.startDate).toLocaleDateString(
            "en-US",
            dateOptions
          );
          const endMonth = exp.isCurrent
            ? "Present"
            : exp.endDate
            ? new Date(exp.endDate).toLocaleDateString("en-US", dateOptions)
            : "";

          return (
            <div
              key={exp._id || index}
              className="flex justify-start pt-10 gap-4 "
            >
              <div className="sticky flex flex-col md:flex-row z-40 items-center top-28 sm:top-36 self-start max-w-xs lg:max-w-sm md:w-full">

                <div className="h-9 w-9 absolute  md:left-2 rounded-full bg-white dark:bg-neutral-950 flex items-center justify-center border border-neutral-200 dark:border-neutral-800 shadow-md">
                  <div className="h-3.5 w-3.5 rounded-full bg-indigo-500 dark:bg-indigo-400 animate-pulse" />
                </div>

                <h3 className="hidden md:block text-2xl md:pl-20 md:text-5xl font-black text-neutral-400 dark:text-neutral-600 tracking-tighter">
                  {startYear}
                </h3>
                {exp.logo && (
                  <div className="hidden md:flex absolute md:left-[130px] lg:left-[210px] w-12 h-12 rounded-xl overflow-hidden bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm items-center justify-center p-1.5 hover:scale-105 transition-transform duration-200">
                    <Image
                      src={exp.logo}
                      alt={`${exp.company} logo`}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
              </div>

              <div className="relative w-full">
                <h3 className="md:hidden block text-xl font-bold text-neutral-500 dark:text-neutral-400 mb-2">
                  {startYear}
                </h3>

                <div className="group rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/50 backdrop-blur-md p-4 sm:p-7 shadow-xs hover:shadow-xl hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-300">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <h4 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {exp.position}
                    </h4>
                    {exp.isCurrent && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                        Current Role
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {exp.companyUrl ? (
                      <a
                        href={exp.companyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs md:text-lg font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        <Building2 size={16} className="shrink-0" />
                        {exp.company}
                        <Globe size={13} className="shrink-0 opacity-70" />
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs md:text-base font-semibold text-slate-700 dark:text-neutral-400">
                        <Building2 size={16} className="shrink-0 text-neutral-500" />
                        {exp.company}
                      </span>
                    )}

                    {getWorkModeBadge(exp.workMode)}

                    {/* Employment Type Badge */}
                    {exp.employmentType && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2.5 py-0.5 rounded-md border border-neutral-200 dark:border-neutral-700">
                        <Briefcase size={11} className="shrink-0" />
                        {exp.employmentType}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-2 text-xs md:text-sm text-neutral-500 dark:text-neutral-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-neutral-400 dark:text-neutral-500 shrink-0" />
                      <span>
                        {startMonth} — {endMonth}
                      </span>
                    </div>

                    {exp.location && (
                      <div className="flex items-center gap-1.5">
                        <MapPin size={14} className="text-neutral-400 dark:text-neutral-500 shrink-0" />
                        <span>{exp.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="mb-6 text-xs sm:text-sm text-gray-500 dark:text-neutral-300 leading-snug whitespace-pre-line text-justify">
                    {exp.description}
                  </p>

                  {/* Tech Stack List */}
                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
                      <h5 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-2.5">
                        Technologies & Skills
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech, idx) => (
                          <div
                            key={idx}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/80 px-2.5 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300 shadow-2xs hover:border-indigo-500/30 transition-colors"
                          >
                            <CheckCircle2
                              size={12}
                              className="text-emerald-500 dark:text-emerald-400 shrink-0"
                            />
                            <span>{tech}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {height > 0 && containerRef.current && (
          <div
            style={{ height: height + "px" }}
            className="absolute left-5 md:left-6 top-0 z-30 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent via-neutral-200 dark:via-neutral-800 to-transparent"
          >
            <motion.div
              style={{
                height: heightTransform,
                opacity: opacityTransform,
              }}
              className="absolute inset-x-0 top-0 z-30 w-[2px] bg-gradient-to-t from-purple-500 via-indigo-500 to-sky-400 rounded-full"
            />
          </div>
        )}
      </div>
    </div>
  );
}