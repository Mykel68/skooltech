'use client';

import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

type Props = {
	open: boolean;
	setOpen: (open: boolean) => void;
	mutateAsync: (data: {
		name: string;
		short: string;
		grade_level: string;
	}) => Promise<void>;
};

export function CreateClassDialog({ open, setOpen, mutateAsync }: Props) {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm();

	const onSubmit = async (data: any) => {
		try {
			await mutateAsync(data);
			toast.success('Class created successfully');
			reset();
			setOpen(false);
		} catch (err) {
			toast.error('Error creating class');
		}
	};

	return (
		<Dialog
			open={open}
			onOpenChange={setOpen}
		>
			<DialogTrigger asChild>
				<Button className='rounded-lg px-4 py-2 font-medium shadow'>
					<Button className='lg:w-auto w-full'>
						<Plus className='w-4 h-4 mr-2' />
						Add New Class
					</Button>
				</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-md'>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className='space-y-5'
				>
					<DialogHeader>
						<DialogTitle className='text-xl font-semibold'>
							Create a New Class
						</DialogTitle>
					</DialogHeader>

					<div className='space-y-1'>
						<Input
							placeholder='Class Name'
							{...register('name', { required: true })}
						/>
						{errors.name && (
							<p className='text-sm text-red-500'>
								Name is required
							</p>
						)}
					</div>

					<div className='space-y-1'>
						<Input
							placeholder='Grade Level (e.g. JSS2A)'
							{...register('grade_level', { required: true })}
						/>
						{errors.grade_level && (
							<p className='text-sm text-red-500'>
								Grade level is required
							</p>
						)}
					</div>

					<div className='space-y-1'>
						<Input
							placeholder='Short Name'
							{...register('short', { required: true })}
						/>
						{errors.short && (
							<p className='text-sm text-red-500'>
								Short name is required
							</p>
						)}
					</div>

					<DialogFooter className='pt-2'>
						<Button
							type='button'
							variant='ghost'
							onClick={() => setOpen(false)}
							className='mr-2'
						>
							Cancel
						</Button>
						<Button
							type='submit'
							disabled={isSubmitting}
						>
							{isSubmitting ? 'Creating...' : 'Create'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
