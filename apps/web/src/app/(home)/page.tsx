"use client";
import Ad from "@/components/gina/Ad";
import { HeroShowComponent } from "@/components/heroShow/HeroShow";

const page: React.FC = () => {
  return (
    <>
      <Ad className="h-[calc(100vh-var(--navbar-height))]" />
      <HeroShowComponent />
    </>
  );
};
export default page;
