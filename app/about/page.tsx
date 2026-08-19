import {
  BookOpenText,
  Braces,
  Database,
  GitPullRequest,
  PanelsTopLeft,
  Smartphone,
} from "lucide-react";
import type { Metadata } from "next";

import FAQItem from "@/components/about/faq-item";
import AboutSection from "@/components/about/section";
import SkillCard from "@/components/about/skill-card";
import { Accordion } from "@/components/accordion";
import { DataCard } from "@/components/data-card";
import ProjectRequestForm from "@/components/forms/project-request-form";
import { GlowContainer } from "@/components/glow-container";
import { OrbitRotation } from "@/components/ui/orbit-rotation";

export const metadata: Metadata = {
  title: "About | lisham_",
  description: "Learn more about me and what I do.",
};

const skillIconClassName = "size-5";

export default async function About() {
  return (
    <main className="grid-surface mx-auto max-w-5xl px-6 pt-8 pb-12 sm:pt-12 sm:pb-16">
      <div className="space-y-20">
        <section className="grid items-stretch gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.6fr)]">
          <div className="relative overflow-hidden rounded border border-primary/20 bg-card/70 p-6 backdrop-blur-sm sm:p-8">
            <h1 className="font-bold font-display text-4xl tracking-tight sm:text-5xl">
              Hey, I'm <span className="text-primary">lisham_</span>
            </h1>
            <p className="mt-6 max-w-2xl text-muted-foreground leading-relaxed">
              Full-stack developer passionate about innovating. My expertise
              lies in modern web technologies, focusing on creating scalable and
              maintainable solutions. All with a meticulous attention to
              performance and user experience.
            </p>
            <div className="pointer-events-none absolute top-0 left-0 size-6 border-primary/50 border-t-2 border-l-2" />
            <div className="pointer-events-none absolute right-0 bottom-0 size-6 border-primary/50 border-r-2 border-b-2" />
          </div>
          <DataCard
            className="h-full"
            fields={[
              { label: "Identity", value: "lisham_", highlight: true },
              { label: "Role", value: "Full-stack developer" },
              { label: "Focus", value: "Web / Mobile / Research" },
              { label: "Status", value: "Available to collaborate" },
            ]}
            subtitle="Developer profile"
            title="@mthlish"
          />
        </section>

        <AboutSection title="What I Do" sectionNumber={1}>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <SkillCard
              title="Full-Stack Development"
              description="I build end-to-end web applications using modern technologies like Next.js (React), TypeScript, Node.js. My focus is on creating performant, scalable, and maintainable solutions."
              icon={
                <Braces aria-hidden="true" className={skillIconClassName} />
              }
            />
            <SkillCard
              title="Frontend Expertise"
              description="Specializing in React and modern frontend frameworks, I create responsive and interactive user interfaces with a strong emphasis on user experience and accessibility."
              icon={
                <PanelsTopLeft
                  aria-hidden="true"
                  className={skillIconClassName}
                />
              }
            />
            <SkillCard
              title="Backend Development"
              description="I develop robust backend systems using Node.js and TypeScript, implementing RESTful APIs, database integrations, and server-side logic."
              icon={
                <Database aria-hidden="true" className={skillIconClassName} />
              }
            />
            <SkillCard
              title="Mobile Development"
              description="Using React Native and Expo, I build cross-platform mobile applications that provide native experiences while maintaining code reusability."
              icon={
                <Smartphone aria-hidden="true" className={skillIconClassName} />
              }
            />
            <SkillCard
              title="Research, Lecture Reviews, and Writing"
              description="Apart from coding, I devote significant time to comprehensive research, reviewing papers and articulate writing. Thus, I stay at the forefront of technological advancements and convey complex concepts effectively."
              icon={
                <BookOpenText
                  aria-hidden="true"
                  className={skillIconClassName}
                />
              }
            />
            <SkillCard
              title="Open Source Contribution"
              description="Often digging into open-source projects and contribute to their development. This allows me to learn from the best practices and connect with a vibrant developer community around the world."
              icon={
                <GitPullRequest
                  aria-hidden="true"
                  className={skillIconClassName}
                />
              }
            />
          </div>
        </AboutSection>

        <AboutSection title="Tech Stack" sectionNumber={2}>
          <GlowContainer
            className="overflow-hidden border-primary/20 bg-card/60 p-0"
            intensity="sm"
          >
            <div className="border-primary/20 border-b px-5 py-3 font-mono text-foreground/70 text-xs uppercase tracking-widest">
              Technology constellation
            </div>
            <div className="flex items-center justify-center">
              <OrbitRotation
                icons={[
                  { name: "betterAuth" },
                  { name: "drizzle" },
                  { name: "pnpm" },
                  { name: "neon" },
                  { name: "nextjs" },
                  { name: "vercel" },
                  { name: "postgresql" },
                  { name: "typescript" },
                  { name: "react" },
                  { name: "tailwindcss" },
                  { name: "zod" },
                  { name: "polar" },
                  { name: "shadcn" },
                  { name: "resend" },
                ]}
                centerIcon={{
                  name: "devin",
                }}
              />
            </div>
          </GlowContainer>
        </AboutSection>

        <AboutSection title="Frequently Asked Questions" sectionNumber={3}>
          <GlowContainer
            className="border-primary/20 bg-card/60 p-0"
            hover={false}
            intensity="sm"
          >
            <Accordion type="single" collapsible>
              <FAQItem
                value="identity"
                question="Who are you?"
                answer="Lisham, a self-taught Gabonese full-stack developer. I've been professionally coding since 2019. Technology is my passion, and these days I spend most of my time developing, researching, and writing."
              />
              <FAQItem
                value="philosophy"
                question="Your development philosophy?"
                answer="I believe in writing clean, maintainable code that solves real problems. I focus on creating reusable components and following best practices for scalability and performance."
              />
              <FAQItem
                value="approach"
                question="How do you approach projects?"
                answer="I start with understanding the core requirements and user needs, then plan the architecture and break down the implementation into manageable tasks. I emphasize testing and documentation throughout the development process."
              />
              <FAQItem
                value="stack"
                question="What stack do you use?"
                answer="My primary tech stack includes TypeScript, React, Next.js, Node.js, and PostgreSQL. I also work with React Native for mobile development and use tools like Tailwind CSS for styling. But I'm also ready to take on new challenges and learn new things."
              />
            </Accordion>
          </GlowContainer>
        </AboutSection>

        <AboutSection title="Get in Touch" sectionNumber={4}>
          <div className="grid items-start gap-8 md:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]">
            <div className="space-y-3">
              <div className="font-mono text-primary text-xs uppercase tracking-[0.25em]">
                Open channel
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Interested in collaborating or have a project in mind? Feel free
                to connect.
              </p>
            </div>
            <GlowContainer
              className="border-primary/30 bg-card/80 p-5 sm:p-6"
              intensity="md"
            >
              <ProjectRequestForm />
            </GlowContainer>
          </div>
        </AboutSection>
      </div>
    </main>
  );
}
