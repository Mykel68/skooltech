'use client';

import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Users,
	Calendar,
	TrendingUp,
	TrendingDown,
	Search,
	Download,
	Filter,
	BookOpen,
} from 'lucide-react';

// Table components defined inline
const Table = ({ children, ...props }) => (
	<table
		className='w-full caption-bottom text-sm'
		{...props}
	>
		{children}
	</table>
);

const TableHeader = ({ children, ...props }) => (
	<thead
		className='[&_tr]:border-b'
		{...props}
	>
		{children}
	</thead>
);

const TableBody = ({ children, ...props }) => (
	<tbody
		className='[&_tr:last-child]:border-0'
		{...props}
	>
		{children}
	</tbody>
);

const TableRow = ({ children, ...props }) => (
	<tr
		className='border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted'
		{...props}
	>
		{children}
	</tr>
);

const TableHead = ({ children, ...props }) => (
	<th
		className='h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0'
		{...props}
	>
		{children}
	</th>
);

const TableCell = ({ children, ...props }) => (
	<td
		className='p-4 align-middle [&:has([role=checkbox])]:pr-0'
		{...props}
	>
		{children}
	</td>
);

// Mock data - replace with actual API calls
const mockClasses = [
	{ id: '1', name: 'Grade 10A', teacher: 'Mrs. Johnson', totalStudents: 32 },
	{ id: '2', name: 'Grade 10B', teacher: 'Mr. Davis', totalStudents: 28 },
	{ id: '3', name: 'Grade 11A', teacher: 'Ms. Wilson', totalStudents: 30 },
	{ id: '4', name: 'Grade 11B', teacher: 'Dr. Brown', totalStudents: 25 },
	{ id: '5', name: 'Grade 12A', teacher: 'Prof. Smith', totalStudents: 27 },
];

// Mock attendance data - this would come from your backend
const mockAttendanceData = [
	{
		id: '1',
		studentId: 'STU001',
		studentName: 'John Doe',
		rollNumber: '001',
		classId: '1',
		className: 'Grade 10A',
		totalDays: 180,
		presentDays: 165,
		absentDays: 15,
		lateArrivals: 8,
		earlyDepartures: 3,
		attendancePercentage: 91.7,
		lastAttendanceDate: '2024-06-18',
	},
	{
		id: '2',
		studentId: 'STU002',
		studentName: 'Jane Smith',
		rollNumber: '002',
		classId: '1',
		className: 'Grade 10A',
		totalDays: 180,
		presentDays: 172,
		absentDays: 8,
		lateArrivals: 5,
		earlyDepartures: 1,
		attendancePercentage: 95.6,
		lastAttendanceDate: '2024-06-19',
	},
	{
		id: '3',
		studentId: 'STU003',
		studentName: 'Mike Johnson',
		rollNumber: '003',
		classId: '1',
		className: 'Grade 10A',
		totalDays: 180,
		presentDays: 158,
		absentDays: 22,
		lateArrivals: 12,
		earlyDepartures: 6,
		attendancePercentage: 87.8,
		lastAttendanceDate: '2024-06-17',
	},
	{
		id: '4',
		studentId: 'STU004',
		studentName: 'Sarah Wilson',
		rollNumber: '001',
		classId: '2',
		className: 'Grade 10B',
		totalDays: 180,
		presentDays: 175,
		absentDays: 5,
		lateArrivals: 2,
		earlyDepartures: 0,
		attendancePercentage: 97.2,
		lastAttendanceDate: '2024-06-19',
	},
	{
		id: '5',
		studentId: 'STU005',
		studentName: 'David Brown',
		rollNumber: '002',
		classId: '2',
		className: 'Grade 10B',
		totalDays: 180,
		presentDays: 145,
		absentDays: 35,
		lateArrivals: 18,
		earlyDepartures: 10,
		attendancePercentage: 80.6,
		lastAttendanceDate: '2024-06-15',
	},
];

// Mock API functions
const fetchClasses = async () => {
	await new Promise((resolve) => setTimeout(resolve, 500));
	return mockClasses;
};

