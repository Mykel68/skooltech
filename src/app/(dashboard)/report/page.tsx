'use client';

import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
	Plus,
	Trash2,
	Download,
	Settings,
	FileText,
	Eye,
	Edit,
	Printer,
} from 'lucide-react';
import { api } from '@/lib/api';
import NigerianReportCard from './ReportCard';
import { useUserStore } from '@/stores/userStore';
import axios from 'axios';
import SchoolInformationTab from './SchoolTab';

const ExamReportBuilder = () => {
	const [activeTab, setActiveTab] = useState('reports');
	const [selectedStudent, setSelectedStudent] = useState(null);
	const [showReportCard, setShowReportCard] = useState(false);
	const schoolName = useUserStore((s) => s.schoolName);
	const email = useUserStore((s) => s.email);
	const schoolId = useUserStore((s) => s.schoolId);

	const queryClient = useQueryClient();

	// Queries
	const { data: schoolInfo = {}, isLoading: schoolLoading } = useQuery({
		queryKey: ['schoolInfo'],
		queryFn: async () => {
			const response = await axios.get(
				`/api/school/get-profile/${schoolId}`
			);
			return response.data.data;
		},
		enabled: !!schoolId,
	});
	const { data: students = [], isLoading: studentsLoading } = useQuery({
		queryKey: ['students'],
		queryFn: api.getStudents,
	});

	// Mutations
	const generateReportMutation = useMutation({
		mutationFn: api.generateReport,
		onSuccess: () => {
			setShowReportCard(true);
		},
	});

	const handleViewReport = (student) => {
		setSelectedStudent(student);
		generateReportMutation.mutate(student.id);
	};

	return (
		<div className='p-6 max-w-7xl mx-auto'>
			<div className='mb-6'>
				<h1 className='text-3xl font-bold text-gray-900'>
					Report System
				</h1>
				<p className='text-gray-600 mt-2'>Generate report cards</p>
			</div>

			<Tabs
				value={activeTab}
				onValueChange={setActiveTab}
				className='w-full'
			>
				<TabsList className='grid w-full grid-cols-2'>
					<TabsTrigger
						value='reports'
						className='flex items-center gap-2'
					>
						<FileText className='w-4 h-4' />
						Student Reports
					</TabsTrigger>
					<TabsTrigger
						value='admin'
						className='flex items-center gap-2'
					>
						<Settings className='w-4 h-4' />
						School Settings
					</TabsTrigger>
				</TabsList>

				<TabsContent
					value='reports'
					className='space-y-6'
				>
					<div className='flex justify-between items-center'>
						<h2 className='text-2xl font-semibold'>
							Student Report Cards
						</h2>
						<Badge
							variant='outline'
							className='text-sm'
						>
							{!schoolLoading && schoolInfo.name}
						</Badge>
					</div>

					<div className='grid gap-4'>
						{studentsLoading ? (
							<div className='text-center py-8'>
								Loading students...
							</div>
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
															{
																student.admissionNumber
															}{' '}
															| {student.session}{' '}
															- {student.term}
														</p>
													</div>
													<div className='flex gap-2'>
														<Badge variant='outline'>
															Position:{' '}
															{student.position}
															{student.position ===
															1
																? 'st'
																: student.position ===
																  2
																? 'nd'
																: student.position ===
																  3
																? 'rd'
																: 'th'}
														</Badge>
														<Badge
															variant={
																student.average >=
																80
																	? 'default'
																	: student.average >=
																	  65
																	? 'secondary'
																	: 'destructive'
															}
														>
															Average:{' '}
															{student.average.toFixed(
																1
															)}
															%
														</Badge>
													</div>
												</div>

												<div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3'>
													{student.subjects
														.slice(0, 5)
														.map(
															(
																subject,
																index
															) => (
																<div
																	key={index}
																	className='bg-gray-50 p-3 rounded-lg'
																>
																	<h4 className='font-medium text-xs'>
																		{
																			subject.name
																		}
																	</h4>
																	<div className='flex items-center justify-between mt-1'>
																		<span className='text-lg font-bold'>
																			{
																				subject.total
																			}
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
																			{
																				subject.grade
																			}
																		</Badge>
																	</div>
																</div>
															)
														)}
													{student.subjects.length >
														5 && (
														<div className='bg-gray-100 p-3 rounded-lg flex items-center justify-center'>
															<span className='text-sm text-gray-600'>
																+
																{student
																	.subjects
																	.length -
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
														handleViewReport(
															student
														)
													}
													disabled={
														generateReportMutation.isPending
													}
													className='flex items-center gap-2'
												>
													<Eye className='w-4 h-4' />
													{generateReportMutation.isPending
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
				</TabsContent>

				<TabsContent
					value='admin'
					className='space-y-6'
				>
					<SchoolInformationTab
						schoolInfo={schoolInfo}
						schoolId={schoolId}
						email={email}
					/>
				</TabsContent>
			</Tabs>

			{/* Report Card Modal */}
			{showReportCard && selectedStudent && (
				<NigerianReportCard
					student={selectedStudent}
					schoolInfo={schoolInfo}
					onClose={() => {
						setShowReportCard(false);
						setSelectedStudent(null);
					}}
				/>
			)}
		</div>
	);
};

export default ExamReportBuilder;
