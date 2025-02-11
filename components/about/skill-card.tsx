const SkillCard = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div className="bg-white/5 rounded-lg p-6 hover:bg-white/10 transition hover:shadow-md hover:shadow-yellow-200 duration-200 border border-transparent hover:border-yellow-200">
    <h3 className="text-xl text-yellow-200 font-bold mb-3">{title}</h3>
    <p className="text-white/70 leading-relaxed">{description}</p>
  </div>
);

export default SkillCard;