const fetchClassAttendance = async (filters) => {
	await new Promise((resolve) => setTimeout(resolve, 500));
	let filtered = mockAttendanceData;

	if (filters.classId && filters.classId !== 'all') {
		filtered = filtered.filter(
			(record) => record.classId === filters.classId
		);
	}

	if (filters.search) {
		const searchLower = filters.search.toLowerCase();
		filtered = filtered.filter(
			(record) =>
				record.studentName.toLowerCase().includes(searchLower) ||
				record.studentId.toLowerCase().includes(searchLower) ||
				record.rollNumber.toLowerCase().includes(searchLower)
		);
	}

	if (filters.attendanceFilter && filters.attendanceFilter !== 'all') {
		if (filters.attendanceFilter === 'excellent') {
			filtered = filtered.filter(
				(record) => record.attendancePercentage >= 95
			);
		} else if (filters.attendanceFilter === 'good') {
			filtered = filtered.filter(
				(record) =>
					record.attendancePercentage >= 85 &&
					record.attendancePercentage < 95
			);
		} else if (filters.attendanceFilter === 'average') {
			filtered = filtered.filter(
				(record) =>
					record.attendancePercentage >= 75 &&
					record.attendancePercentage < 85
			);
		} else if (filters.attendanceFilter === 'poor') {
			filtered = filtered.filter(
				(record) => record.attendancePercentage < 75
			);
		}
	}

	return filtered;
};

