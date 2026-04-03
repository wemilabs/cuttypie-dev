import { BadgeType } from "@/components/projects/project-card";

export interface Project {
	title: string;
	description: string;
	image?: string;
	link?: string;
	badge: BadgeType;
	className?: string;
}

export const projects: Project[] = [
	{
		title: "ESSIG FCV",
		description: "USIA-ESSIG Franceville official website",
		image: "https://essigfcv.netlify.app/img/groupe-essig.png",
		link: "https://essigfcv.netlify.app/",
		badge: "in progress",
	},
	{
		title: "HolyLens",
		description:
			"A social blog focusing on spiritually lifting people through the power of words.",
		// link: "https://github.com/wemilabs/holylens",
		badge: "paused",
	},
	{
		title: "Wermi POS",
		description:
			"Next-generation point of sale system for restaurants and bars.",
		// link: "https://github.com/wemilabs/wermi-app",
		badge: "paused",
	},
	{
		title: "Dreamnal - Forget them anymore",
		description: "Dream Journaling Mobile App.",
		image:
			"https://ubrw5iu3hw.ufs.sh/f/TFsxjrtdWsEIbcHjyBmlalY8ZuTPQRqJXvyrKeEHz2finpFN",
		// link: "https://github.com/wemilabs/dreamnal",
		badge: "paused",
	},
	{
		title: "Turbo MIS",
		description: "Next-generation school management system.",
		image:
			"https://ubrw5iu3hw.ufs.sh/f/TFsxjrtdWsEIGX66jOsMbvhmfruEcpVlTJUtxFKi5Q91njSO",
		// link: "https://turbo-mis.vercel.app",
		badge: "paused",
	},
	{
		title: "Lytics",
		description: "An efficient data analytics tool",
		// link: "https://lytics-iota.vercel.app",
		badge: "paused",
	},
	{
		title: "OpenStud v1.60",
		description: "Education in today's smartest way.",
		image:
			"https://ubrw5iu3hw.ufs.sh/f/TFsxjrtdWsEINd5qsXKy9kHohf1BAiUGcSeL3dVQDnmF4YO6",
		link: "https://openstud.vercel.app",
		badge: "in progress",
	},
	{
		title: "KeepFlowing",
		description: "Managing project shouldn't be a chore. Stay in the flow.",
		image:
			"https://ubrw5iu3hw.ufs.sh/f/TFsxjrtdWsEIMlD3gXyOKu7I8gzycl5Ws9ViUDwbapXtnYfe",
		// link: "https://keepflowing.vercel.app",
		badge: "paused",
	},
	{
		title: "Arport",
		description: "The most comprehensive unified space for academic research.",
		image:
			"https://ubrw5iu3hw.ufs.sh/f/TFsxjrtdWsEI4pM6XjnZqQsdhAT9pz1X6GOCDUxFgc5k7SE3",
		link: "https://arport-psi.vercel.app",
		badge: "in progress",
	},
	{
		title: "Wemi Code Academy",
		description: "Your gateway to the world of coding. Always up to date.",
		// link: "https://wemi-code-academy.vercel.app/",
		badge: "paused",
	},
	{
		title: "Storm AI",
		description: "Generate brilliant ideas with AI.",
		image:
			"https://ubrw5iu3hw.ufs.sh/f/TFsxjrtdWsEI0TXFrhRriA5QhsLYUKlWjoBNdq3XbfgCE64I",
		// link: "https://storm-ai-two.vercel.app/",
		badge: "paused",
	},
	{
		title: "The Qlever Stack",
		description:
			"Build and Ship SaaS apps at 🚀 speed with the best modern cutting-edge tools.",
		link: "https://github.com/wemilabs/qlever-next-saas-template",
		badge: "in progress",
	},
	{
		title: "Noter AI",
		description: "The second brain you've always been waiting for.",
		image:
			"https://ubrw5iu3hw.ufs.sh/f/TFsxjrtdWsEIkIpfUvWv0leWaRgoOG4nyNr1BmJAiTsI8Xh3",
		link: "https://noter-beryl.vercel.app/",
		badge: "in progress",
	},
	{
		title: "LaPlume",
		description: "Your smart writing space built for productivity.",
		image:
			"https://ubrw5iu3hw.ufs.sh/f/TFsxjrtdWsEIkIpfUvWv0leWaRgoOG4nyNr1BmJAiTsI8Xh3",
		link: "https://laplume-omega.vercel.app/",
		badge: "in progress",
	},
	{
		title: "Sortopedia",
		description: "The Encyclopedia of Sorting Algorithms.",
		image:
			"https://ubrw5iu3hw.ufs.sh/f/TFsxjrtdWsEIkIpfUvWv0leWaRgoOG4nyNr1BmJAiTsI8Xh3",
		link: "https://sortopedia.vercel.app/",
		badge: "os contribution",
	},
	{
		title: "Starva.shop",
		description: "The Next Generation Social Marketplace.",
		image:
			"https://hsl8jk540a.ufs.sh/f/JFF4Q8WebB6du5UdXxlTLMJtliDeN9nXqzs57GUH6RgZbryB",
		link: "https://starva.shop",
		badge: "current",
	},
];
