import { ArrowDown, BookOpen } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/button";
import { HeroSection } from "@/components/hero-section";
import { Icons } from "@/components/icons";

const Hero = () => {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-8 pb-12 sm:px-6 sm:pt-12 sm:pb-16">
      <HeroSection
        align="left"
        badge="Full-stack developer · Tech blogger"
        title={
          <>
            Hey, I&apos;m{" "}
            <span className="text-primary glow-text">lisham_</span>
          </>
        }
        description="I build full-stack products and write about technology. Explore the projects I have been working on or read the latest from the blog."
        className="flex min-h-128 items-center"
      >
        <Button asChild size="lg">
          <a href="#featured-projects">
            View projects
            <ArrowDown aria-hidden="true" />
          </a>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/blog">
            Read the blog
            <BookOpen aria-hidden="true" />
          </Link>
        </Button>
        <Button asChild size="icon-lg" variant="ghost">
          <a
            href="https://github.com/wemilabs"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit lisham on GitHub"
          >
            <Icons.github aria-hidden="true" />
          </a>
        </Button>
      </HeroSection>
    </section>
  );
};

export default Hero;
