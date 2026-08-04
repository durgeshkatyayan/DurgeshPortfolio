
import { connectToDatabase } from "@/lib/mongodb";
import Profile, { IProfile } from "@/models/Profile";
import About from "@/models/About";
import Statistic from "@/models/Statistic";
import Education from "@/models/Education";
import Link from "next/link";
import { Download, User, GraduationCap, Activity, ExternalLink, Flame, MapPin } from "lucide-react";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import CodingAnalytics from "@/components/public/CodingActivity";
import { FaGithub } from "react-icons/fa";
import Image from "next/image";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import WhatIDo from "@/components/public/WhatIDo";
import { PointerHighlight } from "@/components/ui/pointer-highlight";
export const revalidate = 0;

interface IAboutData {
  biography: string;
  description: string;
  interests: string[];
  languages: string[];
  resumeUrl?: string;
}

interface IEducation {
  _id: any;
  degree: string;
  college: string;
  university?: string;
  location?: string;      // Added
  logo?: string;          // Added
  year: string;
  grade?: string;
  description?: string;
  achievements?: string;  // Added
  order: number;
}

async function getHomepageData() {
  await connectToDatabase();

  const [
    profile,
    about,
    statistics,
    educations,
  ] = await Promise.all([
    Profile.findOne().lean<IProfile | null>(),
    About.findOne().lean<IAboutData | null>(),
    Statistic.find().sort({ order: 1 }).lean(),
    // Fetch and sort education records
    Education.find().sort({ order: 1, year: -1 }).lean<IEducation[]>(),
  ]);

  return {
    profile,
    about,
    statistics,
    educations,
  };
}

