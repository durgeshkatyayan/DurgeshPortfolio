import AnalyticsTracker from "@/components/public/AnalyticsTracker";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Durgesh Katyayan - Full Stack Developer ",
  description: "Full Stack Developer | React.js | Next.js | Node.js | Express | MongoDB | SQL | JavaScript | TypeScript | HTML | CSS",
   icons: {
    icon: "/logo.jpeg",
    shortcut: "/logo.jpeg",
    apple: "/logo.jpeg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-neutral-950 text-white antialiased">
        <AnalyticsTracker />
        {children}
      </body>
    </html>
  );
}