"use client";

import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { useState } from "react";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  // Ensure the query client is only created once per session
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute cache
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster 
          position="bottom-right"
          toastOptions={{
            className: "dark:bg-neutral-800 dark:text-white border dark:border-neutral-700",
            duration: 4000,
          }} 
        />
      </QueryClientProvider>
    </SessionProvider>
  );
}