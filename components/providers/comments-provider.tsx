'use client';

import { getComments } from '@/lib/actions/comment';
import { createContext, useCallback, useContext, useState } from 'react';

interface CommentAuthor {
	name: string | null;
	email: string;
}

interface CommentWithAuthor {
	id: string;
	content: string;
	createdAt: Date;
	authorId: string;
	postSlug: string;
	parentId: string | null;
	isPinned: boolean;
	author: CommentAuthor;
	replies?: CommentWithAuthor[];
}

interface CommentsContextType {
	comments: CommentWithAuthor[];
	isLoading: boolean;
	error: string | null;
	fetchComments: (postSlug: string) => Promise<void>;
	addComment: (comment: CommentWithAuthor) => void;
	removeComment: (commentId: string) => void;
	updateComment: (commentId: string, updatedComment: CommentWithAuthor) => void;
	togglePinStatus: (commentId: string, isPinned: boolean) => void;
}

const CommentsContext = createContext<CommentsContextType | undefined>(
	undefined
);

export function CommentsProvider({ children }: { children: React.ReactNode }) {
	const [comments, setComments] = useState<CommentWithAuthor[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchComments = useCallback(async (postSlug: string) => {
		setIsLoading(true);
		setError(null);
		try {
			const result = await getComments(postSlug);
			if (result.error) {
				setError(result.error);
			} else if (result.comments) {
				setComments(result.comments);
			}
		} catch (err) {
			console.error('Failed to fetch comments:', err);
			setError('Failed to load comments');
		} finally {
			setIsLoading(false);
		}
	}, []);

	const addComment = useCallback((newComment: CommentWithAuthor) => {
		setComments(prevComments => {
			// Helper function to add reply at any depth
			const addReplyToComment = (
				comments: CommentWithAuthor[]
			): CommentWithAuthor[] => {
				return comments.map(comment => {
					// If this is the parent comment we're looking for
					if (comment.id === newComment.parentId) {
						return {
							...comment,
							replies: [...(comment.replies || []), newComment],
						};
					}
					// If this comment has replies, recursively search them
					if (comment.replies?.length) {
						return {
							...comment,
							replies: addReplyToComment(comment.replies),
						};
					}
					return comment;
				});
			};

			// If it's a top-level comment, add it to the root
			if (!newComment.parentId) {
				return [newComment, ...prevComments];
			}

			// Otherwise, recursively add it to its parent
			return addReplyToComment(prevComments);
		});
	}, []);

	const removeComment = useCallback((commentId: string) => {
		setComments(prevComments => {
			const processComments = (
				comments: CommentWithAuthor[]
			): CommentWithAuthor[] => {
				return comments.reduce((acc: CommentWithAuthor[], comment) => {
					// Skip this comment if it's the one to remove
					if (comment.id === commentId) {
						return acc;
					}

					// Process replies if they exist
					const processedComment = { ...comment };
					if (processedComment.replies?.length) {
						processedComment.replies = processComments(
							processedComment.replies
						);
					}

					return [...acc, processedComment];
				}, []);
			};

			return processComments(prevComments);
		});
	}, []);

	const updateComment = useCallback(
		(commentId: string, updatedComment: CommentWithAuthor) => {
			setComments(prevComments => {
				const processComments = (
					comments: CommentWithAuthor[]
				): CommentWithAuthor[] => {
					return comments.map(comment => {
						// If this is the comment to update
						if (comment.id === commentId) {
							return {
								...updatedComment,
								replies: comment.replies, // Preserve existing replies
							};
						}

						// Process replies if they exist
						const processedComment = { ...comment };
						if (processedComment.replies?.length) {
							processedComment.replies = processComments(
								processedComment.replies
							);
						}

						return processedComment;
					});
				};

				// Process the comments
				const updatedComments = processComments(prevComments);

				// Re-sort comments if pinned status changed
				if (
					updatedComment.isPinned !==
					prevComments.find(c => c.id === commentId)?.isPinned
				) {
					return updatedComments.sort((a, b) => {
						// First sort by pinned status
						if (a.isPinned && !b.isPinned) return -1;
						if (!a.isPinned && b.isPinned) return 1;
						// Then sort by date
						return (
							new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
						);
					});
				}

				return updatedComments;
			});
		},
		[]
	);

	const togglePinStatus = useCallback(
		(commentId: string, isPinned: boolean) => {
			setComments(prevComments => {
				const processComments = (
					comments: CommentWithAuthor[]
				): CommentWithAuthor[] => {
					return comments.map(comment => {
						// If this is the comment to update
						if (comment.id === commentId) {
							return {
								...comment,
								isPinned,
							};
						}

						// Process replies if they exist
						const processedComment = { ...comment };
						if (processedComment.replies?.length) {
							processedComment.replies = processComments(
								processedComment.replies
							);
						}

						return processedComment;
					});
				};

				// Process the comments
				const updatedComments = processComments(prevComments);

				// Re-sort comments to put pinned ones at the top
				return updatedComments.sort((a, b) => {
					// First sort by pinned status
					if (a.isPinned && !b.isPinned) return -1;
					if (!a.isPinned && b.isPinned) return 1;
					// Then sort by date
					return (
						new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
					);
				});
			});
		},
		[]
	);

	return (
		<CommentsContext.Provider
			value={{
				comments,
				isLoading,
				error,
				fetchComments,
				addComment,
				removeComment,
				updateComment,
				togglePinStatus,
			}}
		>
			{children}
		</CommentsContext.Provider>
	);
}

export function useComments() {
	const context = useContext(CommentsContext);
	if (!context) {
		throw new Error('useComments must be used within CommentsProvider');
	}
	return context;
}
