"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FolderKanban, FileText, Briefcase, Music, Mail, Sparkles } from "lucide-react";
import {
  Navbar as ResizableNavbar,
  NavBody,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative w-full z-50  ">
      <ResizableNavbar>
        <NavBody className="border-b border-neutral-800">
          
          <div className="hidden lg:flex items-center ps-6 gap-2 overflow-x-auto custom-scrollbar hide-scroll-indicator">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
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

          <div className="hidden lg:flex items-center gap-4">
            <Link href="/contact">
              <NavbarButton variant="primary">Hire Me</NavbarButton>
            </Link>
          </div>
        </NavBody>

        <MobileNav>
          <MobileNavHeader className="bg-neutral-950 border-b border-neutral-800">
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
            className="bg-neutral-950 border-b border-neutral-800"
          >
            <div className="flex flex-col gap-2 p-4">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-blue-600/10 text-blue-400 border border-blue-500/20"
                        : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                    }`}
                  >
                    {link.icon}
                    <span className="block">{link.name}</span>
                  </Link>
                );
              })}
            </div>
            
            <div className="flex w-full flex-col gap-4 p-4 border-t border-neutral-800">
              <Link href="/contact" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                <NavbarButton variant="primary" className="w-full">
                  Hire Me
                </NavbarButton>
              </Link>
            </div>
          </MobileNavMenu>
        </MobileNav>
        
      </ResizableNavbar>
    </div>
  );
}