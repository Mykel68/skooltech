'use client';

import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
	SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type ClassItem = {
	class_id: string;
	name: string;
	grade_level: string;
};

type TeacherItem = {
	user_id: string;
	first_name: string;
	last_name: string;
};

type Props = {
	mutateAsync: (data: {
		class_id: string;
		teacher_id: string;
	}) => Promise<void>;
	classes: ClassItem[];
	teachers: TeacherItem[];
};

export function CreateTeacherDialog({ mutateAsync, classes, teachers }: Props) {
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm<{ class_id: string; teacher_id: string }>();

	const onSubmit = async (data: { class_id: string; teacher_id: string }) => {
		try {
			await mutateAsync(data);
			toast.success('Class teacher assigned successfully');
			setOpen(false);
		} catch (err) {
			toast.error('Error assigning class teacher');
		}
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className='rounded-lg px-4 py-2 font-medium shadow'>
					Assign Class Teacher
				</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-xl'>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className='space-y-5'
				>
					<DialogHeader>
						<DialogTitle className='text-xl font-semibold'>
							Assign Class Teacher
						</DialogTitle>
					</DialogHeader>

					<div className='space-y-4'>
						{/* Class dropdown */}
						<div>
							<label className='block text-sm font-medium'>
								Select Class
							</label>
							<Select
								onValueChange={(val) =>
									setValue('class_id', val)
								}
								defaultValue=''
							>
								<SelectTrigger className='w-full'>
									<SelectValue placeholder='Choose a class' />
								</SelectTrigger>
								<SelectContent>
									{classes.map((cls) => (
										<SelectItem
											key={cls.class_id}
											value={cls.class_id}
										>
											{cls.name} - {cls.grade_level}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{errors.class_id && (
								<p className='text-sm text-red-500'>
									Class is required
								</p>
							)}
						</div>

						{/* Teacher dropdown */}
						<div>
							<label className='block text-sm font-medium'>
								Select Teacher
							</label>
							<Select
								onValueChange={(val) =>
									setValue('teacher_id', val)
								}
								defaultValue=''
							>
								<SelectTrigger className='w-full'>
									<SelectValue placeholder='Choose a teacher' />
								</SelectTrigger>
								<SelectContent>
									{teachers.map((teacher) => (
										<SelectItem
											key={teacher.user_id}
											value={teacher.user_id}
										>
											{teacher.first_name}{' '}
											{teacher.last_name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{errors.teacher_id && (
								<p className='text-sm text-red-500'>
									Teacher is required
								</p>
							)}
						</div>
					</div>

					<DialogFooter className='pt-4'>
						<Button
							type='button'
							variant='ghost'
							className='mr-2'
						>
							Cancel
						</Button>
						<Button
							type='submit'
							disabled={isSubmitting}
						>
							{isSubmitting ? 'Assigning...' : 'Assign'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
