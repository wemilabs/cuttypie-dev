export type BadgeType =
  | "os contribution"
  | "current"
  | "in progress"
  | "paused"
  | "done";

export interface Project {
  title: string;
  description: string;
  image?: string;
  link?: string;
  badge: BadgeType;
  className?: string;
  position: number;
}

export const projects: Project[] = [
  {
    title: "ESSIG FCV",
    description: "USIA-ESSIG Franceville official website",
    image: "https://essigfcv.netlify.app/img/groupe-essig.png",
    link: "https://essigfcv.netlify.app/",
    badge: "in progress",
    position: 1,
  },
  {
    title: "HolyLens",
    description:
      "A social blog focusing on spiritually lifting people through the power of words.",
    // link: "https://github.com/wemilabs/holylens",
    badge: "paused",
    position: 2,
  },
  {
    title: "Wermi POS",
    description:
      "Next-generation point of sale system for restaurants and bars.",
    // link: "https://github.com/wemilabs/wermi-app",
    badge: "paused",
    position: 3,
  },
  {
    title: "Dreamnal - Forget them anymore",
    description: "Dream Journaling Mobile App.",
    image:
      "https://ubrw5iu3hw.ufs.sh/f/TFsxjrtdWsEIbcHjyBmlalY8ZuTPQRqJXvyrKeEHz2finpFN",
    // link: "https://github.com/wemilabs/dreamnal",
    badge: "paused",
    position: 4,
  },
  {
    title: "Turbo MIS",
    description: "Next-generation school management system.",
    image:
      "https://ubrw5iu3hw.ufs.sh/f/TFsxjrtdWsEIGX66jOsMbvhmfruEcpVlTJUtxFKi5Q91njSO",
    // link: "https://turbo-mis.vercel.app",
    badge: "paused",
    position: 5,
  },
  {
    title: "Lytics",
    description: "An efficient data analytics tool",
    // link: "https://lytics-iota.vercel.app",
    badge: "paused",
    position: 6,
  },
  {
    title: "OpenStud v1.60",
    description: "Education in today's smartest way.",
    image:
      "https://ubrw5iu3hw.ufs.sh/f/TFsxjrtdWsEINd5qsXKy9kHohf1BAiUGcSeL3dVQDnmF4YO6",
    link: "https://openstud.vercel.app",
    badge: "in progress",
    position: 7,
  },
  {
    title: "KeepFlowing",
    description: "Managing project shouldn't be a chore. Stay in the flow.",
    image:
      "https://ubrw5iu3hw.ufs.sh/f/TFsxjrtdWsEIMlD3gXyOKu7I8gzycl5Ws9ViUDwbapXtnYfe",
    // link: "https://keepflowing.vercel.app",
    badge: "paused",
    position: 8,
  },
  {
    title: "Arport",
    description: "The most comprehensive unified space for academic research.",
    image:
      "https://ubrw5iu3hw.ufs.sh/f/TFsxjrtdWsEI4pM6XjnZqQsdhAT9pz1X6GOCDUxFgc5k7SE3",
    // link: "https://arport-psi.vercel.app",
    badge: "in progress",
    position: 9,
  },
  {
    title: "Wemi Code Academy",
    description: "Your gateway to the world of coding. Always up to date.",
    // link: "https://wemi-code-academy.vercel.app/",
    badge: "paused",
    position: 10,
  },
  {
    title: "Storm AI",
    description: "Generate brilliant ideas with AI.",
    image:
      "https://ubrw5iu3hw.ufs.sh/f/TFsxjrtdWsEI0TXFrhRriA5QhsLYUKlWjoBNdq3XbfgCE64I",
    // link: "https://storm-ai-two.vercel.app/",
    badge: "paused",
    position: 11,
  },
  {
    title: "The Qlever Stack",
    description:
      "Build and Ship SaaS apps at 🚀 speed with the best modern cutting-edge tools.",
    link: "https://github.com/wemilabs/qlever-next-saas-template",
    badge: "in progress",
    position: 12,
  },
  {
    title: "Noter AI",
    description: "The second brain you've always been waiting for.",
    image:
      "https://ubrw5iu3hw.ufs.sh/f/TFsxjrtdWsEIkIpfUvWv0leWaRgoOG4nyNr1BmJAiTsI8Xh3",
    link: "https://noter-beryl.vercel.app/",
    badge: "in progress",
    position: 13,
  },
  {
    title: "LaPlume",
    description: "Your smart writing space built for productivity.",
    image:
      "https://ubrw5iu3hw.ufs.sh/f/TFsxjrtdWsEIkIpfUvWv0leWaRgoOG4nyNr1BmJAiTsI8Xh3",
    link: "https://laplume-omega.vercel.app/",
    badge: "in progress",
    position: 14,
  },
  {
    title: "Sortopedia",
    description: "The Encyclopedia of Sorting Algorithms.",
    image:
      "https://ubrw5iu3hw.ufs.sh/f/TFsxjrtdWsEIkIpfUvWv0leWaRgoOG4nyNr1BmJAiTsI8Xh3",
    link: "https://sortopedia.vercel.app/",
    badge: "os contribution",
    position: 15,
  },
  {
    title: "Starva.shop",
    description: "The Next Generation Social Marketplace.",
    image:
      "https://hsl8jk540a.ufs.sh/f/JFF4Q8WebB6du5UdXxlTLMJtliDeN9nXqzs57GUH6RgZbryB",
    link: "https://starva.shop",
    badge: "current",
    position: 16,
  },
  {
    title: "PRISM",
    description:
      "An explainable risk assessment tool. Contributing factors are estimated using a lightweight, real-time approximation method. PRISM is a research and demonstration tool and is NOT YET validated for clinical use or real patient decision-making.",
    link: "https://github.com/wemilabs/mdrp26",
    badge: "in progress",
    position: 17,
  },
  {
    title: "Zapron | The research engine for academics",
    description:
      "Search, explore, and reason over the global research record. Powered by OpenAlex.",
    image:
      "https://ubrw5iu3hw.ufs.sh/f/TFsxjrtdWsEIAtTrGk8LQvXsUCu2GpW0aw8c4jifV7HDIJ9S",
    link: "https://zapron.vercel.app/",
    badge: "in progress",
    position: 18,
  },
];
