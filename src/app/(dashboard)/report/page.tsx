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

// Mock API with Nigerian school data structure
const api = {
	getSchoolInfo: () =>
		Promise.resolve({
			name: 'CHRIST THE KING COLLEGE',
			address: '12 Education Avenue, Ikeja, Lagos State',
			phone: '08012345678',
			email: 'info@ckcollege.edu.ng',
			motto: 'Knowledge is Power',
			logo: '/school-logo.png',
		}),

	getStudents: () =>
		Promise.resolve([
			{
				id: 1,
				admissionNumber: 'CKC/2023/001',
				name: 'ADEBAYO OLUMIDE SAMUEL',
				class: 'SS 2A',
				term: 'FIRST TERM',
				session: '2024/2025',
				age: 16,
				sex: 'MALE',
				height: '5ft 6in',
				weight: '65kg',
				dateOfBirth: '15th March, 2008',
				totalInClass: 45,
				position: 3,
				attendance: {
					present: 92,
					absent: 8,
					total: 100,
				},
				nextTermBegins: '8th January, 2025',
				subjects: [
					{
						name: 'MATHEMATICS',
						ca1: 18,
						ca2: 20,
						exam: 55,
						total: 93,
						grade: 'A1',
						remark: 'EXCELLENT',
						position: 2,
					},
					{
						name: 'ENGLISH LANGUAGE',
						ca1: 15,
						ca2: 18,
						exam: 48,
						total: 81,
						grade: 'B2',
						remark: 'VERY GOOD',
						position: 5,
					},
					{
						name: 'PHYSICS',
						ca1: 17,
						ca2: 19,
						exam: 52,
						total: 88,
						grade: 'A1',
						remark: 'EXCELLENT',
						position: 1,
					},
					{
						name: 'CHEMISTRY',
						ca1: 16,
						ca2: 17,
						exam: 47,
						total: 80,
						grade: 'B2',
						remark: 'VERY GOOD',
						position: 8,
					},
					{
						name: 'BIOLOGY',
						ca1: 19,
						ca2: 18,
						exam: 50,
						total: 87,
						grade: 'A1',
						remark: 'EXCELLENT',
						position: 3,
					},
					{
						name: 'FURTHER MATHEMATICS',
						ca1: 14,
						ca2: 16,
						exam: 45,
						total: 75,
						grade: 'B3',
						remark: 'GOOD',
						position: 12,
					},
					{
						name: 'GEOGRAPHY',
						ca1: 17,
						ca2: 19,
						exam: 49,
						total: 85,
						grade: 'A1',
						remark: 'EXCELLENT',
						position: 4,
					},
					{
						name: 'ECONOMICS',
						ca1: 15,
						ca2: 17,
						exam: 46,
						total: 78,
						grade: 'B2',
						remark: 'VERY GOOD',
						position: 7,
					},
					{
						name: 'GOVERNMENT',
						ca1: 18,
						ca2: 17,
						exam: 48,
						total: 83,
						grade: 'B2',
						remark: 'VERY GOOD',
						position: 6,
					},
				],
				totalScore: 750,
				average: 83.33,
				classTeacherComment:
					'Olumide is a brilliant and dedicated student. He shows excellent understanding in Science subjects. Keep up the good work!',
				principalComment:
					'An outstanding performance. Continue to maintain this excellent standard.',
				promotionStatus: 'PROMOTED TO SS 3',
			},
			{
				id: 2,
				admissionNumber: 'CKC/2023/089',
				name: 'OGBONNA CHIOMA BLESSING',
				class: 'SS 2A',
				term: 'FIRST TERM',
				session: '2024/2025',
				age: 15,
				sex: 'FEMALE',
				height: '5ft 3in',
				weight: '55kg',
				dateOfBirth: '22nd July, 2009',
				totalInClass: 45,
				position: 1,
				attendance: {
					present: 98,
					absent: 2,
					total: 100,
				},
				nextTermBegins: '8th January, 2025',
				subjects: [
					{
						name: 'MATHEMATICS',
						ca1: 20,
						ca2: 19,
						exam: 58,
						total: 97,
						grade: 'A1',
						remark: 'EXCELLENT',
						position: 1,
					},
					{
						name: 'ENGLISH LANGUAGE',
						ca1: 18,
						ca2: 19,
						exam: 55,
						total: 92,
						grade: 'A1',
						remark: 'EXCELLENT',
						position: 1,
					},
					{
						name: 'PHYSICS',
						ca1: 19,
						ca2: 18,
						exam: 54,
						total: 91,
						grade: 'A1',
						remark: 'EXCELLENT',
						position: 2,
					},
					{
						name: 'CHEMISTRY',
						ca1: 17,
						ca2: 18,
						exam: 53,
						total: 88,
						grade: 'A1',
						remark: 'EXCELLENT',
						position: 3,
					},
					{
						name: 'BIOLOGY',
						ca1: 20,
						ca2: 19,
						exam: 56,
						total: 95,
						grade: 'A1',
						remark: 'EXCELLENT',
						position: 1,
					},
					{
						name: 'FURTHER MATHEMATICS',
						ca1: 16,
						ca2: 17,
						exam: 49,
						total: 82,
						grade: 'B2',
						remark: 'VERY GOOD',
						position: 5,
					},
					{
						name: 'GEOGRAPHY',
						ca1: 18,
						ca2: 20,
						exam: 52,
						total: 90,
						grade: 'A1',
						remark: 'EXCELLENT',
						position: 2,
					},
					{
						name: 'ECONOMICS',
						ca1: 17,
						ca2: 18,
						exam: 50,
						total: 85,
						grade: 'A1',
						remark: 'EXCELLENT',
						position: 3,
					},
					{
						name: 'GOVERNMENT',
						ca1: 19,
						ca2: 18,
						exam: 53,
						total: 90,
						grade: 'A1',
						remark: 'EXCELLENT',
						position: 1,
					},
				],
				totalScore: 810,
				average: 90.0,
				classTeacherComment:
					'Chioma is an exceptional student with outstanding performance across all subjects. She is a role model to her peers.',
				principalComment:
					'Excellent performance! Keep up the outstanding work. You are destined for greatness.',
				promotionStatus: 'PROMOTED TO SS 3',
			},
		]),

	generateReport: (studentId) => Promise.resolve({ success: true }),
};

