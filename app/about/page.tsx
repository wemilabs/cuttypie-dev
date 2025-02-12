import type { Metadata } from "next";

import AboutSection from "@/components/about/section";
import SkillCard from "@/components/about/skill-card";
import ProjectRequestForm from "@/components/forms/project-request-form";
import FAQItem from "@/components/about/faq-item";

export const metadata: Metadata = {
  title: "About - Matheo (cuttypie)",
  description: "Learn more about me and what I do.",
};

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-6 pt-[74px] pb-20 mt-16">
      <section className="mb-16">
        <h1 className="text-4xl font-bold mb-6">
          Hey, I'm <span className="text-yellow-200">Matheo</span>
        </h1>
        <p className="text-lg tracking-tighter text-white/70 leading-relaxed">
          I'm a full-stack developer passionate about building beautiful and
          functional web applications. My expertise lies in TypeScript, React,
          Node.js, and modern web technologies, focusing on creating scalable
          and maintainable solutions.
        </p>
      </section>

      {/* What I Do Section */}
      <AboutSection title="What I Do">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SkillCard
            title="Full-Stack Development"
            description="I build end-to-end web applications using modern technologies like TypeScript, React, Node.js, and Next.js. My focus is on creating performant, scalable, and maintainable solutions."
          />
          <SkillCard
            title="Frontend Expertise"
            description="Specializing in React and modern frontend frameworks, I create responsive and interactive user interfaces with a strong emphasis on user experience and accessibility."
          />
          <SkillCard
            title="Backend Development"
            description="I develop robust backend systems using Node.js and TypeScript, implementing RESTful APIs, database integrations, and server-side logic."
          />
          <SkillCard
            title="Mobile Development"
            description="Using React Native and Expo, I build cross-platform mobile applications that provide native experiences while maintaining code reusability."
          />
          <SkillCard
            title="Research and Writing"
            description="Apart from coding, I devote significant time to comprehensive research and articulate writing. Thus, I stay at the forefront of technological advancements and convey complex concepts effectively."
          />
          <SkillCard
            title="Open Source Contribution"
            description="Often digging into open-source projects and contribute to their development. This allows me to learn from the best practices and connect with a vibrant developer community around the world."
          />
        </div>
      </AboutSection>

      {/* FAQ Section */}
      <AboutSection title="Frequently Asked Questions">
        <FAQItem
          question="Who are you?"
          answer="I'm Matheo, a self-taught Gabonese full-stack developer, and I've been professionally coding since 2019. Technology is my passion, and these days I spend most of my time developing, researching, and writing."
        />
        <FAQItem
          question="Your development philosophy?"
          answer="I believe in writing clean, maintainable code that solves real problems. I focus on creating reusable components and following best practices for scalability and performance."
        />
        <FAQItem
          question="How do you approach projects?"
          answer="I start with understanding the core requirements and user needs, then plan the architecture and break down the implementation into manageable tasks. I emphasize testing and documentation throughout the development process."
        />
        <FAQItem
          question="What stack do you use?"
          answer="My primary tech stack includes TypeScript, React, Next.js, Node.js, and PostgreSQL. I also work with React Native for mobile development and use tools like Tailwind CSS for styling. But I'm also ready to take on new challenges and learn new things."
        />
      </AboutSection>

      {/* Contact Section */}
      <AboutSection title="Get in Touch">
        <p className="text-white/70 leading-relaxed mb-8">
          Interested in collaborating or have a project in mind? Feel free to
          connect.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-8">
          <ProjectRequestForm />
        </div>
      </AboutSection>
    </div>
  );
}