const AttendancePage = () => {
	const [selectedClass, setSelectedClass] = useState('all');
	const [searchQuery, setSearchQuery] = useState('');
	const [attendanceFilter, setAttendanceFilter] = useState('all');

	// Fetch classes
	const { data: classes = [], isLoading: classesLoading } = useQuery({
		queryKey: ['classes'],
		queryFn: fetchClasses,
	});

	// Fetch attendance with filters
	const { data: attendanceRecords = [], isLoading: attendanceLoading } =
		useQuery({
			queryKey: [
				'class-attendance',
				selectedClass,
				searchQuery,
				attendanceFilter,
			],
			queryFn: () =>
				fetchClassAttendance({
					classId: selectedClass,
					search: searchQuery,
					attendanceFilter: attendanceFilter,
				}),
		});

	// Calculate overall statistics
	const overallStats = useMemo(() => {
		if (attendanceRecords.length === 0)
			return {
				avgAttendance: 0,
				totalStudents: 0,
				excellentCount: 0,
				poorCount: 0,
			};

		const totalStudents = attendanceRecords.length;
		const avgAttendance =
			attendanceRecords.reduce(
				(sum, record) => sum + record.attendancePercentage,
				0
			) / totalStudents;
		const excellentCount = attendanceRecords.filter(
			(r) => r.attendancePercentage >= 95
		).length;
		const poorCount = attendanceRecords.filter(
			(r) => r.attendancePercentage < 75
		).length;

		return {
			avgAttendance: Math.round(avgAttendance * 10) / 10,
			totalStudents,
			excellentCount,
			poorCount,
		};
	}, [attendanceRecords]);

	const getAttendanceBadge = (percentage) => {
		if (percentage >= 95) {
			return (
				<Badge className='bg-green-100 text-green-800 hover:bg-green-100'>
					Excellent
				</Badge>
			);
		} else if (percentage >= 85) {
			return (
				<Badge className='bg-blue-100 text-blue-800 hover:bg-blue-100'>
					Good
				</Badge>
			);
		} else if (percentage >= 75) {
			return (
				<Badge className='bg-yellow-100 text-yellow-800 hover:bg-yellow-100'>
					Average
				</Badge>
			);
		} else {
			return (
				<Badge className='bg-red-100 text-red-800 hover:bg-red-100'>
					Poor
				</Badge>
			);
		}
	};

	const getAttendanceColor = (percentage) => {
		if (percentage >= 95) return 'text-green-600';
		if (percentage >= 85) return 'text-blue-600';
		if (percentage >= 75) return 'text-yellow-600';
		return 'text-red-600';
	};

	const handleExport = () => {
		// Mock export functionality
		console.log('Exporting attendance data...', attendanceRecords);
		alert('Export functionality would be implemented here');
	};

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div className='flex justify-between items-center'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight'>
						Class Attendance Records
					</h1>
					<p className='text-muted-foreground'>
						Monitor student attendance records across all classes
					</p>
				</div>
				<Button
					onClick={handleExport}
					className='flex items-center gap-2'
				>
					<Download className='h-4 w-4' />
					Export Report
				</Button>
			</div>

			{/* Statistics Cards */}
			<div className='grid gap-4 md:grid-cols-4'>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							Total Students
						</CardTitle>
						<Users className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>
							{overallStats.totalStudents}
						</div>
						<p className='text-xs text-muted-foreground'>
							Across{' '}
							{selectedClass === 'all'
								? 'all classes'
								: 'selected class'}
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							Average Attendance
						</CardTitle>
						<Calendar className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>
							{overallStats.avgAttendance}%
						</div>
						<p className='text-xs text-muted-foreground'>
							Overall class performance
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							Excellent Attendance
						</CardTitle>
						<TrendingUp className='h-4 w-4 text-green-600' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold text-green-600'>
							{overallStats.excellentCount}
						</div>
						<p className='text-xs text-muted-foreground'>
							95%+ attendance rate
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							Need Attention
						</CardTitle>
						<TrendingDown className='h-4 w-4 text-red-600' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold text-red-600'>
							{overallStats.poorCount}
						</div>
						<p className='text-xs text-muted-foreground'>
							Below 75% attendance
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Filters */}
			<Card>
				<CardHeader>
					<CardTitle className='flex items-center gap-2'>
						<Filter className='h-5 w-5' />
						Filters
					</CardTitle>
					<CardDescription>
						Filter attendance records by class, performance level,
						or search for specific students
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='grid gap-4 md:grid-cols-3'>
						<div className='space-y-2'>
							<label className='text-sm font-medium'>Class</label>
							<Select
								value={selectedClass}
								onValueChange={setSelectedClass}
							>
								<SelectTrigger>
									<SelectValue placeholder='Select class' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='all'>
										All Classes
									</SelectItem>
									{classes.map((cls) => (
										<SelectItem
											key={cls.id}
											value={cls.id}
										>
											{cls.name} - {cls.teacher}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className='space-y-2'>
							<label className='text-sm font-medium'>
								Attendance Level
							</label>
							<Select
								value={attendanceFilter}
								onValueChange={setAttendanceFilter}
							>
								<SelectTrigger>
									<SelectValue placeholder='Select level' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='all'>
										All Levels
									</SelectItem>
									<SelectItem value='excellent'>
										Excellent (95%+)
									</SelectItem>
									<SelectItem value='good'>
										Good (85-94%)
									</SelectItem>
									<SelectItem value='average'>
										Average (75-84%)
									</SelectItem>
									<SelectItem value='poor'>
										Poor (Below 75%)
									</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className='space-y-2'>
							<label className='text-sm font-medium'>
								Search Student
							</label>
							<div className='relative'>
								<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
								<Input
									placeholder='Search by name, ID, or roll number...'
									value={searchQuery}
									onChange={(e) =>
										setSearchQuery(e.target.value)
									}
									className='pl-10'
								/>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Attendance Records Table */}
			<Card>
				<CardHeader>
					<CardTitle className='flex items-center gap-2'>
						<BookOpen className='h-5 w-5' />
						Student Attendance Records
					</CardTitle>
					<CardDescription>
						{attendanceRecords.length} students found
						{selectedClass !== 'all' &&
							` in ${
								classes.find((c) => c.id === selectedClass)
									?.name
							}`}
					</CardDescription>
				</CardHeader>
				<CardContent>
					{attendanceLoading ? (
						<div className='flex items-center justify-center h-32'>
							<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
						</div>
					) : (
						<div className='rounded-md border'>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Roll No.</TableHead>
										<TableHead>Student Name</TableHead>
										<TableHead>Student ID</TableHead>
										<TableHead>Class</TableHead>
										<TableHead>Total Days</TableHead>
										<TableHead>Present</TableHead>
										<TableHead>Absent</TableHead>
										<TableHead>Late Arrivals</TableHead>
										<TableHead>Attendance %</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Last Present</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{attendanceRecords.length === 0 ? (
										<TableRow>
											<TableCell
												colSpan={11}
												className='text-center py-8 text-muted-foreground'
											>
												No attendance records found for
												the selected filters
											</TableCell>
										</TableRow>
									) : (
										attendanceRecords.map((record) => (
											<TableRow key={record.id}>
												<TableCell className='font-medium'>
													{record.rollNumber}
												</TableCell>
												<TableCell className='font-medium'>
													{record.studentName}
												</TableCell>
												<TableCell className='text-muted-foreground'>
													{record.studentId}
												</TableCell>
												<TableCell>
													{record.className}
												</TableCell>
												<TableCell>
													{record.totalDays}
												</TableCell>
												<TableCell className='text-green-600 font-medium'>
													{record.presentDays}
												</TableCell>
												<TableCell className='text-red-600 font-medium'>
													{record.absentDays}
												</TableCell>
												<TableCell className='text-yellow-600'>
													{record.lateArrivals}
												</TableCell>
												<TableCell
													className={`font-bold ${getAttendanceColor(
														record.attendancePercentage
													)}`}
												>
													{
														record.attendancePercentage
													}
													%
												</TableCell>
												<TableCell>
													{getAttendanceBadge(
														record.attendancePercentage
													)}
												</TableCell>
												<TableCell className='text-muted-foreground'>
													{new Date(
														record.lastAttendanceDate
													).toLocaleDateString()}
												</TableCell>
											</TableRow>
										))
									)}
								</TableBody>
							</Table>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
};

export default AttendancePage;
