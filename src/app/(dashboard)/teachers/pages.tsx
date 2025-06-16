'use client';

import React, { useState } from 'react';
import {
	Users,
	GraduationCap,
	Settings,
	BookOpen,
	BarChart3,
	Menu,
	X,
	Edit,
	UserCheck,
	Trash2,
	Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableHead,
	TableCell,
} from '@/components/ui/table';
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '@/components/ui/dialog';
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
	SelectValue,
} from '@/components/ui/select';

// Mock data types
type Teacher = {
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

type ClassItem = {
	class_id: string;
	name: string;
	grade_level: string;
};

// Mock data
const mockTeachers: Teacher[] = [
	{
		user_id: '1',
		username: 'jsmith',
		email: 'john.smith@school.edu',
		first_name: 'John',
		last_name: 'Smith',
		role: 'Teacher',
		school_id: 'school1',
		is_approved: true,
	},
	{
		user_id: '2',
		username: 'mjohnson',
		email: 'mary.johnson@school.edu',
		first_name: 'Mary',
		last_name: 'Johnson',
		role: 'Teacher',
		school_id: 'school1',
		is_approved: false,
	},
	{
		user_id: '3',
		username: 'rdavis',
		email: 'robert.davis@school.edu',
		first_name: 'Robert',
		last_name: 'Davis',
		role: 'Teacher',
		school_id: 'school1',
		is_approved: true,
	},
];

const mockClassTeachers: ClassTeacher[] = [
	{
		class_teacher_id: '1',
		class_id: 'class1',
		class: { name: 'Mathematics 101', grade_level: 'Grade 9' },
		teacher: { user_id: '1', first_name: 'John', last_name: 'Smith' },
	},
	{
		class_teacher_id: '2',
		class_id: 'class2',
		class: { name: 'English Literature', grade_level: 'Grade 10' },
		teacher: { user_id: '3', first_name: 'Robert', last_name: 'Davis' },
	},
];

const mockClasses: ClassItem[] = [
	{ class_id: 'class1', name: 'Mathematics 101', grade_level: 'Grade 9' },
	{ class_id: 'class2', name: 'English Literature', grade_level: 'Grade 10' },
	{ class_id: 'class3', name: 'Science Physics', grade_level: 'Grade 11' },
	{ class_id: 'class4', name: 'History World War', grade_level: 'Grade 12' },
];

// TeacherRow Component
function TeacherRow({ teacher, onToggleApproval, onDeleteClick }) {
	return (
		<TableRow>
			<TableCell>{teacher.username}</TableCell>
			<TableCell>{teacher.email}</TableCell>
			<TableCell>{teacher.first_name}</TableCell>
			<TableCell>{teacher.last_name}</TableCell>
			<TableCell>{teacher.role}</TableCell>
			<TableCell className='text-center'>
				{teacher.is_approved ? '✅' : '❌'}
			</TableCell>
			<TableCell>
				<div className='flex gap-2 justify-center items-center'>
					<Button
						size='sm'
						variant={
							teacher.is_approved ? 'destructive' : 'default'
						}
						onClick={() =>
							onToggleApproval(
								teacher.user_id,
								!teacher.is_approved
							)
						}
						className='w-24'
					>
						{teacher.is_approved ? 'Disapprove' : 'Approve'}
					</Button>
					<Button
						size='icon'
						variant='ghost'
						onClick={() => onDeleteClick(teacher.user_id)}
					>
						<Trash2 className='w-4 h-4 text-red-500' />
					</Button>
				</div>
			</TableCell>
		</TableRow>
	);
}

// CreateTeacherDialog Component
function CreateTeacherDialog({ mutateAsync, classes, teachers }) {
	const [selectedClass, setSelectedClass] = useState('');
	const [selectedTeacher, setSelectedTeacher] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [open, setOpen] = useState(false);

	const handleSubmit = async () => {
		if (!selectedClass || !selectedTeacher) return;

		setIsSubmitting(true);
		try {
			await mutateAsync({
				class_id: selectedClass,
				teacher_id: selectedTeacher,
			});
			setOpen(false);
			setSelectedClass('');
			setSelectedTeacher('');
		} catch (err) {
			console.error('Error assigning teacher:', err);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog
			open={open}
			onOpenChange={setOpen}
		>
			<DialogTrigger asChild>
				<Button className='rounded-lg px-4 py-2 font-medium shadow'>
					<Plus className='w-4 h-4 mr-2' />
					Assign Class Teacher
				</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-xl'>
				<div
					onSubmit={handleSubmit}
					className='space-y-5'
				>
					<DialogHeader>
						<DialogTitle className='text-xl font-semibold'>
							Assign Class Teacher
						</DialogTitle>
					</DialogHeader>
					<div className='space-y-4'>
						<div>
							<label className='block text-sm font-medium mb-2'>
								Select Class
							</label>
							<Select
								value={selectedClass}
								onValueChange={setSelectedClass}
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
						</div>
						<div>
							<label className='block text-sm font-medium mb-2'>
								Select Teacher
							</label>
							<Select
								value={selectedTeacher}
								onValueChange={setSelectedTeacher}
							>
								<SelectTrigger className='w-full'>
									<SelectValue placeholder='Choose a teacher' />
								</SelectTrigger>
								<SelectContent>
									{teachers
										.filter((t) => t.is_approved)
										.map((teacher) => (
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
						</div>
					</div>
					<DialogFooter className='pt-4'>
						<Button
							type='button'
							variant='ghost'
							onClick={() => setOpen(false)}
						>
							Cancel
						</Button>
						<Button
							onClick={handleSubmit}
							disabled={
								isSubmitting ||
								!selectedClass ||
								!selectedTeacher
							}
						>
							{isSubmitting ? 'Assigning...' : 'Assign'}
						</Button>
					</DialogFooter>
				</div>
			</DialogContent>
		</Dialog>
	);
}

// DeleteTeacherDialog Component
function DeleteTeacherDialog({ open, onClose, onConfirm }) {
	return (
		<Dialog
			open={open}
			onOpenChange={onClose}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Delete Teacher</DialogTitle>
				</DialogHeader>
				<p className='text-sm text-muted-foreground'>
					Are you sure you want to delete this teacher? This action
					cannot be undone.
				</p>
				<DialogFooter>
					<Button
						variant='ghost'
						onClick={onClose}
					>
						Cancel
					</Button>
					<Button
						variant='destructive'
						onClick={onConfirm}
					>
						Delete
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

// Sidebar Component
function Sidebar({ activeItem, setActiveItem, isOpen, setIsOpen }) {
	const menuItems = [
		{ id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
		{ id: 'teachers', label: 'Teachers', icon: Users },
		{ id: 'students', label: 'Students', icon: GraduationCap },
		{ id: 'classes', label: 'Classes', icon: BookOpen },
		{ id: 'settings', label: 'Settings', icon: Settings },
	];

	return (
		<>
			{/* Mobile backdrop */}
			{isOpen && (
				<div
					className='fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden'
					onClick={() => setIsOpen(false)}
				/>
			)}

			{/* Sidebar */}
			<div
				className={`fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out ${
					isOpen ? 'translate-x-0' : '-translate-x-full'
				} lg:translate-x-0 lg:static lg:z-auto`}
			>
				<div className='p-6 border-b border-gray-200'>
					<div className='flex items-center justify-between'>
						<h1 className='text-xl font-bold text-gray-900'>
							Admin Panel
						</h1>
						<Button
							variant='ghost'
							size='icon'
							className='lg:hidden'
							onClick={() => setIsOpen(false)}
						>
							<X className='w-5 h-5' />
						</Button>
					</div>
				</div>

				<nav className='p-4'>
					<ul className='space-y-2'>
						{menuItems.map((item) => {
							const Icon = item.icon;
							return (
								<li key={item.id}>
									<button
										onClick={() => {
											setActiveItem(item.id);
											setIsOpen(false);
										}}
										className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
											activeItem === item.id
												? 'bg-blue-50 text-blue-700 border border-blue-200'
												: 'text-gray-700 hover:bg-gray-50'
										}`}
									>
										<Icon className='w-5 h-5 mr-3' />
										{item.label}
									</button>
								</li>
							);
						})}
					</ul>
				</nav>
			</div>
		</>
	);
}

// Teacher Management Component
function TeacherManagement() {
	const [teachers, setTeachers] = useState(mockTeachers);
	const [classTeachers, setClassTeachers] = useState(mockClassTeachers);
	const [deleteId, setDeleteId] = useState(null);
	const [activeTab, setActiveTab] = useState('all-teachers');

	const toggleApproval = (userId, approve) => {
		setTeachers((prev) =>
			prev.map((teacher) =>
				teacher.user_id === userId
					? { ...teacher, is_approved: approve }
					: teacher
			)
		);
	};

	const deleteTeacher = () => {
		if (!deleteId) return;
		setTeachers((prev) =>
			prev.filter((teacher) => teacher.user_id !== deleteId)
		);
		setDeleteId(null);
	};

	const assignClassTeacher = async ({ class_id, teacher_id }) => {
		const selectedClass = mockClasses.find((c) => c.class_id === class_id);
		const selectedTeacher = teachers.find((t) => t.user_id === teacher_id);

		const newClassTeacher = {
			class_teacher_id: `ct_${Date.now()}`,
			class_id,
			class: {
				name: selectedClass.name,
				grade_level: selectedClass.grade_level,
			},
			teacher: {
				user_id: selectedTeacher.user_id,
				first_name: selectedTeacher.first_name,
				last_name: selectedTeacher.last_name,
			},
		};

		setClassTeachers((prev) => [...prev, newClassTeacher]);
	};

	const removeClassTeacher = (classTeacherId) => {
		setClassTeachers((prev) =>
			prev.filter((ct) => ct.class_teacher_id !== classTeacherId)
		);
	};

	return (
		<div className='p-6 w-full max-w-7xl mx-auto'>
			<div className='mb-6'>
				<h2 className='text-2xl font-bold text-gray-900'>
					Teacher Management
				</h2>
				<p className='text-gray-600'>
					Manage teachers and class assignments
				</p>
			</div>

			<Tabs
				value={activeTab}
				onValueChange={setActiveTab}
				className='w-full space-y-6'
			>
				<TabsList className='w-full grid grid-cols-2 gap-2 bg-muted p-1 rounded-lg shadow-sm'>
					<TabsTrigger
						value='all-teachers'
						className='flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-semibold transition-colors hover:bg-accent hover:text-accent-foreground data-[state=active]:bg-white data-[state=active]:text-foreground'
					>
						<Edit className='w-4 h-4' />
						All Teachers
					</TabsTrigger>
					<TabsTrigger
						value='class-teachers'
						className='flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-semibold transition-colors hover:bg-accent hover:text-accent-foreground data-[state=active]:bg-white data-[state=active]:text-foreground'
					>
						<UserCheck className='w-4 h-4' />
						Class Teachers
					</TabsTrigger>
				</TabsList>

				<TabsContent value='all-teachers'>
					<Card className='rounded-2xl'>
						<CardHeader>
							<CardTitle>All Teachers</CardTitle>
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
						<CardHeader>
							<CardTitle className='flex items-center justify-between'>
								Class Teachers
								<CreateTeacherDialog
									mutateAsync={assignClassTeacher}
									classes={mockClasses}
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
									{classTeachers.length === 0 ? (
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
														onClick={() =>
															removeClassTeacher(
																ct.class_teacher_id
															)
														}
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

// Main Dashboard Component
export default function TeacherManagementDashboard() {
	const [activeItem, setActiveItem] = useState('teachers');
	const [sidebarOpen, setSidebarOpen] = useState(false);

	const renderContent = () => {
		switch (activeItem) {
			case 'teachers':
				return <TeacherManagement />;
			case 'dashboard':
				return (
					<div className='p-6'>
						<h2 className='text-2xl font-bold mb-4'>Dashboard</h2>
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
							<Card>
								<CardContent className='p-6'>
									<div className='flex items-center'>
										<Users className='w-8 h-8 text-blue-500' />
										<div className='ml-4'>
											<p className='text-sm font-medium text-gray-600'>
												Total Teachers
											</p>
											<p className='text-2xl font-semibold'>
												{mockTeachers.length}
											</p>
										</div>
									</div>
								</CardContent>
							</Card>
							<Card>
								<CardContent className='p-6'>
									<div className='flex items-center'>
										<Edit className='w-8 h-8 text-green-500' />
										<div className='ml-4'>
											<p className='text-sm font-medium text-gray-600'>
												Approved Teachers
											</p>
											<p className='text-2xl font-semibold'>
												{
													mockTeachers.filter(
														(t) => t.is_approved
													).length
												}
											</p>
										</div>
									</div>
								</CardContent>
							</Card>
							<Card>
								<CardContent className='p-6'>
									<div className='flex items-center'>
										<BookOpen className='w-8 h-8 text-purple-500' />
										<div className='ml-4'>
											<p className='text-sm font-medium text-gray-600'>
												Class Assignments
											</p>
											<p className='text-2xl font-semibold'>
												{mockClassTeachers.length}
											</p>
										</div>
									</div>
								</CardContent>
							</Card>
							<Card>
								<CardContent className='p-6'>
									<div className='flex items-center'>
										<GraduationCap className='w-8 h-8 text-orange-500' />
										<div className='ml-4'>
											<p className='text-sm font-medium text-gray-600'>
												Total Classes
											</p>
											<p className='text-2xl font-semibold'>
												{mockClasses.length}
											</p>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
				);
			default:
				return (
					<div className='p-6'>
						<h2 className='text-2xl font-bold mb-4'>
							{activeItem.charAt(0).toUpperCase() +
								activeItem.slice(1)}
						</h2>
						<p className='text-gray-600'>
							This section is under development.
						</p>
					</div>
				);
		}
	};

	return (
		<div className='min-h-screen bg-gray-50'>
			{/* Mobile header */}
			<div className='lg:hidden bg-white border-b border-gray-200 p-4'>
				<div className='flex items-center justify-between'>
					<h1 className='text-lg font-semibold'>Admin Panel</h1>
					<Button
						variant='ghost'
						size='icon'
						onClick={() => setSidebarOpen(true)}
					>
						<Menu className='w-5 h-5' />
					</Button>
				</div>
			</div>

			<div className='flex'>
				<Sidebar
					activeItem={activeItem}
					setActiveItem={setActiveItem}
					isOpen={sidebarOpen}
					setIsOpen={setSidebarOpen}
				/>

				<main className='flex-1 lg:ml-0'>{renderContent()}</main>
			</div>
		</div>
	);
}
