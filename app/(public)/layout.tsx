import CustomCursor from "@/components/public/CustomCursor";
import ParticleBackground from "@/components/public/ParticleBackground";
import ScrollProgress from "@/components/public/ScrollProgress";
import BackToTop from "@/components/public/BackToTop";
import PageTransition from "@/components/providers/PageTransition";
// import Navbar from "@/components/public/Navbar";
// import Footer from "@/components/public/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col">
      <ScrollProgress />
      <CustomCursor />
      <ParticleBackground />
      
      {/* <Navbar /> */}
      
      <main className="flex-grow z-10">
        <PageTransition>
          {children}
        </PageTransition>
      </main>

      <BackToTop />
      {/* <Footer /> */}
    </div>
  );
}