export default async function HomePage() {
  const { profile, about, statistics, educations } = await getHomepageData();

  if (!profile) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <p className="text-neutral-500 text-lg">Please configure your profile in the Admin Dashboard.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 px-3 md:px-0">
      <section className="">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900 border border-neutral-800 text-sm text-neutral-300 mb-6 shadow-sm">
          <User size={16} className="text-blue-500" />
          <span>About Me</span>
        </div>

        <div className="w-[10rem] -top-5 -left-20 relative">
          <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
          <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
          {/* <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" /> */}
          {/* <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" /> */}
          {/* <div className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div> */}
        </div>

        {about ? (
          <div className="space-y-6">
            <div className="text-md text-neutral-400  max-w-3xl leading-6 space-y-3">
              {/* <p className=" text-justify">{about.description}</p> */}
              <TextGenerateEffect words={about.description} />
              <p className="text-sm text-justify">{about.biography}</p>
            </div>

            {/* Languages & Interests Tags */}
            <div className="flex flex-col gap-4 pt-4">
              {about.languages && about.languages.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-neutral-300 mr-2">Languages:</span>
                  {about.languages.map((lang, idx) => (
                    <span key={idx} className="px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-neutral-400">
                      {lang}
                    </span>
                  ))}
                </div>
              )}

              {about.interests && about.interests.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-neutral-300 mr-2">Interests:</span>
                  {about.interests.map((interest, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs text-blue-400">
                      {interest}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between md:justify-normal gap-4 pt-2">
              {about.resumeUrl && (
                <a
                  href={about.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="md:px-5 px-3 py-2 md:py-2 bg-white text-black font-bold rounded-xl hover:bg-neutral-200 transition flex items-center gap-2 shadow-lg"
                >
                  <Download size={18} /> Resume
                </a>
              )}

              <Link
                href="/contact"
              // className="px-8 py-3.5 bg-neutral-900 border border-neutral-800 text-white font-bold rounded-xl hover:bg-neutral-800 transition shadow-sm"
              >
                <HoverBorderGradient
                  containerClassName="rounded-full"
                  as="button"
                  className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2"
                >
                  Let's Talk
                </HoverBorderGradient>
              </Link>
            </div>
          </div>
        ) : (
          <p className="text-neutral-500">About me content is currently being updated.</p>
        )}
      </section>

      {/* 2. STATISTICS SECTION */}
      {statistics && statistics.length > 0 && (
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {statistics.map((stat: any) => (
            <AnimatedCounter key={stat._id.toString()} value={stat.value} suffix={stat.suffix} label={stat.label} />
          ))}
        </section>
      )}

      {/* 3. EDUCATION SECTION */}
      {educations && educations.length > 0 && (
        <section>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center justify-center p-2 rounded-2xl bg-neutral-900 border border-neutral-800  shadow-inner">
              <GraduationCap className="text-black-500" size={22} />
            </div>
            <h2 className="text-2xl f text-white tracking-tight">Education</h2>
          </div>

          <div className="relative border-l border-neutral-800 ml-4  md:ml-16 pl-4 md:pl-12 space-y-10">

            {educations.map((edu) => (
              <div key={edu._id.toString()} className="relative group">


                <div className="absolute -left-[26px] md:-left-[57px] top-1.5 flex items-center justify-center">
                  <span className="w-4 h-4 rounded-full bg-neutral-950 border-2 border-neutral-600 group-hover:border-emerald-500 transition-colors duration-500 relative z-10" />
                  <span className="absolute w-4 h-4 rounded-full bg-emerald-500/0 group-hover:bg-emerald-500/40 blur-md transition-all duration-500" />
                </div>

                <div className="relative overflow-hidden bg-gradient-to-br from-neutral-900/50 to-neutral-900/10 backdrop-blur-md border border-neutral-800/60 p-4 md:p-8 rounded-[24px] hover:bg-neutral-900/80 transition-all duration-500 shadow-sm group-hover:shadow-[0_0_30px_rgba(16,185,129,0.05)] group-hover:border-neutral-700">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-500/0 to-transparent group-hover:via-emerald-500/50 transition-all duration-700" />
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-1">
                    <BackgroundRippleEffect />
                    <div className="flex items-start gap-3">
                      {edu.logo && (
                        <div className="relative w-10 sm:w-14 h-10 sm:h-14 md:w-16 md:h-16 rounded-2xl overflow-hidden bg-white border border-neutral-200 dark:border-neutral-700/50 shrink-0 shadow-inner">
                          <Image src={edu.logo} alt={edu.college} fill className="object-contain " />
                        </div>
                      )}

                      <div className="pt-1">
                        <PointerHighlight
                          rectangleClassName="bg-neutral-200 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 leading-loose"
                          pointerClassName="text-yellow-500 h-3 w-3"
                          containerClassName="inline-block mr-1"
                        >
                          <h3 className="text-[17px] relative z-10  md:text-xl md:text-1.5xl font-bold text-white  group-hover:text-emerald-400 transition-colors duration-300">
                            {edu.degree}
                          </h3>
                        </PointerHighlight>
                        <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm font-medium">
                          <span className="">{edu.college}</span>
                          {edu.university && (
                            <>
                              <span className="text-neutral-700 hidden sm:inline">•</span>
                              <span className="text-neutral-300">{edu.university}</span>
                            </>
                          )}
                        </div>

                        {edu.location && (
                          <div className="flex items-center gap-1.5 text-neutral-500 text-sm mt-.5">
                            <MapPin size={14} className="text-neutral-600" />
                            <span>{edu.location}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0  md:mt-0 ">
                      <span className="inline-flex border p-1 shadow-blue-100 rounded-b-full items-center border-neutral-800/80  bg-neutral-950/60 justify-center md:px-4 md:*:py-1.5  
                      text-[11px] font-bold tracking-widest uppercase rounded-full shadow-sm">
                        {edu.year}
                      </span>
                    </div>
                  </div>

                  <hr className="border-neutral-800/80 mb-2" />
                  <div className="space-y-4">

                    {edu.grade && (
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-neutral-950/60 border
                       border-neutral-800/80 rounded-xl text-sm text-neutral-400 shadow-inner">
                        <span className="text-neutral-500 font-medium tracking-wide">Grade:</span>
                        <span className="font-bold text-white">{edu.grade}</span>
                      </div>
                    )}

                    {edu.description && (
                      <p className="text-neutral-400 text-sm md:text-base leading-relaxed max-w-4xl">
                        {edu.description}
                      </p>
                    )}

                    {/* Achievements Section */}
                    {edu.achievements && (
                      <div className="p-4 md:p-5 bg-neutral-950/40 rounded-2xl border border-neutral-800/50">
                        <span className="block text-[11px] font-bold text-neutral-500 uppercase tracking-widest mb-2">
                          Key Achievements
                        </span>
                        <p className="text-sm md:text-base text-neutral-300 leading-relaxed">
                          {edu.achievements}
                        </p>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="py-4">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 border border-neutral-800">
              <FaGithub className="h-6 w-6 text-white" />
            </div>

            <div>
              <h2 className="flex items-center gap-2 text-2xl font-bold">
                GitHub Streak
                <Flame className="h-6 w-6 text-orange-500 animate-pulse" />
              </h2>
            </div>
          </div>

          <a
            href="https://github.com/durgeshkatyayan"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-2 text-sm transition hover:border-purple-500 hover:bg-neutral-800"
          >
            <FaGithub className="h-4 w-4" />
            View Profile
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
        <div className=" flex items-center justify-center ">
          <img
            src="https://github-readme-streak-stats.herokuapp.com/?user=durgeshkatyayan&theme=radical"
            alt="GitHub Streak Stats"
            className=" w-fit h-auto rounded-md"
          />
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-5">
          <Activity className="text-purple-500" size={28} />
          <h2 className="text-2xl font-bold">Coding Activity</h2>
        </div>

        <div className="w-full bg-neutral-900/40 backdrop-blur-sm border border-neutral-800/60 p-4 sm:p-8 rounded-3xl hover:bg-neutral-900/80 transition duration-300 shadow-sm overflow-hidden">
          <div className="w-full overflow-x-auto">
            <embed
              src="https://wakatime.com/share/@kaniskkatyayan/07651865-2599-42e4-8c41-b25ab8d8e8f1.svg"
              type="image/svg+xml"
            // className="w-full min-w-[700px] h-[420px]"
            />
          </div>
        </div>
      </section>

      <CodingAnalytics />

      <section>
        <WhatIDo />
      </section>

    </div>
  );
}