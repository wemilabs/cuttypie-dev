'use client';

import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { useEffect } from 'react';

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error('Blog post error:', error);
	}, [error]);

	return (
		<div className='flex h-[50vh] flex-col items-center justify-center gap-4 text-center'>
			<div className='flex size-20 items-center justify-center rounded-full bg-muted'>
				<AlertTriangle className='size-10 text-destructive' />
			</div>
			<h2 className='text-2xl font-bold'>Something went wrong!</h2>
			<p className='text-muted-foreground'>
				There was an error getting this blog post.
			</p>
			<Button onClick={() => reset()} variant='default'>
				Try again
			</Button>
		</div>
	);
}
