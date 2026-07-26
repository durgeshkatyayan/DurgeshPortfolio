import { connectToDatabase } from "@/lib/mongodb";
import Profile, { IProfile } from "@/models/Profile";
import About from "@/models/About";
import Statistic from "@/models/Statistic";
import Education from "@/models/Education";
import Link from "next/link";
import { Download, User, GraduationCap } from "lucide-react";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
export const revalidate = 3600;

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
  year: string;
  grade?: string;
  description?: string;
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
    <div className="space-y-12 pb-20">
      <section className="">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900 border border-neutral-800 text-sm text-neutral-300 mb-6 shadow-sm">
          <User size={16} className="text-blue-500" />
          <span>About Me</span>
        </div>

        {/* <h1 className="text-4xl md:text-3xl font-extrabold tracking-tight mb-8 text-white">
          Get to know me.
        </h1> */}
        <div className="w-[10rem] -top-5 -left-20 relative">
          <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
          <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
          {/* <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" /> */}
          {/* <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" /> */}
          {/* <div className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div> */}
        </div>

        {about ? (
          <div className="space-y-6">
            <div className="text-md text-neutral-400 max-w-3xl leading-6 space-y-3">
              <p>{about.description}</p>
              <p>{about.biography}</p>
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

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {about.resumeUrl && (
                <a
                  href={about.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 bg-white text-black font-bold rounded-xl hover:bg-neutral-200 transition flex items-center gap-2 shadow-lg"
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
          <div className="flex items-center gap-3 mb-10">
            <GraduationCap className="text-emerald-500" size={28} />
            <h2 className="text-3xl font-bold">Education & Background</h2>
          </div>

          <div className="relative border-l border-neutral-800 ml-3 md:ml-4 pl-6 md:pl-10 space-y-8">
            {educations.map((edu) => (
              <div key={edu._id.toString()} className="relative group">

                {/* Timeline Dot */}
                <span className="absolute -left-[31px] md:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-neutral-950 border-2 border-neutral-600 group-hover:border-emerald-500 transition-colors duration-300" />

                <div className="bg-neutral-900/40 backdrop-blur-sm border border-neutral-800/60 p-6 sm:p-8 rounded-2xl hover:bg-neutral-900/80 transition duration-300 shadow-sm hover:shadow-md">

                  {/* Year Badge */}
                  <span className="inline-block px-3 py-1 bg-neutral-950 border border-neutral-800 text-emerald-400 text-xs font-bold tracking-widest uppercase rounded-lg mb-4">
                    {edu.year}
                  </span>

                  {/* Degree & Institution */}
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                    {edu.degree}
                  </h3>

                  <div className="text-neutral-300 font-medium mb-3 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span className="text-blue-400">{edu.college}</span>
                    {edu.university && (
                      <>
                        <span className="hidden sm:inline text-neutral-600">•</span>
                        <span className="text-neutral-400">{edu.university}</span>
                      </>
                    )}
                  </div>

                  {/* Grade */}
                  {edu.grade && (
                    <div className="inline-block px-3 py-1 bg-neutral-800/50 rounded-md text-sm text-neutral-300 mb-4">
                      Grade: <span className="font-semibold text-white">{edu.grade}</span>
                    </div>
                  )}

                  {/* Description */}
                  {edu.description && (
                    <p className="text-neutral-400 text-sm leading-relaxed max-w-3xl">
                      {edu.description}
                    </p>
                  )}

                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}