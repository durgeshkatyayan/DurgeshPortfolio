"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import toast from "react-hot-toast";

export default function LogoutButton() {
  const handleLogout = async () => {
    toast.loading("Logging out...");
    await signOut({ callbackUrl: "/admin/login" });
  };

  return (
    <button 
      onClick={handleLogout}
      className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors font-medium"
    >
      <LogOut size={20} />
      <span>Sign Out</span>
    </button>
  );
}