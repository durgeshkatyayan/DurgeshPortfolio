"use client";

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Image from "next/image";
import Loader from "@/components/ui/Loader";
import {
  useScroll,
  useTransform,
  motion,
} from "motion/react";

// Match your API Data Interface
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
}

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [isContainerReady, setIsContainerReady] = useState(false);

  // Refs for the timeline scroll animation
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  // Fetch Data from your Backend
  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const { data } = await axios.get("/api/experience");

        // Sort descending by startDate (newest first)
        const sortedData = data.sort((a: Experience, b: Experience) =>
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
    
    updateHeight(); // Initial calculation
    const observer = new ResizeObserver(updateHeight);
    observer.observe(ref.current);
    
    return () => observer.disconnect();
  }, [experiences]);

  // Scroll Animation Logic - now conditionally uses the ref
  const { scrollYProgress } = useScroll({
    target: isContainerReady ? containerRef : undefined,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  // Show Loader while fetching
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-950">
        <Loader />
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-neutral-950 font-sans" ref={containerRef}>
      {/* Header Section */}
      <div className="max-w-7xl mx-auto py-3">
        <h2 className="text-lg md:text-3xl  text-black dark:text-white ps-2 md:ps-0 max-w-4xl">
          My Work Experience
        </h2>
        <div className="w-[10rem] -top-1 md:left-18 relative">
          <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
          <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
        </div>
        <p className="text-neutral-700 dark:text-neutral-300 ps-2 md:ps-0 text-sm md:text-base max-w-sm">
          Here&apos;s a timeline of my professional journey.
        </p>
      </div>

      <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
        {experiences.map((exp, index) => {
          const startYear = new Date(exp.startDate).getFullYear().toString();
          const dateOptions: Intl.DateTimeFormatOptions = { month: "short", year: "numeric" };
          const startMonth = new Date(exp.startDate).toLocaleDateString("en-US", dateOptions);
          const endMonth = exp.isCurrent
            ? "Present"
            : exp.endDate
              ? new Date(exp.endDate).toLocaleDateString("en-US", dateOptions)
              : "";

          return (
            <div key={index} className="flex justify-start pt-10 md:pt-20 md:gap-10">
              {/* Left Sticky Column (Year, Circle & Company Logo) */}
              <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
                {/* The Circle */}
                <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-white dark:bg-black flex items-center justify-center">
                  <div className="h-4 w-4 rounded-full bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 p-2" />
                </div>
                
                {/* The Year */}
                <h3 className="hidden md:block text-xl md:pl-20 md:text-5xl font-bold text-neutral-500 dark:text-neutral-500">
                  {startYear}
                </h3>

                {/* Company Logo */}
                {exp.logo && (
                  <div className="hidden md:block absolute md:left-[120px] lg:left-[200px] w-12 h-12 rounded-full overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm">
                    <Image
                      src={exp.logo}
                      alt={`${exp.company} logo`}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
              </div>

              {/* Right Content Column */}
              <div className="relative pl-20 pr-4 md:pl-4 w-full">
                <h3 className="md:hidden block text-2xl mb-4 text-left font-bold text-neutral-500 dark:text-neutral-500">
                  {startYear}
                </h3>
                
                {/* Actual Experience Details */}
                <div>
                  <h4 className="text-xl md:text-3xl font-bold text-neutral-900 dark:text-white mb-2 tracking-tight">
                    {exp.position}
                  </h4>
                  <p className="text-sm md:text-base font-medium text-blue-600 dark:text-blue-500 mb-4">
                    {exp.company} <span className="text-neutral-400 mx-2">•</span> {startMonth} — {endMonth}
                  </p>

                  <p className="mb-4 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200 leading-relaxed whitespace-pre-line">
                    {exp.description}
                  </p>

                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="mb-8 grid grid-cols-1 sm:grid-cols-5   gap-4">
                      {exp.technologies.map((tech, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-neutral-700 md:text-sm dark:text-neutral-300">
                          <span className="text-emerald-500 dark:text-emerald-400">✓</span> {tech}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* The Scroll Progress Line */}
        {height > 0 && containerRef.current && (
          <div
            style={{ height: height + "px" }}
            className="absolute md:left-3 left-3 top-0 z-50 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-200 dark:via-neutral-700 via-[10%] via-[90%] to-transparent to-[100%]"
          >
            <motion.div
              style={{
                height: heightTransform,
                opacity: opacityTransform,
              }}
              className="absolute inset-x-0 top-0 z-50 w-[2px] bg-gradient-to-t from-purple-500 via-blue-500 to-transparent from-[0%] via-[10%] rounded-full"
            />
          </div>
        )}
      </div>
    </div>
  );
}