// Nigerian School Report Card Component
const NigerianReportCard = ({ student, schoolInfo, onClose }) => {
	const reportRef = useRef();

	const handlePrint = () => {
		window.print();
	};

	const getGradeColor = (grade) => {
		if (grade === 'A1') return 'text-green-700';
		if (grade === 'B2' || grade === 'B3') return 'text-blue-700';
		if (grade === 'C4' || grade === 'C5' || grade === 'C6')
			return 'text-yellow-700';
		return 'text-red-700';
	};

	const getPositionSuffix = (position) => {
		if (position === 1) return 'st';
		if (position === 2) return 'nd';
		if (position === 3) return 'rd';
		return 'th';
	};

	return (
		<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
			<div className='bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto'>
				<div className='p-4 border-b flex justify-between items-center print:hidden'>
					<h3 className='text-lg font-semibold'>
						Student Report Card
					</h3>
					<div className='flex gap-2'>
						<Button
							onClick={handlePrint}
							size='sm'
						>
							<Printer className='w-4 h-4 mr-2' />
							Print
						</Button>
						<Button
							onClick={onClose}
							variant='outline'
							size='sm'
						>
							Close
						</Button>
					</div>
				</div>

				<div
					ref={reportRef}
					className='p-8 bg-white print:p-4'
				>
					{/* School Header */}
					<div className='text-center border-b-2 border-black pb-4 mb-6'>
						<div className='flex items-center justify-center gap-4 mb-2'>
							<div className='w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center'>
								<span className='text-xs'>LOGO</span>
							</div>
							<div>
								<h1 className='text-2xl font-bold text-blue-900'>
									{schoolInfo.name}
								</h1>
								<p className='text-sm'>{schoolInfo.address}</p>
								<p className='text-sm'>
									Tel: {schoolInfo.phone} | Email:{' '}
									{schoolInfo.email}
								</p>
								<p className='text-sm italic'>
									"{schoolInfo.motto}"
								</p>
							</div>
							<div className='w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center'>
								<span className='text-xs'>COAT OF ARMS</span>
							</div>
						</div>
						<h2 className='text-xl font-bold mt-2'>
							STUDENT'S TERMINAL REPORT CARD
						</h2>
					</div>

					{/* Student Information */}
					<div className='grid grid-cols-2 gap-8 mb-6'>
						<div className='space-y-2'>
							<div className='flex'>
								<span className='font-semibold w-32'>
									NAME:
								</span>
								<span className='border-b border-black flex-1 px-2'>
									{student.name}
								</span>
							</div>
							<div className='flex'>
								<span className='font-semibold w-32'>
									CLASS:
								</span>
								<span className='border-b border-black flex-1 px-2'>
									{student.class}
								</span>
							</div>
							<div className='flex'>
								<span className='font-semibold w-32'>
									TERM:
								</span>
								<span className='border-b border-black flex-1 px-2'>
									{student.term}
								</span>
							</div>
							<div className='flex'>
								<span className='font-semibold w-32'>
									SESSION:
								</span>
								<span className='border-b border-black flex-1 px-2'>
									{student.session}
								</span>
							</div>
							<div className='flex'>
								<span className='font-semibold w-32'>AGE:</span>
								<span className='border-b border-black flex-1 px-2'>
									{student.age} years
								</span>
							</div>
						</div>
						<div className='space-y-2'>
							<div className='flex'>
								<span className='font-semibold w-32'>
									ADM. NO:
								</span>
								<span className='border-b border-black flex-1 px-2'>
									{student.admissionNumber}
								</span>
							</div>
							<div className='flex'>
								<span className='font-semibold w-32'>SEX:</span>
								<span className='border-b border-black flex-1 px-2'>
									{student.sex}
								</span>
							</div>
							<div className='flex'>
								<span className='font-semibold w-32'>
									HEIGHT:
								</span>
								<span className='border-b border-black flex-1 px-2'>
									{student.height}
								</span>
							</div>
							<div className='flex'>
								<span className='font-semibold w-32'>
									WEIGHT:
								</span>
								<span className='border-b border-black flex-1 px-2'>
									{student.weight}
								</span>
							</div>
							<div className='flex'>
								<span className='font-semibold w-32'>
									D.O.B:
								</span>
								<span className='border-b border-black flex-1 px-2'>
									{student.dateOfBirth}
								</span>
							</div>
						</div>
					</div>

					{/* Academic Performance Table */}
					<div className='mb-6'>
						<table className='w-full border-2 border-black text-sm'>
							<thead>
								<tr className='bg-gray-100'>
									<th className='border border-black p-2 text-left'>
										SUBJECTS
									</th>
									<th className='border border-black p-2'>
										1ST C.A
										<br />
										(20)
									</th>
									<th className='border border-black p-2'>
										2ND C.A
										<br />
										(20)
									</th>
									<th className='border border-black p-2'>
										EXAM
										<br />
										(60)
									</th>
									<th className='border border-black p-2'>
										TOTAL
										<br />
										(100)
									</th>
									<th className='border border-black p-2'>
										GRADE
									</th>
									<th className='border border-black p-2'>
										REMARK
									</th>
									<th className='border border-black p-2'>
										POSITION
									</th>
								</tr>
							</thead>
							<tbody>
								{student.subjects.map((subject, index) => (
									<tr key={index}>
										<td className='border border-black p-2 font-medium'>
											{subject.name}
										</td>
										<td className='border border-black p-2 text-center'>
											{subject.ca1}
										</td>
										<td className='border border-black p-2 text-center'>
											{subject.ca2}
										</td>
										<td className='border border-black p-2 text-center'>
											{subject.exam}
										</td>
										<td className='border border-black p-2 text-center font-bold'>
											{subject.total}
										</td>
										<td
											className={`border border-black p-2 text-center font-bold ${getGradeColor(
												subject.grade
											)}`}
										>
											{subject.grade}
										</td>
										<td className='border border-black p-2 text-center'>
											{subject.remark}
										</td>
										<td className='border border-black p-2 text-center'>
											{subject.position}
											{getPositionSuffix(
												subject.position
											)}
										</td>
									</tr>
								))}
								<tr className='bg-gray-100 font-bold'>
									<td className='border border-black p-2'>
										TOTAL
									</td>
									<td
										className='border border-black p-2 text-center'
										colSpan='3'
									></td>
									<td className='border border-black p-2 text-center'>
										{student.totalScore}
									</td>
									<td
										className='border border-black p-2 text-center'
										colSpan='3'
									>
										AVERAGE: {student.average.toFixed(2)}%
									</td>
								</tr>
							</tbody>
						</table>
					</div>

					{/* Grading System and Class Information */}
					<div className='grid grid-cols-2 gap-8 mb-6'>
						<div>
							<h3 className='font-bold mb-2 border-b border-black'>
								GRADING SYSTEM
							</h3>
							<div className='text-sm space-y-1'>
								<div className='flex justify-between'>
									<span>90-100: A1 (EXCELLENT)</span>
									<span>80-89: A1 (EXCELLENT)</span>
								</div>
								<div className='flex justify-between'>
									<span>70-79: B2 (VERY GOOD)</span>
									<span>65-69: B3 (GOOD)</span>
								</div>
								<div className='flex justify-between'>
									<span>60-64: C4 (CREDIT)</span>
									<span>55-59: C5 (CREDIT)</span>
								</div>
								<div className='flex justify-between'>
									<span>50-54: C6 (CREDIT)</span>
									<span>45-49: D7 (PASS)</span>
								</div>
								<div className='flex justify-between'>
									<span>40-44: E8 (PASS)</span>
									<span>0-39: F9 (FAIL)</span>
								</div>
							</div>
						</div>
						<div>
							<h3 className='font-bold mb-2 border-b border-black'>
								CLASS INFORMATION
							</h3>
							<div className='text-sm space-y-2'>
								<div className='flex'>
									<span className='font-semibold w-40'>
										Position in Class:
									</span>
									<span>
										{student.position}
										{getPositionSuffix(
											student.position
										)}{' '}
										out of {student.totalInClass}
									</span>
								</div>
								<div className='flex'>
									<span className='font-semibold w-40'>
										Class Average:
									</span>
									<span>75.50%</span>
								</div>
								<div className='flex'>
									<span className='font-semibold w-40'>
										Times Present:
									</span>
									<span>{student.attendance.present}</span>
								</div>
								<div className='flex'>
									<span className='font-semibold w-40'>
										Times Absent:
									</span>
									<span>{student.attendance.absent}</span>
								</div>
								<div className='flex'>
									<span className='font-semibold w-40'>
										Next Term Begins:
									</span>
									<span>{student.nextTermBegins}</span>
								</div>
							</div>
						</div>
					</div>

					{/* Comments and Signatures */}
					<div className='space-y-4'>
						<div>
							<h3 className='font-bold mb-2'>
								CLASS TEACHER'S COMMENT:
							</h3>
							<div className='border border-black p-3 min-h-[60px]'>
								{student.classTeacherComment}
							</div>
						</div>

						<div>
							<h3 className='font-bold mb-2'>
								PRINCIPAL'S COMMENT:
							</h3>
							<div className='border border-black p-3 min-h-[60px]'>
								{student.principalComment}
							</div>
						</div>

						<div className='grid grid-cols-2 gap-8 mt-6'>
							<div>
								<div className='flex justify-between items-end'>
									<span className='font-semibold'>
										CLASS TEACHER'S SIGNATURE:
									</span>
									<div className='border-b border-black w-32'></div>
								</div>
							</div>
							<div>
								<div className='flex justify-between items-end'>
									<span className='font-semibold'>
										PRINCIPAL'S SIGNATURE:
									</span>
									<div className='border-b border-black w-32'></div>
								</div>
							</div>
						</div>

						<div className='text-center mt-6 p-2 bg-gray-100'>
							<span className='font-bold'>
								PROMOTION STATUS: {student.promotionStatus}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const ExamReportBuilder = () => {
	const [activeTab, setActiveTab] = useState('reports');
	const [selectedStudent, setSelectedStudent] = useState(null);
	const [showReportCard, setShowReportCard] = useState(false);

	const queryClient = useQueryClient();

	// Queries
	const { data: schoolInfo = {}, isLoading: schoolLoading } = useQuery({
		queryKey: ['schoolInfo'],
		queryFn: api.getSchoolInfo,
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
					Nigerian School Report System
				</h1>
				<p className='text-gray-600 mt-2'>
					Generate and view traditional Nigerian school report cards
				</p>
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
					<Card>
						<CardHeader>
							<CardTitle>School Information</CardTitle>
							<CardDescription>
								Configure school details for report cards
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<div>
									<Label htmlFor='schoolName'>
										School Name
									</Label>
									<Input
										id='schoolName'
										value={schoolInfo.name || ''}
									/>
								</div>
								<div>
									<Label htmlFor='schoolAddress'>
										School Address
									</Label>
									<Input
										id='schoolAddress'
										value={schoolInfo.address || ''}
									/>
								</div>
								<div>
									<Label htmlFor='schoolPhone'>
										Phone Number
									</Label>
									<Input
										id='schoolPhone'
										value={schoolInfo.phone || ''}
									/>
								</div>
								<div>
									<Label htmlFor='schoolEmail'>
										Email Address
									</Label>
									<Input
										id='schoolEmail'
										value={schoolInfo.email || ''}
									/>
								</div>
								<div className='md:col-span-2'>
									<Label htmlFor='schoolMotto'>
										School Motto
									</Label>
									<Input
										id='schoolMotto'
										value={schoolInfo.motto || ''}
									/>
								</div>
							</div>
							<Button>Save School Information</Button>
						</CardContent>
					</Card>
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
