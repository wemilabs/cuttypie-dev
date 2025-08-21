import type { Metadata } from 'next';

import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
	title: '404 Not Found | Mr T. ',
	description: "The page you're looking for is currently under construction.",
};

export default function NotFound() {
	return (
		<div className='flex flex-col items-center justify-center min-h-screen text-center px-4'>
			<Image
				src={
					'https://ubrw5iu3hw.ufs.sh/f/TFsxjrtdWsEIGtcBYwMbvhmfruEcpVlTJUtxFKi5Q91njSOM'
				}
				alt='404 Not Found'
				width={400}
				height={400}
				className='my-8 rounded-md'
			/>
			{/* <h1 className="text-4xl font-bold mb-4">Oops! Page Not Found</h1>
      <p className="text-muted-foreground mb-8">
      The page you're looking for does not exist or has been moved.
      </p> */}
			<h1 className='text-4xl font-bold mb-4'>Oops!</h1>
			<p className='mb-8 italic'>
				v1.1.0: the page you're looking for is currently under construction.
			</p>

			<Link href='/' className='hover:underline hover:underline-offset-4'>
				Go Back Home
			</Link>
		</div>
	);
}
