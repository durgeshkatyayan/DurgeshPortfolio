import CustomCursor from "@/components/public/CustomCursor";
import ParticleBackground from "@/components/public/ParticleBackground";
import ScrollProgress from "@/components/public/ScrollProgress";
import BackToTop from "@/components/public/BackToTop";
import PageTransition from "@/components/providers/PageTransition";
import Footer from "@/components/public/Footer";
import Navbar from "@/components/public/Navbar";
import LeftSidebar from "@/components/public/LeftSidebar";
import { connectToDatabase } from "@/lib/mongodb";
import Profile, { IProfile } from "@/models/Profile";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await connectToDatabase();
  
  // 1. Fetch raw document from Mongoose
  const rawProfile = await Profile.findOne().lean();

  // 2. Safely serialize BSON objects (_id, dates) into plain JSON to pass across RSC boundary
  const profile: IProfile | null = rawProfile
    ? JSON.parse(JSON.stringify(rawProfile))
    : null;

  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-blue-500 selection:text-white relative  lg:pb-0">
      <CustomCursor />
      <ParticleBackground />

      <div className="mx-auto flex flex-col lg:flex-row min-h-screen lg:h-screen gap-5 pt-0 md:pt-4 w-full max-w-[1440px] px-0 md:ps-6 md:pe-2 xl:ps-20 xl:pe-1 overflow-x-hidden lg:overflow-hidden">
        
        {/* MOBILE TOP SECTION */}
        <div className="block lg:hidden w-full px-3 pt-3 relative z-20">
          <div className="rounded-[24px] border border-neutral-800/50 bg-neutral-950/80 backdrop-blur-xl p-2">
            <LeftSidebar profile={profile} />
          </div>
        </div>

        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:block rounded-[32px] w-[350px] xl:w-[350px] shrink-0 border-x border-neutral-800/50 bg-neutral-950/80 backdrop-blur-xl relative z-20">
          <LeftSidebar profile={profile} />
        </aside>

        {/* RIGHT CONTENT PANEL */}
        <div
          id="right-panel-scroll"
          className="flex-1 flex flex-col h-full overflow-y-auto scrollbar-thin scrollbar-thumb-current scrollbar-track-transparent relative z-10 border-r border-neutral-800/50 bg-neutral-950/40 backdrop-blur-sm"
        >
          <div className="sticky top-0 z-50">
            <ScrollProgress />
            <Navbar />
          </div>

          <main className="grow px-2 md:px-6 lg:px-12 py-3 md:py-5">
            <PageTransition>{children}</PageTransition>
          </main>

          <BackToTop />
          <Footer />
        </div>

      </div>
    </div>
  );
}