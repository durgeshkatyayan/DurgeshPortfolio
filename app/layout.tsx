import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";
import { Toaster } from "react-hot-toast";

// Fallback SEO configuration
export const metadata: Metadata = {
  title: {
    template: "%s | Portfolio CMS",
    default: "Durgesh Katyayan| Full Stack Developer",
  },
  description: "Enterprise-grade Full Stack Portfolio CMS showcasing projects, skills, and articles.",
  keywords: ["Next.js", "Portfolio", "CMS", "Full Stack Developer", "React 19"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://your-portfolio.com",
    siteName: "John Doe Portfolio",
    images: [{
      url: "https://your-portfolio.com/og-image.jpg",
      width: 1200,
      height: 630,
      alt: "John Doe Portfolio",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "John Doe | Full Stack Developer",
    description: "Enterprise-grade Full Stack Portfolio CMS.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-white text-neutral-900">
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#171717",
                color: "#fff",
                border: "1px solid #262626",
              },
            }}
          />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}