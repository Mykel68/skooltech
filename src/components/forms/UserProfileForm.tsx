'use client';

import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import axios from 'axios';

import { Button } from '@/components/ui/button';
import { FormField } from '@/components/FormField';
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '@/components/ui/dialog';
import { userProfileSchema } from '@/schema/userProfileSchema';
import type { ProfileFormData } from '@/types/profile';
import { updateUserProfile } from '@/services/httpClient';
import { useUserStore } from '@/stores/userStore';

export function UserProfileForm() {
	const setUser = useUserStore((state) => state.setUser);
	const userId = useUserStore((state) => state.userId);
	const [open, setOpen] = useState(false);

	// Fetch current profile
	const { data: initialData, isLoading } = useQuery({
		queryKey: ['userProfile', userId],
		queryFn: async () => {
			const { data } = await axios.get(`/api/user/get-profile/${userId}`);
			return data.data;
		},
		enabled: !!userId,
	});

	// Form setup
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting, dirtyFields },
		reset,
	} = useForm<ProfileFormData>({
		resolver: zodResolver(userProfileSchema),
		defaultValues: {
			first_name: '',
			last_name: '',
			email: '',
			username: '',
		},
	});

	useEffect(() => {
		if (initialData) {
			reset(initialData);
		}
	}, [initialData, reset]);

	const mutation = useMutation({
		mutationFn: (payload: ProfileFormData & { user_id: string }) =>
			updateUserProfile(payload),
		onSuccess: (data: any) => {
			toast.success('User profile updated successfully!');
			setUser({
				firstName: data.first_name,
				lastName: data.last_name,
				email: data.email,
				username: data.username,
			});
			setOpen(false);
		},
		onError: (error: Error) => {
			console.error('[UserProfileForm] Update error:', error);
			toast.error(error.message || 'Failed to update user profile.');
		},
	});

	const onSubmit = (data: ProfileFormData) => {
		if (!initialData) return;

		const changedData = Object.fromEntries(
			Object.entries(data).filter(
				([key]) => dirtyFields[key as keyof ProfileFormData]
			)
		);

		const payload = {
			user_id: userId, // ← add this
			...changedData,
		};

		// Build payload with user_id
		console.log('[UserProfileForm] Submitting payload:', payload);
		mutation.mutate(payload as any);
	};

	if (isLoading) return <div>Loading...</div>;

	return (
		<>
			{/* Display Section */}
			<div className='space-y-6'>
				<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
					<FormField
						id='firstName'
						label='First Name'
						defaultValue={initialData?.first_name}
						register={register('first_name')}
						error={errors.first_name}
						readOnly
					/>
					<FormField
						id='lastName'
						label='Last Name'
						defaultValue={initialData?.last_name}
						register={register('last_name')}
						error={errors.last_name}
						readOnly
					/>
					<FormField
						id='email'
						label='Email'
						defaultValue={initialData?.email}
						register={register('email')}
						error={errors.email}
						readOnly
					/>
					<FormField
						id='username'
						label='Username'
						defaultValue={initialData?.username}
						register={register('username')}
						error={errors.username}
						readOnly
					/>
				</div>
				<Dialog
					open={open}
					onOpenChange={setOpen}
				>
					<DialogTrigger asChild>
						<Button className='w-full md:w-auto bg-blue-500 hover:bg-blue-600'>
							Edit Profile
						</Button>
					</DialogTrigger>
					<DialogContent className='sm:max-w-md'>
						<DialogHeader>
							<DialogTitle>Edit Profile</DialogTitle>
						</DialogHeader>
						<form
							onSubmit={handleSubmit(onSubmit)}
							className='space-y-6'
						>
							<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
								<FormField
									id='firstNameEdit'
									label='First Name'
									placeholder='Enter first name'
									register={register('first_name')}
									error={errors.first_name}
								/>
								<FormField
									id='lastNameEdit'
									label='Last Name'
									placeholder='Enter last name'
									register={register('last_name')}
									error={errors.last_name}
								/>
								<FormField
									id='emailEdit'
									label='Email'
									placeholder='Enter email address'
									register={register('email')}
									error={errors.email}
								/>
								<FormField
									id='usernameEdit'
									label='Username'
									placeholder='Enter username'
									register={register('username')}
									error={errors.username}
								/>
							</div>
							<DialogFooter className='flex justify-end space-x-2'>
								<Button
									type='button'
									variant='outline'
									onClick={() => setOpen(false)}
									disabled={
										isSubmitting || mutation.isPending
									}
								>
									Cancel
								</Button>
								<Button
									type='submit'
									disabled={
										isSubmitting || mutation.isPending
									}
								>
									{mutation.isPending
										? 'Saving...'
										: 'Save Changes'}
								</Button>
							</DialogFooter>
						</form>
					</DialogContent>
				</Dialog>
			</div>
		</>
	);
}
