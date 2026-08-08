"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  FolderKanban,
  PenTool,
  FileText,
  User, 
  
  Info,
  GraduationCap,
  Award,
  Music,
  Settings as SettingsIcon,
  BriefcaseBusiness,
  MessageSquare,
  Menu,
  X,
} from "lucide-react";
import LogoutButton from "@/components/admin/LogoutButton";

export default function AdminLayoutClient({
  siteName,
  children,
}: {
  siteName: string;
  children: React.ReactNode;
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileOpen((prev) => !prev);
  const closeMobileMenu = () => setIsMobileOpen(false);

  return (
    <div className="flex h-screen bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 overflow-hidden">
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={closeMobileMenu}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-950 flex flex-col flex-shrink-0 transform transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${isMobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="p-6 border-b border-neutral-300 dark:border-neutral-800 flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-blue-600 dark:text-blue-500 truncate">
            {siteName}
          </h2>
          <button
            onClick={closeMobileMenu}
            className="md:hidden p-1 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto custom-scrollbar">
          <Link
            href="/admin/dashboard"
            onClick={closeMobileMenu}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
          >
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link
            href="/admin/profile"
            onClick={closeMobileMenu}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
          >
            <User size={20} /> Profile Info
          </Link>
          <Link
            href="/admin/about"
            onClick={closeMobileMenu}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
          >
            <Info size={20} /> About Me
          </Link>
          <Link
            href="/admin/education"
            onClick={closeMobileMenu}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
          >
            <GraduationCap size={20} /> Education
          </Link>
          <Link
            href="/admin/experience"
            onClick={closeMobileMenu}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
          >
            <BriefcaseBusiness size={20} />
            Experience
          </Link>
          <Link
            href="/admin/certificates"
            onClick={closeMobileMenu}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
          >
            <Award size={20} /> Certificates
          </Link>
          <Link
            href="/admin/skills"
            onClick={closeMobileMenu}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
          >
            <PenTool size={20} /> Skills
          </Link>
          <Link
            href="/admin/projects"
            onClick={closeMobileMenu}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
          >
            <FolderKanban size={20} /> Projects
          </Link>
          <Link
            href="/admin/messages"
            onClick={closeMobileMenu}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
          >
            <MessageSquare size={20} />
            Contact Messages
          </Link>
          <Link
            href="/admin/blogs"
            onClick={closeMobileMenu}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
          >
            <FileText size={20} /> Blogs
          </Link>
          <Link
            href="/admin/analytics"
            onClick={closeMobileMenu}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
          >
            <FileText size={20} /> Analytics
          </Link>
          <Link
            href="/admin/music"
            onClick={closeMobileMenu}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
          >
            <Music size={20} /> Music
          </Link>
        </nav>

        <div className="p-4 border-t border-neutral-300 dark:border-neutral-800">
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content Area Container */}
      <div className="flex-1 flex flex-col h-full overflow-hidden w-full">
        <header className="h-16 flex-shrink-0 border-b border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-950 flex items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition text-neutral-600 dark:text-neutral-300"
              aria-label="Open sidebar menu"
            >
              <Menu size={22} />
            </button>
            <div className="font-medium text-neutral-500 dark:text-neutral-400 text-sm sm:text-base">
              Workspace Dashboard
            </div>
          </div>

          <Link
            href="/admin/settings"
            className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition text-neutral-500 dark:text-neutral-400 flex items-center gap-2"
            title="Global Settings"
          >
            <SettingsIcon size={20} />
          </Link>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 relative">
          {children}
        </main>
      </div>
    </div>
  );
}