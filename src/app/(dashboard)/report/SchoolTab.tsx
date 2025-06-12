'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Edit3, Save, X, Upload } from 'lucide-react';
import axios from 'axios';
import { uploadSchoolImage } from '@/utils/vercelBlob';

// Schema for form validation
const schoolInfoSchema = z.object({
	name: z.string().min(1, 'School name is required'),
	address: z.string().optional(),
	phone_number: z.string().optional(),
	email: z
		.string()
		.email('Invalid email format')
		.optional()
		.or(z.literal('')),
	motto: z.string().optional(),
});

interface Props {
	schoolInfo: any;
	email: string;
	schoolId: string;
}

const SchoolInformationTab = ({ schoolInfo, email, schoolId }: Props) => {
	const [isEditing, setIsEditing] = useState(false);
	const [selectedImage, setSelectedImage] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<
		string | ArrayBuffer | null
	>(null);

	const [isImageUploading, setIsImageUploading] = useState(false);
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const queryClient = useQueryClient();

	// Form setup
	const form = useForm({
		resolver: zodResolver(schoolInfoSchema),
		defaultValues: {
			name: schoolInfo?.name || '',
			address: schoolInfo?.address || '',
			phone_number: schoolInfo?.phone_number || '',
			email: email || '',
			motto: schoolInfo?.motto || '',
		},
	});

	// Update school info mutation
	const updateSchoolInfoMutation = useMutation({
		mutationFn: async (data) => {
			const response = await axios.patch(
				`/api/school/edit-profile/${schoolId}`,
				data
			);
			return response.data;
		},
		onSuccess: () => {
			toast.success('School information updated successfully!');
			setIsEditing(false);
			queryClient.invalidateQueries({ queryKey: ['schoolInfo'] });
		},
		onError: (error: any) => {
			toast.error(
				error.response?.data?.message ||
					'Failed to update school information'
			);
		},
	});

	const onSubmit = (data: any) => {
		updateSchoolInfoMutation.mutate(data);
	};

	const handleImageClick = () => {
		fileInputRef.current?.click();
	};

	const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setSelectedImage(file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleImageSave = async () => {
		if (!selectedImage) return;

		setIsImageUploading(true);
		try {
			// Upload to Vercel Blob
			const url = await uploadSchoolImage(selectedImage);

			// Update backend with image URL using the same endpoint
			await axios.patch(`/api/school/edit-profile/${schoolId}`, {
				school_image: url,
			});

			toast.success('School image updated successfully!');
			setSelectedImage(null);
			setImagePreview(null);
			queryClient.invalidateQueries({ queryKey: ['schoolInfo'] });
		} catch (error: any) {
			console.error(error);
			toast.error(
				error?.response?.data?.message ||
					'Failed to upload school image'
			);
		} finally {
			setIsImageUploading(false);
		}
	};

	const handleImageCancel = () => {
		setSelectedImage(null);
		setImagePreview(null);
		// Reset file input
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	const handleCancel = () => {
		form.reset();
		setIsEditing(false);
	};

	useEffect(() => {
		if (schoolInfo) {
			form.reset({
				name: schoolInfo.name || '',
				address: schoolInfo.address || '',
				phone_number: schoolInfo.phone_number || '',
				email: email || '',
				motto: schoolInfo.motto || '',
			});
		}
	}, [schoolInfo, email]);

	return (
		<div className='space-y-6'>
			{/* School Profile Card */}
			<Card>
				<CardHeader>
					<div className='flex items-center justify-between'>
						<div>
							<CardTitle>School Profile</CardTitle>
							<CardDescription>
								Manage your school's basic information and
								branding
							</CardDescription>
						</div>
						{!isEditing && (
							<Button
								variant='outline'
								onClick={() => setIsEditing(true)}
								className='flex items-center gap-2'
							>
								<Edit3 className='w-4 h-4' />
								Edit Information
							</Button>
						)}
					</div>
				</CardHeader>
				<CardContent>
					<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
						{/* School Image Section */}
						<div className='flex flex-col items-center space-y-4'>
							<div className='relative'>
								<div
									className='cursor-pointer group'
									onClick={handleImageClick}
								>
									<Avatar className='w-32 h-32 transition-opacity group-hover:opacity-80'>
										<AvatarImage
											src={
												imagePreview ||
												schoolInfo?.school_image
											}
											alt={schoolInfo?.name || 'School'}
										/>
										<AvatarFallback className='text-2xl font-bold bg-primary/10'>
											{schoolInfo?.name?.charAt(0) || 'S'}
										</AvatarFallback>
									</Avatar>
									<div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-full'>
										<Camera className='w-6 h-6 text-white' />
									</div>
								</div>
								<input
									ref={fileInputRef}
									type='file'
									accept='image/*'
									onChange={handleImageSelect}
									className='hidden'
								/>
							</div>

							{/* Image action buttons */}
							{selectedImage && (
								<div className='flex gap-2'>
									<Button
										variant='outline'
										size='sm'
										onClick={handleImageCancel}
										disabled={isImageUploading}
									>
										<X className='w-4 h-4 mr-2' />
										Cancel
									</Button>
									<Button
										size='sm'
										onClick={handleImageSave}
										disabled={isImageUploading}
									>
										{isImageUploading ? (
											'Saving...'
										) : (
											<>
												<Save className='w-4 h-4 mr-2' />
												Save Image
											</>
										)}
									</Button>
								</div>
							)}

							<div className='text-center'>
								<p className='text-sm text-muted-foreground'>
									School Logo
								</p>
								<p className='text-xs text-muted-foreground mt-1'>
									Click the image to update
								</p>
							</div>
						</div>

						{/* School Information Form */}
						<div className='lg:col-span-2'>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className='space-y-6'
							>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
									<div className='space-y-2'>
										<Label htmlFor='name'>
											School Name
										</Label>
										<Input
											id='name'
											disabled={!isEditing}
											placeholder='Enter school name'
											{...form.register('name')}
										/>
										{form.formState.errors.name && (
											<p className='text-sm text-red-500'>
												{
													form.formState.errors.name
														.message
												}
											</p>
										)}
									</div>

									<div className='space-y-2'>
										<Label htmlFor='phone_number'>
											Phone Number
										</Label>
										<Input
											id='phone_number'
											disabled={!isEditing}
											placeholder='Enter phone number'
											{...form.register('phone_number')}
										/>
									</div>

									<div className='space-y-2'>
										<Label htmlFor='email'>
											Email Address
										</Label>
										<Input
											id='email'
											disabled={!isEditing}
											defaultValue={email}
											placeholder='Enter email address'
											{...form.register('email')}
										/>
										{form.formState.errors.email && (
											<p className='text-sm text-red-500'>
												{
													form.formState.errors.email
														.message
												}
											</p>
										)}
									</div>

									<div className='space-y-2 '>
										<Label htmlFor='motto'>Motto</Label>
										<Input
											id='motto'
											disabled={!isEditing}
											placeholder='Enter school motto'
											{...form.register('motto')}
										/>
									</div>

									<div className='space-y-2 md:col-span-2'>
										<Label htmlFor='address'>Address</Label>
										<Textarea
											id='address'
											disabled={!isEditing}
											placeholder='Enter school address'
											{...form.register('address')}
										/>
									</div>
								</div>

								{isEditing && (
									<div className='flex justify-end gap-4'>
										<Button
											variant='outline'
											type='button'
											onClick={handleCancel}
										>
											Cancel
										</Button>
										<Button
											type='submit'
											disabled={
												updateSchoolInfoMutation.isPending
											}
										>
											{updateSchoolInfoMutation.isPending
												? 'Saving...'
												: 'Save Changes'}
										</Button>
									</div>
								)}
							</form>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* School Details Summary */}
			{!isEditing && (
				<Card>
					<CardHeader>
						<CardTitle className='text-lg'>
							Quick Overview
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
							<div className='p-4 bg-muted/50 rounded-lg'>
								<Label className='text-sm font-medium text-muted-foreground'>
									School Name
								</Label>
								<p className='mt-1 font-medium'>
									{schoolInfo?.name || 'Not set'}
								</p>
							</div>
							<div className='p-4 bg-muted/50 rounded-lg'>
								<Label className='text-sm font-medium text-muted-foreground'>
									Phone
								</Label>
								<p className='mt-1 font-medium'>
									{schoolInfo?.phone_number || 'Not set'}
								</p>
							</div>
							<div className='p-4 bg-muted/50 rounded-lg'>
								<Label className='text-sm font-medium text-muted-foreground'>
									Email
								</Label>
								<p className='mt-1 font-medium'>
									{email || 'Not set'}
								</p>
							</div>
							<div className='p-4 bg-muted/50 rounded-lg md:col-span-2 lg:col-span-3'>
								<Label className='text-sm font-medium text-muted-foreground'>
									Address
								</Label>
								<p className='mt-1 font-medium'>
									{schoolInfo?.address || 'Not set'}
								</p>
							</div>
							{schoolInfo?.motto && (
								<div className='p-4 bg-muted/50 rounded-lg md:col-span-2 lg:col-span-3'>
									<Label className='text-sm font-medium text-muted-foreground'>
										School Motto
									</Label>
									<p className='mt-1 font-medium italic'>
										"{schoolInfo.motto}"
									</p>
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
};

export default SchoolInformationTab;
