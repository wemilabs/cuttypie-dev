import Github from "./social-links/github";

const Hero = () => {
  return (
    <section className="flex items-center justify-center pt-[74px] pb-20 px-6 mt-16">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Hey, I'm <span className="text-yellow-200">Matheo</span>
        </h1>
        <p className="text-sm text-white/70 md:text-base font-light mb-8">
          <span className="font-bold">Full-Stack Developer</span> and{" "}
          <span className="font-bold">Open Source Contributor</span>
        </p>
        <div className="flex items-center justify-center">
          <a
            href="https://github.com/wemilabs"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github width={42} height={42} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
