'use client';

import { useState } from 'react';
import axios from 'axios';
import { useUserStore } from '@/stores/userStore';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableHead,
	TableCell,
} from '@/components/ui/table';
import { TeacherRow } from './TeacherRow';
import { DeleteTeacherDialog } from './dialogs/DeleteTeacherDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

async function fetchTeachers(schoolId: string): Promise<Teacher[]> {
	const { data } = await axios.get<{ success: boolean; data: Teacher[] }>(
		`/api/user/get-teachers/${schoolId}`
	);
	if (!data.success) throw new Error('API returned success=false');
	return data.data;
}

export default function TeacherTable() {
	const schoolId = useUserStore((s) => s.schoolId)!;
	const sessionId = useUserStore((s) => s.session_id);
	const termId = useUserStore((s) => s.term_id);
	const queryClient = useQueryClient();
	const [deleteId, setDeleteId] = useState<string | null>(null);

	const {
		data: teachers,
		isLoading,
		error,
	} = useQuery<Teacher[], Error>({
		queryKey: ['teachers', schoolId],
		queryFn: () => fetchTeachers(schoolId),
		enabled: !!schoolId,
	});

	const { data: fetchedClasses } = useQuery<any[], Error>({
		queryKey: ['classes', schoolId],
		queryFn: async () => {
			const { data } = await axios.get(
				`/api/class/get-all-classs/${schoolId}`
			);
			return data.data.classes;
		},
		enabled: !!schoolId,
	});

	const toggleApproval = async (userId: string, approve: boolean) => {
		await axios.patch(`/api/user/verify-teacher/${userId}`, {
			is_approved: approve,
		});
		queryClient.invalidateQueries({ queryKey: ['teachers', schoolId] });
	};

	const deleteTeacher = async () => {
		if (!deleteId) return;
		await axios.delete(`/api/user/delete/${deleteId}`);
		setDeleteId(null);
		queryClient.invalidateQueries({ queryKey: ['teachers', schoolId] });
	};

	if (isLoading)
		return <div className='p-4 text-muted-foreground'>Loading…</div>;
	if (error)
		return (
			<div className='p-4 text-destructive'>Error: {error.message}</div>
		);
	if (!teachers || teachers.length === 0)
		return (
			<div className='p-4 text-muted-foreground'>No teachers found.</div>
		);

	return (
		<div className='p-0.5 w-full max-w-7xl mx-auto'>
			<p>Teachers</p>
			<Tabs
				// value={activeTab}
				// onValueChange={setActiveTab}
				className='w-full space-y-6'
			>
				<TabsList className='w-full grid grid-cols-2 gap-2 bg-muted p-1 rounded-lg shadow-sm'>
					<TabsTrigger
						value='all-teachers'
						className='flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-semibold transition-colors hover:bg-accent hover:text-accent-foreground data-[state=active]:bg-white data-[state=active]:text-foreground '
					>
						<FileText className='w-4 h-4' />
						All Teachers
					</TabsTrigger>
					<TabsTrigger
						value='class-teachers'
						className='flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-semibold transition-colors hover:bg-accent hover:text-accent-foreground data-[state=active]:bg-white data-[state=active]:text-foreground '
					>
						<Settings className='w-4 h-4' />
						Class Teacher
					</TabsTrigger>
				</TabsList>

				<TabsContent value='all-teachers'>
					<Card className='rounded-2xl'>
						<CardHeader className='pb-4'>
							<CardTitle className='text-xl font-bold'>
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
				<TabsContent value='class-teachers'>
					<Card className='rounded-2xl'>
						<CardHeader className='pb-4'>
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
											],
										});
									}}
									classes={fetchedClasses || []}
									teachers={teachers || []}
								/>
							</CardTitle>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Class</TableHead>
										<TableHead>Grade level</TableHead>
										<TableHead>Teacher Name</TableHead>
										<TableHead className='text-center'>
											Actions
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{/* {teachers.map((teacher) => (
										<TeacherRow
											key={teacher.user_id}
											teacher={teacher}
											onToggleApproval={toggleApproval}
											onDeleteClick={setDeleteId}
										/>
									))} */}
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
