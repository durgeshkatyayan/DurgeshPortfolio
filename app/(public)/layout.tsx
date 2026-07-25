import CustomCursor from "@/components/public/CustomCursor";
import ParticleBackground from "@/components/public/ParticleBackground";
import ScrollProgress from "@/components/public/ScrollProgress";
import BackToTop from "@/components/public/BackToTop";
import PageTransition from "@/components/providers/PageTransition";
import Footer from "@/components/public/Footer";
import Navbar from "@/components/public/Navbar";
import LeftSidebar from "@/components/public/LeftSidebar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-neutral-950 text-white selection:bg-blue-500 selection:text-white">
      <CustomCursor />
      <ParticleBackground />

      <aside className="hidden lg:block w-100 h-full shrink-0 border-r border-neutral-800 relative z-20">
        <LeftSidebar />
      </aside>

      <div className="flex-1 flex flex-col h-full overflow-y-auto relative custom-scrollbar z-10">
        <ScrollProgress />
        
        <div className="sticky top-0 z-50">
          <Navbar />
        </div>
        
        <main className="grow px-6 lg:px-12 py-10">
          <PageTransition>
            {children}
          </PageTransition>
        </main>

        <BackToTop />
        <Footer />
      </div>
    </div>
  );
}