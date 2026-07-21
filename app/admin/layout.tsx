import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { LayoutDashboard, FolderKanban, PenTool, FileText } from "lucide-react";
import LogoutButton from "@/components/admin/LogoutButton";

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

  return (
    <div className="flex h-screen bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
      {/* Sidebar */}
      <aside className="w-64 border-r border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-950 flex flex-col">
        <div className="p-6 border-b border-neutral-300 dark:border-neutral-800">
          <h2 className="text-xl font-bold tracking-tight">CMS Admin</h2>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link href="/admin/projects" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">
            <FolderKanban size={20} /> Projects
          </Link>
          <Link href="/admin/blogs" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">
            <FileText size={20} /> Blogs
          </Link>
          <Link href="/admin/skills" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">
            <PenTool size={20} /> Skills
          </Link>
        </nav>

        <div className="p-4 border-t border-neutral-300 dark:border-neutral-800">
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}