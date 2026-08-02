"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Award, ExternalLink, Calendar, Building2, ShieldCheck, ArrowUpRight } from "lucide-react";

// Interface matching your Mongoose Schema
interface Certificate {
  _id: string;
  title: string;
  organization: string;
  certificateImage: string;
  url?: string;
  issueDate: string; 
}

export default function CertificatesSection() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const { data } = await axios.get("/api/certificates");
        setCertificates(data);
      } catch (error) {
        console.error("Failed to load certificates", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCertificates();
  }, []);

  return (
    <section className="w-full py-16 border-neutral-800/50">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className=" mb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 ">
              <Award className="text-blue-500 " size={28} />
              <h2 className="text-2xl  md:text-3xl font-bold tracking-tight text-neutral-100">
                Licenses & Certifications
              </h2>
            </div>
            {/* <p className="text-neutral-400 text-sm md:text-base max-w-xl">
              Professional credentials and continuous learning achievements that back up my technical skill set.
            </p> */}
          </div>
        </div>

        {/* Grid Content */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse flex items-center gap-4 bg-neutral-900/30 rounded-2xl border border-neutral-800/60 p-5">
                <div className="h-16 w-16 bg-neutral-800 rounded-xl shrink-0"></div>
                <div className="flex-1">
                  <div className="h-5 bg-neutral-800 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-neutral-800 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : certificates.length === 0 ? (
          <div className="rounded-2xl border border-neutral-800/60 border-dashed p-8 text-center bg-neutral-900/20">
            <ShieldCheck className="mx-auto mb-3 text-neutral-600" size={32} />
            <p className="text-neutral-500 font-medium">No certifications added yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <AnimatePresence>
              {certificates.map((cert, idx) => {
                const dateOptions: Intl.DateTimeFormatOptions = { month: "short", year: "numeric" };
                const formattedDate = new Date(cert.issueDate).toLocaleDateString("en-US", dateOptions);

                return (
                  <motion.div
                    key={cert._id}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    className="group flex flex-col sm:flex-row sm:items-center gap-5 p-5 bg-neutral-900/40 backdrop-blur-sm rounded-2xl border border-neutral-800/60 hover:bg-neutral-900/80 hover:border-neutral-700 transition-all duration-300"
                  >
                    
                    {/* Compact Logo Area */}
                    <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-xl bg-white border border-neutral-200 dark:border-neutral-700 overflow-hidden shrink-0 shadow-inner flex items-center justify-center">
                      {cert.certificateImage ? (
                        <Image 
                          src={cert.certificateImage} 
                          alt={`${cert.organization} logo`} 
                          fill 
                          className="object-contain p-2 group-hover:scale-110 transition-transform duration-500" 
                        />
                      ) : (
                        <Award size={28} className="text-neutral-400" />
                      )}
                    </div>

                    {/* Content Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-neutral-100 group-hover:text-blue-400 transition-colors truncate mb-1">
                        {cert.title}
                      </h3>
                      
                      <div className="flex items-center gap-1.5 text-sm font-medium text-neutral-400 mb-2">
                        <Building2 size={14} className="text-neutral-500" />
                        <span className="truncate">{cert.organization}</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} /> Issued {formattedDate}
                        </span>
                        
                        {/* Verified Badge */}
                        <span className="flex items-center gap-1 text-emerald-500/90 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          <ShieldCheck size={12} /> Verified
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    {cert.url && (
                      <a 
                        href={cert.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="mt-3 sm:mt-0 shrink-0 flex items-center justify-center w-full sm:w-auto px-4 py-2 sm:p-3 rounded-xl bg-neutral-800/50 hover:bg-blue-500/10 text-neutral-400 hover:text-blue-400 border border-neutral-700/50 hover:border-blue-500/30 transition-all group/btn"
                        title="View Credential"
                      >
                        <span className="sm:hidden text-sm font-medium mr-2">View Credential</span>
                        <ArrowUpRight size={18} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                      </a>
                    )}
                    
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}