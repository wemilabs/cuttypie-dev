import type { ReactNode } from "react";

import { FeatureCard } from "@/components/feature-card";

interface SkillCardProps {
  description: string;
  icon?: ReactNode;
  title: string;
}

const SkillCard = ({ title, description, icon }: SkillCardProps) => (
  <FeatureCard
    className="h-full"
    description={description}
    icon={icon}
    title={title}
  />
);

export default SkillCard;
