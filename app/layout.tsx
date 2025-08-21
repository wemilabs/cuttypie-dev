import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { unstable_ViewTransition as ViewTransition } from 'react';
import './globals.css';

import { AuthModal, AuthProvider } from '@/components/auth';
import { SessionProvider } from '@/components/providers/session-provider';
import Header from '@/components/shared/header';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Mr T. ',
	description: "Mr T.'s website.",
	metadataBase: new URL('https://cuttypiedev.vercel.app/'),
	keywords: [
		'developer',
		'frontend',
		'backend',
		'fullstack',
		'react',
		'next.js',
		'typescript',
		'javascript',
		'cuttypie',
		'mr t.',
		'Mr T.',
	],
	authors: [
		{
			name: 'Mr T.',
			url: 'https://cuttypiedev.vercel.app/',
		},
	],
	creator: 'Mr T.',
	openGraph: {
		type: 'website',
		locale: 'en_US',
		url: 'https://cuttypiedev.vercel.app/',
		title: 'Mr T. ',
		description: "Mr T.'s website.",
		siteName: 'Mr T. ',
		images: [
			{
				url: 'https://ubrw5iu3hw.ufs.sh/f/TFsxjrtdWsEItcjH8NfMhVmKxAzk0snGS3pR2rOLb8tZ1UHu',
				width: 1200,
				height: 630,
				alt: 'Mr T. ',
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Mr T. ',
		description: "Mr T.'s website.",
		images: [
			'https://ubrw5iu3hw.ufs.sh/f/TFsxjrtdWsEItcjH8NfMhVmKxAzk0snGS3pR2rOLb8tZ1UHu',
		],
		creator: '@DorianTho5',
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en' suppressHydrationWarning>
			<body
				className={`${geistSans.className} ${geistMono.className} antialiased`}
			>
				<Header />
				<SessionProvider>
					<AuthProvider>
						<AuthModal />
						<main className='bg-black text-white min-h-screen'>
							<ViewTransition>{children}</ViewTransition>
						</main>
					</AuthProvider>
				</SessionProvider>
				<Analytics />
			</body>
		</html>
	);
}
