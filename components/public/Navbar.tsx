"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FolderKanban, FileText, Briefcase, Music, Mail, Sparkles } from "lucide-react";

const navLinks = [
  { name: "Home", href: "/", icon: <Home size={18} /> },
  { name: "Projects", href: "/projects", icon: <FolderKanban size={18} /> },
  { name: "Experience", href: "/experience", icon: <Briefcase size={18} /> },
  { name: "Skills", href: "/skills", icon: <Sparkles size={18} /> },
  { name: "Blog", href: "/blog", icon: <FileText size={18} /> },
  { name: "Music", href: "/music", icon: <Music size={18} /> },
  { name: "Contact", href: "/contact", icon: <Mail size={18} /> },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="w-full bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-800 p-4 md:px-8">
      <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2 md:pb-0 hide-scroll-indicator">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                isActive 
                  ? "bg-blue-600/10 text-blue-400 border border-blue-500/20" 
                  : "text-neutral-400 hover:text-white hover:bg-neutral-900"
              }`}
            >
              {link.icon}
              {link.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}