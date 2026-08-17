import { Icons } from "@/components/icons";

const Hero = () => {
  return (
    <section className="flex items-center justify-center pt-18.5 pb-10 px-6 mt-16">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Hey, I'm <span className="text-brand">lisham_</span>
        </h1>
        <p className="text-sm md:text-base tracking-tighter text-muted-foreground font-light mb-4">
          <span className="font-bold">Full-Stack Developer</span> and{" "}
          <span className="font-bold">Tech Blogger</span>
        </p>
        <div className="flex items-center justify-center">
          <a
            href="https://github.com/wemilabs"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icons.github className="size-11" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
