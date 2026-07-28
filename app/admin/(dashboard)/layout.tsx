import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
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
  BriefcaseBusiness
} from "lucide-react";
import LogoutButton from "@/components/admin/LogoutButton";
import { connectToDatabase } from "@/lib/mongodb";
import Settings, { ISettings } from "@/models/Settings";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  const isAdmin = session?.user?.role === "admin";

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-100 dark:bg-neutral-950 px-4">
        <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
          <h1 className="mb-2 text-2xl font-bold text-neutral-900 dark:text-white">Admin access required</h1>
          <p className="mb-6 text-neutral-500 dark:text-neutral-400">Please sign in to access the portfolio CMS.</p>
          <div className="flex justify-center gap-3">
            <Link href="/admin/login" className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700">
              Go to login
            </Link>
            <Link href="/" className="inline-flex items-center justify-center rounded-lg border border-neutral-300 px-4 py-2 font-semibold text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800">
              Back to portfolio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Fetch the Site Name from the database dynamically
  await connectToDatabase();
  const settingsData = await Settings.findOne().lean<ISettings | null>();

  const siteName = settingsData?.siteName ?? "Durgesh Admin";

  return (
    <div className="flex h-screen bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 overflow-hidden">

      {/* Sidebar */}
      <aside className="w-64 border-r border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-950 flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-neutral-300 dark:border-neutral-800">
          <h2 className="text-xl font-bold tracking-tight text-blue-600 dark:text-blue-500 truncate">
            {siteName}
          </h2>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link href="/admin/profile" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">
            <User size={20} /> Profile Info
          </Link>
          <Link href="/admin/about" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">
            <Info size={20} /> About Me
          </Link>
          <Link href="/admin/education" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">
            <GraduationCap size={20} /> Education
          </Link>
         <Link
  href="/admin/experience"
  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
>
  <BriefcaseBusiness size={20} />
  Experience
</Link>
          <Link href="/admin/certificates" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">
            <Award size={20} /> Certificates
          </Link>
          <Link href="/admin/skills" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">
            <PenTool size={20} /> Skills
          </Link>
          <Link href="/admin/projects" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">
            <FolderKanban size={20} /> Projects
          </Link>
          <Link href="/admin/blogs" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">
            <FileText size={20} /> Blogs
          </Link>
          <Link href="/admin/music" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">
            <Music size={20} /> Music
          </Link>
        </nav>

        <div className="p-4 border-t border-neutral-300 dark:border-neutral-800">
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content Area Container */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">

        {/* Top Navbar */}
        <header className="h-16 flex-shrink-0 border-b border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-950 flex items-center justify-between px-8">
          <div className="font-medium text-neutral-500 dark:text-neutral-400">
            Workspace Dashboard
          </div>
          <Link
            href="/admin/settings"
            className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition text-neutral-500 dark:text-neutral-400 flex items-center gap-2"
            title="Global Settings"
          >
            {/* <span className="text-sm hidden sm:inline-block">Settings</span> */}
            <SettingsIcon size={20} />
          </Link>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-8 relative">
          {children}
        </main>

      </div>
    </div>
  );
}