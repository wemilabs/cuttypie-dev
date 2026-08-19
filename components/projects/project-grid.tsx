"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/dropdown-menu";
import { ProjectCard } from "@/components/projects/project-card";
import { Tag } from "@/components/tag";
import { type BadgeType, projects } from "@/lib/data";

const badgeOrder: Record<BadgeType, number> = {
  done: 0,
  current: 1,
  "in progress": 2,
  "os contribution": 3,
  paused: 4,
};

const badgeLabels: Record<"all" | BadgeType, string> = {
  all: "All projects",
  current: "Current",
  done: "Done",
  "in progress": "In progress",
  "os contribution": "OS contribution",
  paused: "Paused",
};

const filterOptions: ("all" | BadgeType)[] = [
  "all",
  "current",
  "in progress",
  "paused",
  "done",
  "os contribution",
];

type FilterCounts = Record<"all" | BadgeType, number>;

function BadgeFilter({
  counts,
  filter,
  onFilterChange,
}: {
  counts: FilterCounts;
  filter: "all" | BadgeType;
  onFilterChange: (value: "all" | BadgeType) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          aria-label={`Filter projects. Current filter: ${badgeLabels[filter]}`}
          className="font-mono text-[10px] uppercase tracking-widest"
        >
          {badgeLabels[filter]}
          <ChevronDown aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-52">
        <DropdownMenuRadioGroup
          value={filter}
          onValueChange={(value) => onFilterChange(value as "all" | BadgeType)}
        >
          {filterOptions.map((option) => (
            <DropdownMenuRadioItem key={option} value={option}>
              {badgeLabels[option]}
              <span className="ml-auto font-mono text-xs text-muted-foreground">
                {counts[option]}
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ProjectGrid() {
  const [badgeFilter, setBadgeFilter] = useState<"all" | BadgeType>("all");

  const filterCounts = projects.reduce<FilterCounts>(
    (counts, project) => {
      counts[project.badge] += 1;
      return counts;
    },
    {
      all: projects.length,
      current: 0,
      done: 0,
      "in progress": 0,
      "os contribution": 0,
      paused: 0,
    },
  );

  const filteredAndSortedProjects = [...projects]
    .filter((project) =>
      badgeFilter === "all" ? true : project.badge === badgeFilter,
    )
    .sort((a, b) => {
      const badgeDifference = badgeOrder[a.badge] - badgeOrder[b.badge];

      if (badgeDifference !== 0) {
        return badgeDifference;
      }

      return a.title.localeCompare(b.title);
    });

  return (
    <section
      id="featured-projects"
      aria-labelledby="featured-projects-heading"
      className="mx-auto max-w-6xl scroll-mt-28 px-4 pb-20 sm:px-6 sm:pb-24"
    >
      <div className="mb-8 flex flex-col gap-5 border-primary/25 border-y py-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <Tag variant="outline">Selected work</Tag>
          <h2 id="featured-projects-heading" className="text-2xl sm:text-3xl">
            What I&apos;ve been working on
          </h2>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Products, experiments, and open-source contributions, ordered by
            project status.
          </p>
        </div>
        <BadgeFilter
          counts={filterCounts}
          filter={badgeFilter}
          onFilterChange={setBadgeFilter}
        />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {filteredAndSortedProjects.map((project) => (
          <ProjectCard key={project.title} {...project} />
        ))}
      </div>
    </section>
  );
}
