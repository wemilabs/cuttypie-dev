import type { Metadata } from 'next';

import { PostGrid } from '@/components/posts/post-grid';

export const metadata: Metadata = {
	title: 'Blog | Matheo (cuttypie)',
	description: 'Read my latest blog posts about tech trends and projects.',
	metadataBase: new URL('https://cuttypiedev.vercel.app/blog/'),
	keywords: [
		'blog',
		'tech',
		'trends',
		'projects',
		'typescript',
		'javascript',
		'react',
		'next.js',
		'fullstack',
		'developer',
	],
};

export default async function BlogIndex() {
	return (
		<div className='max-w-4xl mx-auto px-6 py-36'>
			<h1 className='text-4xl font-bold mb-8'>Latest Posts</h1>
			<PostGrid />
		</div>
	);
}
