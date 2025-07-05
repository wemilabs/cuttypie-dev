import { getAllPosts } from '@/lib/blog';
import { PostItem } from './post-item';

export async function PostGrid() {
	const posts = await getAllPosts();

	return (
		<div className='space-y-12'>
			{posts.map(post => (
				<PostItem key={post.slug} post={post} />
			))}
		</div>
	);
}
