import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { connectToDatabase } from "@/lib/mongodb";
import Settings, { ISettings } from "@/models/Settings";
import AdminLayoutClient from "@/components/admin/AdminLayoutClient"; // Client component wrapper for responsive sidebar

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

  return <AdminLayoutClient siteName={siteName}>{children}</AdminLayoutClient>;
}