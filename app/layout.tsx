import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Durgesh Portfolio",
  description: "Full Stack Developer Portfolio",
   icons: {
    icon: "./logo.jpeg",
    shortcut: "./logo.jpeg",
    apple: "./logo.jpeg",
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
        {children}
      </body>
    </html>
  );
}