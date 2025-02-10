import { projects } from "@/lib/data";
import ProjectCard from "./project-card";

const ProjectGrid = () => {
  return (
    <section
      id="featured-projects"
      className="max-w-6xl mx-auto px-6 pt-0 pb-16"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project, index) => (
          <ProjectCard key={index} {...project} />
        ))}
      </div>
    </section>
  );
};

export default ProjectGrid;
