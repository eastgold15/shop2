"use client";
import Ad from "@/components/gina/Ad";
import { HeroShowComponent } from "@/components/heroShow/HeroShow";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/Navbar/Navbar";

const page: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-red-400 font-sans text-black selection:bg-black selection:text-white">
      {/* Navbar 固定在顶部，不占用内容空间 */}
      <Navbar />

      <Ad className="h-[calc(100vh-var(--navbar-height))]" />
      <HeroShowComponent />

      <Footer />
    </div>
  );
};
export default page;
