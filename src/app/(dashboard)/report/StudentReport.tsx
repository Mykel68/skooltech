'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Download } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useUserStore } from '@/stores/userStore';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

// --- Types
type Subject = {
	name: string;
	total: number;
	grade: string;
};

type Student = {
	id: string;
	name: string;
	class: string;
	session: string;
	term: string;
	position: number;
	average: number;
	admissionNumber: string;
	subjects: Subject[];
};

type SchoolInfo = {
	id: string;
	name: string;
	// Add more fields as needed
};

type SchoolClass = {
	id: string;
	name: string;
	grade_level: string;
};

type StudentReportsProps = {
	students: Student[];
	studentsLoading: boolean;
	schoolInfo: SchoolInfo | null;
	schoolLoading: boolean;
	handleViewReport: (student: Student) => void;
	generateReportPending: boolean;
	selectedClassId: string | null;
	setSelectedClassId: (id: string) => void;
	classes: SchoolClass[];
	classesLoading: boolean;
};

// --- Fetch Function
async function fetchClasses(schoolId: string): Promise<SchoolClass[]> {
	const { data } = await axios.get(`/api/classq/get-all-classs/${schoolId}`);
	return data.data.classes;
}

// --- Component
const StudentReports: React.FC<StudentReportsProps> = ({
	students,
	studentsLoading,
	schoolInfo,
	schoolLoading,
	handleViewReport,
	generateReportPending,
	selectedClassId,
	setSelectedClassId,
	classes,
	classesLoading,
}) => {
	return (
		<div className='grid gap-4'>
			{/* Class Selector */}
			<div className='bg-muted p-4 rounded-lg'>
				{classesLoading ? (
					<p>Loading classes...</p>
				) : (
					<Select
						value={selectedClassId ?? ''}
						onValueChange={setSelectedClassId}
					>
						<SelectTrigger className='w-full md:w-[300px]'>
							<SelectValue placeholder='Select a class' />
						</SelectTrigger>
						<SelectContent>
							{classes.map((cls) => (
								<SelectItem
									key={cls.class_id}
									value={cls.class_id}
								>
									{cls.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				)}
			</div>

			{/* Students List */}
			{studentsLoading ? (
				<div className='text-center py-8'>Loading students...</div>
			) : (
				students.map((student) => (
					<Card key={student.id}>
						<CardContent className='p-6'>
							<div className='flex justify-between items-start'>
								<div className='flex-1'>
									<div className='flex items-center gap-4 mb-4'>
										<div>
											<h3 className='text-lg font-semibold'>
												{student.name}
											</h3>
											<p className='text-gray-600'>
												{student.class} |{' '}
												{student.admissionNumber} |{' '}
												{student.session} -{' '}
												{student.term}
											</p>
										</div>
										<div className='flex gap-2'>
											<Badge variant='outline'>
												Position: {student.position}
												{student.position === 1
													? 'st'
													: student.position === 2
													? 'nd'
													: student.position === 3
													? 'rd'
													: 'th'}
											</Badge>
											<Badge
												variant={
													student.average >= 80
														? 'default'
														: student.average >= 65
														? 'secondary'
														: 'destructive'
												}
											>
												Average:{' '}
												{student.average.toFixed(1)}%
											</Badge>
										</div>
									</div>

									<div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3'>
										{student.subjects
											.slice(0, 5)
											.map((subject, i) => (
												<div
													key={i}
													className='bg-gray-50 p-3 rounded-lg'
												>
													<h4 className='font-medium text-xs'>
														{subject.name}
													</h4>
													<div className='flex items-center justify-between mt-1'>
														<span className='text-lg font-bold'>
															{subject.total}
														</span>
														<Badge
															variant='outline'
															className={`text-xs ${
																subject.grade ===
																'A1'
																	? 'text-green-700'
																	: subject.grade.startsWith(
																			'B'
																	  )
																	? 'text-blue-700'
																	: 'text-orange-700'
															}`}
														>
															{subject.grade}
														</Badge>
													</div>
												</div>
											))}
										{student.subjects.length > 5 && (
											<div className='bg-gray-100 p-3 rounded-lg flex items-center justify-center'>
												<span className='text-sm text-gray-600'>
													+
													{student.subjects.length -
														5}{' '}
													more
												</span>
											</div>
										)}
									</div>
								</div>

								<div className='ml-6 flex flex-col gap-2'>
									<Button
										onClick={() =>
											handleViewReport(student)
										}
										disabled={generateReportPending}
										className='flex items-center gap-2'
									>
										<Eye className='w-4 h-4' />
										{generateReportPending
											? 'Loading...'
											: 'View Report'}
									</Button>
									<Button
										variant='outline'
										size='sm'
									>
										<Download className='w-4 h-4' />
										Download PDF
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				))
			)}
		</div>
	);
};

export default StudentReports;
