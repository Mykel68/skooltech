'use client';

import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserStore } from '@/stores/userStore';
import { SubjectTableRow } from './SubjectTableRow';
import { SubjectFormDialog } from './SubjectFormDialog';
import { useSubjects } from './useSubjects';

export default function SubjectTable() {
	const schoolId = useUserStore((s) => s.schoolId)!;
	const sessionId = useUserStore((s) => s.session_id)!;
	const termId = useUserStore((s) => s.term_id)!;
	const { classes, subjects, loadingSubjects, approve, disapprove, remove } =
		useSubjects(schoolId, sessionId, termId);

	return (
		<div className='p-0.5 w-full mx-auto'>
			<Card className=' rounded-2xl pt-3'>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-4'>
					<CardTitle className='text-xl font-bold'>
						Subjects
					</CardTitle>
					<SubjectFormDialog
						schoolId={schoolId}
						classes={classes}
					/>
				</CardHeader>
				<CardContent>
					{loadingSubjects ? (
						<p className='text-muted-foreground'>
							Loading subjects...
						</p>
					) : subjects.length > 0 ? (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Class</TableHead>
									<TableHead>Grade Level</TableHead>
									<TableHead>Subject</TableHead>
									<TableHead>Teacher</TableHead>
									<TableHead>Email</TableHead>
									<TableHead>Status</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{subjects.map((subject) => (
									<SubjectTableRow
										key={subject.subject_id}
										subject={subject}
										onApprove={() =>
											approve.mutate(subject.subject_id)
										}
										onDisapprove={() =>
											disapprove.mutate(
												subject.subject_id
											)
										}
										onDelete={() =>
											remove.mutate(subject.subject_id)
										}
									/>
								))}
							</TableBody>
						</Table>
					) : (
						<p className='text-muted-foreground'>
							No subjects found.
						</p>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
