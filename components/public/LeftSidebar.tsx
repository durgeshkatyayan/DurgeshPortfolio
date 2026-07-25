import Image from "next/image";
import Link from "next/link";
import { connectToDatabase } from "@/lib/mongodb";
import Profile, { IProfile } from "@/models/Profile";
import Typewriter from "./Typewriter";
import { 
  MapPin, 
  Mail, 
  Phone, 
  Briefcase, 
  Download 
} from "lucide-react";
import { 
  FaGithub, 
  FaLinkedin,  
  FaGlobe 
} from "react-icons/fa";

export default async function LeftSidebar() {
  await connectToDatabase();
  
  const profile = (await Profile.findOne().lean()) as IProfile | null;

  if (!profile) {
    return <div className="p-8 text-neutral-500">Please configure profile data in Admin.</div>;
  }

  return (
    <div className="h-full flex flex-col bg-neutral-950/50 backdrop-blur-xl p-8 overflow-y-auto custom-scrollbar">
      
      {/* Profile Header */}
      <div className="text-center mb-8">
        <div className="relative w-40 h-40 mx-auto rounded-3xl overflow-hidden mb-6 border border-neutral-800 shadow-2xl group">
          <Image 
            src={profile.photo} 
            alt={profile.fullName} 
            fill 
            className="object-cover group-hover:scale-110 transition duration-700" 
          />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">{profile.fullName}</h1>
        <div className="flex justify-center mb-4">
          <Typewriter words={profile.typingDesignations} />
        </div>
        <p className="text-neutral-400 text-sm leading-relaxed">{profile.tagline}</p>
      </div>

      <hr className="border-neutral-800 mb-8" />

      {/* Info List */}
      <ul className="space-y-4 mb-8 text-sm text-neutral-300 grow">
        <li className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-neutral-500"><Mail size={16} /> Email</span>
          <span className="font-medium truncate w-1/2 text-right" title={profile.email}>{profile.email}</span>
        </li>
        {profile.phone && (
          <li className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-neutral-500"><Phone size={16} /> Phone</span>
            <span className="font-medium">{profile.phone}</span>
          </li>
        )}
        <li className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-neutral-500"><MapPin size={16} /> Location</span>
          <span className="font-medium">{profile.location}</span>
        </li>
        {profile.currentCompany && (
          <li className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-neutral-500"><Briefcase size={16} /> Company</span>
            <span className="font-medium">{profile.currentCompany}</span>
          </li>
        )}
      </ul>

      {/* Actions & Socials */}
      <div className="space-y-4">
        {profile.resumeUrl && (
          <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="w-full flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white py-3 rounded-xl transition font-medium">
            <Download size={18} /> Download CV
          </a>
        )}
        <Link href="/booking" className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl transition font-medium">
          Hire Me
        </Link>
        
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          {profile.socialLinks?.github && <a href={profile.socialLinks.github} target="_blank" rel="noreferrer" className="text-neutral-500 hover:text-white transition"><FaGithub size={20} /></a>}
          {profile.socialLinks?.linkedin && <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer" className="text-neutral-500 hover:text-white transition"><FaLinkedin size={20} /></a>}
          {/* {profile.socialLinks?.twitter && <a href={profile.socialLinks.twitter} target="_blank" rel="noreferrer" className="text-neutral-500 hover:text-white transition"><FaTwitter size={20} /></a>} */}
          {/* {profile.socialLinks?.instagram && <a href={profile.socialLinks.instagram} target="_blank" rel="noreferrer" className="text-neutral-500 hover:text-white transition"><FaInstagram size={20} /></a>} */}
          {/* {profile.socialLinks?.youtube && <a href={profile.socialLinks.youtube} target="_blank" rel="noreferrer" className="text-neutral-500 hover:text-white transition"><FaYoutube size={20} /></a>} */}
          {/* {profile.socialLinks?.facebook && <a href={profile.socialLinks.facebook} target="_blank" rel="noreferrer" className="text-neutral-500 hover:text-white transition"><FaFacebook size={20} /></a>} */}
          {profile.socialLinks?.portfolio && <a href={profile.socialLinks.portfolio} target="_blank" rel="noreferrer" className="text-neutral-500 hover:text-white transition"><FaGlobe size={20} /></a>}
        </div>
      </div>
    </div>
  );
}