'use client';

import { useSession } from '@/components/providers/session-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signIn, signUp } from '@/lib/actions/auth';
import { SignInInput, SignUpInput } from '@/lib/validations/auth';
import { useState } from 'react';
import { useAuth } from './auth-context';

export function AuthForm() {
	const { mode, switchMode, closeAuth, handleSignUpSuccess } = useAuth();
	const { refresh } = useSession();
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError(null);
		setLoading(true);

		const formData = new FormData(e.currentTarget);
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		try {
			if (mode === 'signin') {
				const data: SignInInput = { email, password };
				const result = await signIn(data);
				if (!result.success) {
					setError(result.error);
				} else {
					// Refresh session and close modal
					await refresh();
					closeAuth();
				}
			} else {
				const name = formData.get('name') as string;
				const data: SignUpInput = { email, password, name };
				const result = await signUp(data);
				if (!result.success) {
					setError(result.error);
				} else {
					// Switch to sign in mode after successful signup
					handleSignUpSuccess();
					setError(null);
					// Clear the form
					e.currentTarget.reset();
				}
			}
		} catch (err) {
			setError('An unexpected error occurred');
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className='space-y-4'>
			{error && (
				<div className='p-3 text-sm text-red-500 bg-red-50 rounded-md'>
					{error}
				</div>
			)}

			{mode === 'signup' && (
				<div className='space-y-2'>
					<Label htmlFor='name'>Name</Label>
					<Input
						id='name'
						name='name'
						placeholder='John Doe'
						required
						minLength={2}
					/>
				</div>
			)}

			<div className='space-y-2'>
				<Label htmlFor='email'>Email</Label>
				<Input
					id='email'
					name='email'
					type='email'
					placeholder='you@example.com'
					required
				/>
			</div>

			<div className='space-y-2'>
				<Label htmlFor='password'>Password</Label>
				<Input
					id='password'
					name='password'
					type='password'
					required
					minLength={8}
				/>
			</div>

			<Button type='submit' className='w-full' disabled={loading}>
				{loading ? (
					<div className='flex items-center gap-2'>
						<div className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
						{mode === 'signin' ? 'Signing in...' : 'Signing up...'}
					</div>
				) : mode === 'signin' ? (
					'Sign In'
				) : (
					'Sign Up'
				)}
			</Button>

			<div className='text-center text-sm'>
				{mode === 'signin' ? (
					<p>
						Don&apos;t have an account?{' '}
						<button
							type='button'
							onClick={switchMode}
							className='text-primary hover:underline'
						>
							Sign Up
						</button>
					</p>
				) : (
					<p>
						Already have an account?{' '}
						<button
							type='button'
							onClick={switchMode}
							className='text-primary hover:underline'
						>
							Sign In
						</button>
					</p>
				)}
			</div>
		</form>
	);
}
