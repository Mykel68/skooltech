'use client';

import { useState } from 'react';
import axios from 'axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useUserStore } from '@/stores/userStore';

import {
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableHead,
	TableCell,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, UserPen, UserPlus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { TeacherRow } from './TeacherRow';
import { DeleteTeacherDialog } from './dialogs/DeleteTeacherDialog';
import { CreateTeacherDialog } from './ClassTeacherDialog';

export type Teacher = {
	user_id: string;
	username: string;
	email: string;
	first_name: string;
	last_name: string;
	role: string;
	school_id: string;
	is_approved: boolean;
};

type ClassTeacher = {
	class_teacher_id: string;
	class_id: string;
	class: {
		name: string;
		grade_level: string;
	};
	teacher: {
		user_id: string;
		first_name: string;
		last_name: string;
	};
};

const fetchTeachers = async (schoolId: string): Promise<Teacher[]> => {
	const { data } = await axios.get(`/api/user/get-teachers/${schoolId}`);
	if (!data.success) throw new Error('Failed to fetch teachers');
	return data.data;
};

const fetchClassTeachers = async (
	schoolId: string,
	sessionId: string,
	termId: string
): Promise<ClassTeacher[]> => {
	const { data } = await axios.get(
		`/api/class-teacher/list/${schoolId}/${sessionId}/${termId}`
	);
	if (!data.success) throw new Error('Failed to fetch class teachers');
	return data.data.data;
};

export default function TeacherTable() {
	const queryClient = useQueryClient();
	const [deleteId, setDeleteId] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useState('all-teachers');

	const schoolId = useUserStore((s) => s.schoolId)!;
	const sessionId = useUserStore((s) => s.session_id);
	const termId = useUserStore((s) => s.term_id);

	const {
		data: teachers,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['teachers', schoolId],
		queryFn: () => fetchTeachers(schoolId),
		enabled: !!schoolId,
	});

	const { data: fetchedClasses } = useQuery({
		queryKey: ['classes', schoolId],
		queryFn: async () => {
			const { data } = await axios.get(
				`/api/class/get-all-classs/${schoolId}`
			);
			return data.data.classes;
		},
		enabled: !!schoolId,
	});

	const {
		data: classTeachers,
		isLoading: loadingClassTeachers,
		error: classTeachersError,
	} = useQuery({
		queryKey: ['class-teachers', schoolId, sessionId, termId],
		queryFn: () => fetchClassTeachers(schoolId, sessionId!, termId!),
		enabled: !!schoolId && !!sessionId && !!termId,
	});

	const toggleApproval = async (userId: string, approve: boolean) => {
		try {
			await axios.patch(`/api/user/verify-teacher/${userId}`, {
				is_approved: approve,
			});
			queryClient.invalidateQueries({ queryKey: ['teachers', schoolId] });
		} catch (err) {
			console.error('Error toggling approval', err);
		}
	};

	const deleteTeacher = async () => {
		if (!deleteId) return;
		try {
			await axios.delete(`/api/user/delete/${deleteId}`);
			setDeleteId(null);
			queryClient.invalidateQueries({ queryKey: ['teachers', schoolId] });
		} catch (err) {
			console.error('Error deleting teacher', err);
		}
	};

	if (isLoading)
		return <div className='p-4 text-muted-foreground'>Loading…</div>;
	if (error)
		return (
			<div className='p-4 text-destructive'>Error: {error.message}</div>
		);
	if (!teachers?.length)
		return (
			<div className='p-4 text-muted-foreground'>No teachers found.</div>
		);

	return (
		<div className='p-0.5 w-full max-w-7xl mx-auto space-y-4'>
			<div className='bg-white rounded-xl shadow-sm border border-slate-200 p-6'>
				<div className='flex items-center justify-between'>
					<div>
						<h1 className='text-3xl font-bold text-slate-900 flex items-center gap-3'>
							<Users className='w-8 h-8 text-blue-600' />
							Teacher Management
						</h1>
						<p className='text-slate-600 mt-1'>
							Manage and approve teachers registrations
						</p>
					</div>
					<button
						onClick={() => window.location.reload()}
						className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
					>
						<RefreshCw className='w-4 h-4' />
						Refresh
					</button>
				</div>
			</div>

			<Tabs
				value={activeTab}
				onValueChange={setActiveTab}
				className='w-full space-y-6'
			>
				<TabsList className='w-full grid grid-cols-2 gap-2 bg-muted p-1 rounded-lg shadow-sm'>
					<TabsTrigger
						value='all-teachers'
						className='flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-semibold transition-colors hover:bg-accent hover:text-accent-foreground data-[state=active]:bg-white data-[state=active]:text-foreground '
					>
						<UserPen className='w-4 h-4' />
						All Teachers
					</TabsTrigger>
					<TabsTrigger
						value='class-teachers'
						className='flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-semibold transition-colors hover:bg-accent hover:text-accent-foreground data-[state=active]:bg-white data-[state=active]:text-foreground '
					>
						<UserPlus className='w-4 h-4' />
						Class Teachers
					</TabsTrigger>
				</TabsList>

				<TabsContent value='all-teachers'>
					<Card className='rounded-2xl'>
						<CardHeader>
							<CardTitle className='flex items-center justify-betwee'>
								All Teachers
							</CardTitle>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Username</TableHead>
										<TableHead>Email</TableHead>
										<TableHead>First Name</TableHead>
										<TableHead>Last Name</TableHead>
										<TableHead>Role</TableHead>
										<TableHead className='text-center'>
											Approved
										</TableHead>
										<TableHead className='text-center'>
											Actions
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{teachers.map((teacher) => (
										<TeacherRow
											key={teacher.user_id}
											teacher={teacher}
											onToggleApproval={toggleApproval}
											onDeleteClick={setDeleteId}
										/>
									))}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Class Teachers Tab */}
				<TabsContent value='class-teachers'>
					<Card className='rounded-2xl'>
						<CardHeader>
							<CardTitle className='flex items-center justify-between'>
								Class Teachers
								<CreateTeacherDialog
									mutateAsync={async ({
										class_id,
										teacher_id,
									}) => {
										await axios.post(
											`/api/class-teacher/assign/${schoolId}/${sessionId}/${termId}`,
											{ class_id, teacher_id }
										);
										queryClient.invalidateQueries({
											queryKey: [
												'class-teachers',
												schoolId,
												sessionId,
												termId,
											],
										});
									}}
									classes={fetchedClasses || []}
									teachers={teachers}
								/>
							</CardTitle>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Class</TableHead>
										<TableHead>Grade Level</TableHead>
										<TableHead>Teacher</TableHead>
										<TableHead className='text-center'>
											Actions
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{loadingClassTeachers ? (
										<TableRow>
											<TableCell
												colSpan={4}
												className='text-center'
											>
												Loading…
											</TableCell>
										</TableRow>
									) : classTeachersError ? (
										<TableRow>
											<TableCell
												colSpan={4}
												className='text-destructive text-center'
											>
												Error:{' '}
												{classTeachersError.message}
											</TableCell>
										</TableRow>
									) : !classTeachers?.length ? (
										<TableRow>
											<TableCell
												colSpan={4}
												className='text-muted-foreground text-center'
											>
												No class teachers found.
											</TableCell>
										</TableRow>
									) : (
										classTeachers.map((ct) => (
											<TableRow key={ct.class_teacher_id}>
												<TableCell>
													{ct.class.name}
												</TableCell>
												<TableCell>
													{ct.class.grade_level}
												</TableCell>
												<TableCell>
													{ct.teacher.first_name}{' '}
													{ct.teacher.last_name}
												</TableCell>
												<TableCell className='text-center'>
													<Button
														variant='destructive'
														size='sm'
														onClick={async () => {
															await axios.delete(
																`/api/class-teacher/delete/${ct.class_teacher_id}`
															);
															queryClient.invalidateQueries(
																{
																	queryKey: [
																		'class-teachers',
																		schoolId,
																		sessionId,
																		termId,
																	],
																}
															);
														}}
													>
														Remove
													</Button>
												</TableCell>
											</TableRow>
										))
									)}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>

			<DeleteTeacherDialog
				open={!!deleteId}
				onClose={() => setDeleteId(null)}
				onConfirm={deleteTeacher}
			/>
		</div>
	);
}
