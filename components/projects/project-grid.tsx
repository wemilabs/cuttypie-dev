'use client';

import { useState } from 'react';

import { BadgeType, ProjectCard } from '@/components/projects/project-card';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { projects } from '@/lib/data';
import { ChevronDown } from 'lucide-react';

const badgeOrder: Record<BadgeType, number> = {
	done: 0,
	current: 1,
	'in progress': 2,
	paused: 3,
};

function BadgeFilter({
	filter,
	filterFunc,
	filterQty,
}: {
	filter: 'all' | BadgeType;
	filterFunc: (value: 'all' | BadgeType) => void;
	filterQty: {
		current: number;
		inProgress: number;
		paused: number;
		done: number;
	};
}) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='outline' size='sm'>
					{filter === 'all'
						? 'All projects'
						: filter.charAt(0).toUpperCase() + filter.slice(1)}
					<ChevronDown className='size-4 ml-2' />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end' className='bg-black/95'>
				<DropdownMenuRadioGroup
					value={filter}
					onValueChange={value => filterFunc(value as 'all' | BadgeType)}
				>
					<DropdownMenuRadioItem value='all'>
						All{' '}
						<span className='text-xs text-white/50 ml-2 mt-0.5'>
							{filterQty.current + filterQty.inProgress + filterQty.paused}
						</span>
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value='current'>
						Current{' '}
						<span className='text-xs text-white/50 ml-2 mt-0.5'>
							{filterQty.current}
						</span>
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value='in progress'>
						In progress{' '}
						<span className='text-xs text-white/50 ml-2 mt-0.5'>
							{filterQty.inProgress}
						</span>
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value='paused'>
						Paused{' '}
						<span className='text-xs text-white/50 ml-2 mt-0.5'>
							{filterQty.paused}
						</span>
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value='done'>
						Done{' '}
						<span className='text-xs text-white/50 ml-2 mt-0.5'>
							{filterQty.done}
						</span>
					</DropdownMenuRadioItem>
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export function ProjectGrid() {
	const [badgeFilter, setBadgeFilter] = useState<'all' | BadgeType>('all');

	const filterQty = {
		current: [...projects].filter(project => project.badge === 'current')
			.length,
		inProgress: [...projects].filter(project => project.badge === 'in progress')
			.length,
		paused: [...projects].filter(project => project.badge === 'paused').length,
		done: [...projects].filter(project => project.badge === 'done').length,
	};

	const filteredAndSortedProjects = [...projects]
		.filter(project =>
			badgeFilter === 'all' ? true : project.badge === badgeFilter
		)
		.sort((a, b) => {
			const badgeDiff =
				(badgeOrder[a.badge as BadgeType] ?? 99) -
				(badgeOrder[b.badge as BadgeType] ?? 99);
			if (badgeDiff !== 0) return badgeDiff;
			return a.title.localeCompare(b.title);
		});

	return (
		<section
			id='featured-projects'
			className='max-w-6xl mx-auto px-6 pt-0 pb-16'
		>
			<h2 className='text-2xl text-center font-bold mb-8'>
				What I've been working on
			</h2>
			<div className='flex justify-end mb-6'>
				<BadgeFilter
					filter={badgeFilter}
					filterFunc={setBadgeFilter}
					filterQty={filterQty}
				/>
			</div>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
				{filteredAndSortedProjects.map((project, index) => (
					<ProjectCard key={index} {...project} />
				))}
			</div>
		</section>
	);
}
