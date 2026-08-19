import Hero from "@/components/home/hero";
import { ProjectGrid } from "@/components/projects/project-grid";

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <Hero />
      <ProjectGrid />
    </div>
  );
}
