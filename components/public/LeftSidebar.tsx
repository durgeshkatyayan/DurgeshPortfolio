import Image from "next/image";
import Link from "next/link";
// import React from "react";
import { connectToDatabase } from "@/lib/mongodb";
import Profile, { IProfile } from "@/models/Profile";
import Typewriter from "./Typewriter";
import { MagneticButton } from "@/components/ui/magnetic-button";
import {
  MapPin,
  Mail,
  Smartphone, // Fits the image style better than Phone
  CalendarDays, // Fits the image style better than Calendar
  Download,
  BadgeCheck // For the blue verified check
} from "lucide-react";
import {
  FaGithub,
  FaLinkedin,
  FaGlobe,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaFacebook
} from "react-icons/fa";
import { BackgroundBeamsWithCollision } from "../ui/background-beams-with-collision";

export default async function LeftSidebar() {
  await connectToDatabase();

  const profile = (await Profile.findOne().lean()) as IProfile | null;
  // console.log(profile)
  if (!profile) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-neutral-500 text-sm">
        Please configure profile data in Admin.
      </div>
    );
  }

  return (
    <BackgroundBeamsWithCollision>
      <div className="flex w-full h-full flex-col rounded-[22px] bg-[#161618] px-8 pb-4 pt-6 border-r border-neutral-800/50 rounded-tr-3xl ">
        <div className="flex flex-col items-center text-center mb-4">

          <div className="relative w-36 h-36 rounded-[32px] overflow-hidden mb-4 bg-neutral-800 shadow-xl border border-neutral-700/30">
            <Image
              src={profile.photo}
              alt={profile.fullName}
              fill
              className="object-cover"
            />
          </div>

          {/* Name & Blue Check */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <h1 className="text-2xl font-bold text-white tracking-wide">
              {profile.fullName}
            </h1>
            <BadgeCheck
              className="fill-blue-500 shrink-0 text-white"
              size={24}
            />
          </div>

          {/* Designation Pill */}
          <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-[13px] font-medium tracking-wide flex items-center justify-center mb-3">
            <Typewriter words={profile?.typingDesignations ?? []} />
          </div>

          {/* WakaTime Badge Widget */}
          <a
            href="https://wakatime.com/@6a35f861-13f5-4e6b-ab4a-96a684032fce"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex w-full max-w-[240px] items-center justify-center rounded-2xl bg-[#1c1c1f] p-2 border border-neutral-800/60 shadow-inner hover:bg-[#232326] hover:border-neutral-700 transition-all duration-300"
          >
            <Image
              src="https://wakatime.com/badge/user/6a35f861-13f5-4e6b-ab4a-96a684032fce.svg"
              alt="Total time coded since Aug 28 2024"
              width={200}
              height={24}
              unoptimized
              className="opacity-80 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-sm"
            />
          </a>
        </div>

        <hr className="border-neutral-800/80 w-4/5 mx-auto mb-4" />

        {/* 2. Detailed Info List */}
        <div className="space-y-5 mb-5 px-2 grow">

          {/* Email */}
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-neutral-800/60 shadow-inner flex items-center justify-center text-blue-400 ring-1 ring-neutral-700/50">
              <Mail size={18} strokeWidth={1.5} />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-[11px] text-neutral-500 font-semibold tracking-wider uppercase mb-.5">Email</span>
              <span className="text-sm text-neutral-200 font-medium truncate" title={profile.email}>{profile.email}</span>
            </div>
          </div>

          {/* Phone */}
          {profile.phone && (
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-neutral-800/60 shadow-inner flex items-center justify-center text-blue-400 ring-1 ring-neutral-700/50">
                <Smartphone size={20} strokeWidth={1.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-neutral-500 font-semibold tracking-wider uppercase mb-.5">Phone</span>
                <span className="text-sm text-neutral-200 font-medium">{profile.phone}</span>
              </div>
            </div>
          )}

          {/* Birthday (DOB) */}
          {profile.dob && (
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-neutral-800/60 shadow-inner flex items-center justify-center text-blue-400 ring-1 ring-neutral-700/50">
                <CalendarDays size={20} strokeWidth={1.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-neutral-500 font-semibold tracking-wider uppercase mb-.5">Birthday</span>
                <span className="text-sm text-neutral-200 font-medium">
                  {new Date(profile.dob).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </div>
          )}

          {/* Location */}
          <div className="flex items-center gap-4 ">
            <div className="flex-shrink-0 w-9 h-9  rounded-xl bg-neutral-800/60 shadow-inner flex items-center justify-center text-blue-400 ring-1 ring-neutral-700/50">
              <MapPin size={20} strokeWidth={1.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] text-neutral-500 font-semibold tracking-wider uppercase mb-.5">Location</span>
              <span className="text-sm text-neutral-200 font-medium">{profile.location}</span>
            </div>
          </div>


        </div>

        {/* 3. Actions */}
        <div className="space-y-4 mb-4">
          {profile.resumeUrl && (

            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[#232325] border border-neutral-700/50 hover:bg-[#2a2a2d] text-white py-2 rounded-xl transition font-medium shadow-sm"
            >
              <Download size={18} /> Download CV
            </a>
          )}

          {/* Magnetic Contact Button */}
          <MagneticButton>
            <Link
              href="/contact"
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-blue-500 to-blue-700 py-2 font-bold text-white shadow-[0_0_20px_rgba(37,99,235,0.15)] ring-1 ring-inset ring-white/20 ring-offset-1 ring-offset-blue-500 transition-all duration-150 active:scale-[0.98] hover:shadow-[0_0_25px_rgba(37,99,235,0.3)]"
            >
              Contact Me
            </Link>
          </MagneticButton>
        </div>

        {/* 4. Social Icons Footer */}
        <div className="flex flex-wrap justify-center gap-6 pt-2">
          {profile.socialLinks?.facebook && (
            <a href={profile.socialLinks.facebook} target="_blank" rel="noreferrer" className="text-neutral-500 hover:text-white hover:-translate-y-1 transition duration-300">
              <FaFacebook size={19} />
            </a>
          )}
          {profile.socialLinks?.github && (
            <a href={profile.socialLinks.github} target="_blank" rel="noreferrer" className="text-neutral-500 hover:text-white hover:-translate-y-1 transition duration-300">
              <FaGithub size={19} />
            </a>
          )}
          {profile.socialLinks?.twitter && (
            <a href={profile.socialLinks.twitter} target="_blank" rel="noreferrer" className="text-neutral-500 hover:text-white hover:-translate-y-1 transition duration-300">
              <FaTwitter size={19} />
            </a>
          )}
          {profile.socialLinks?.instagram && (
            <a href={profile.socialLinks.instagram} target="_blank" rel="noreferrer" className="text-neutral-500 hover:text-white hover:-translate-y-1 transition duration-300">
              <FaInstagram size={19} />
            </a>
          )}
          {profile.socialLinks?.linkedin && (
            <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer" className="text-neutral-500 hover:text-white hover:-translate-y-1 transition duration-300">
              <FaLinkedin size={19} />
            </a>
          )}
          {profile.socialLinks?.youtube && (
            <a href={profile.socialLinks.youtube} target="_blank" rel="noreferrer" className="text-neutral-500 hover:text-white hover:-translate-y-1 transition duration-300">
              <FaYoutube size={19} />
            </a>
          )}
          {profile.socialLinks?.portfolio && (
            <a href={profile.socialLinks.portfolio} target="_blank" rel="noreferrer" className="text-neutral-500 hover:text-white hover:-translate-y-1 transition duration-300">
              <FaGlobe size={19} />
            </a>
          )}
        </div>

      </div>
    </BackgroundBeamsWithCollision>
  );
}