import { cn } from "@/lib/shadcn/utils";

const AboutSection = ({
  title,
  className,
  children,
}: {
  title: string;
  className?: string;
  children: React.ReactNode;
}) => (
  <section className={cn("mb-16", className)}>
    <h2 className="text-2xl font-bold mb-6">{title}</h2>
    {children}
  </section>
);

export default AboutSection;
