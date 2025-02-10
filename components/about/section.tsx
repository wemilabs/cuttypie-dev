const AboutSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section className="mb-16">
    <h2 className="text-2xl font-bold mb-6">{title}</h2>
    {children}
  </section>
);

export default AboutSection;
