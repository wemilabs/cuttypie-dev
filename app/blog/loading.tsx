import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
	return (
		<div className='max-w-4xl mx-auto px-6 py-36'>
			<h1 className='text-4xl font-bold mb-8'>Latest Posts</h1>
			<Skeleton className='w-full h-52 bg-white/5 rounded-lg p-6 hover:bg-white/10 transition' />
		</div>
	);
}
