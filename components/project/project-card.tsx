import Image from "next/image";

const ProjectCard = ({
  title,
  description,
  image,
  link,
}: {
  title: string;
  description: string;
  image?: string;
  link: string;
}) => {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition"
    >
      <div className="aspect-video relative overflow-hidden">
        <Image
          src={
            image ??
            "https://5n5vhs0v3c.ufs.sh/f/fXNe0o275jNhLMaMgPyr1U0RfETg7K8AuPGp5hqYH3dx6cCt"
          }
          alt={title}
          width={500}
          height={500}
          className="object-cover w-full h-full group-hover:scale-105 transition duration-500"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-white/70">{description}</p>
      </div>
    </a>
  );
};

export default ProjectCard;
