const SkillCard = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div className="bg-muted/50 rounded-lg p-6 hover:bg-muted transition hover:shadow-md hover:shadow-brand duration-200 border border-transparent hover:border-brand">
    <h3 className="text-lg text-brand font-bold mb-3">{title}</h3>
    <p className="text-sm text-muted-foreground leading-relaxed">
      {description}
    </p>
  </div>
);

export default SkillCard;
