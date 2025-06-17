'use client';

import React, { useState } from 'react';
import {
	Calendar,
	Clock,
	Plus,
	Edit3,
	Power,
	PowerOff,
	ChevronRight,
	Users,
	BookOpen,
	GraduationCap,
	Sparkles,
	X,
} from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useUserStore } from '@/stores/userStore';
import axios from 'axios';
import { toast } from 'sonner';

interface Session {
	session_id: string;
	name: string;
	start_date: string;
	end_date: string;
	is_active?: string;
}

// Utility function to format dates
const formatDate = (dateString) => {
	const date = new Date(dateString);
	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	});
};

const SessionCard = ({ session, onEditClick, toggleActive, onViewDetails }) => {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<div
			className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 cursor-pointer group ${
				session.is_active
					? 'border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 hover:border-emerald-300 shadow-lg shadow-emerald-100/50'
					: 'border-slate-200 bg-gradient-to-br from-slate-50 to-gray-50 hover:border-slate-300 shadow-lg shadow-slate-100/50'
			} hover:shadow-xl hover:scale-[1.02]`}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			onClick={() => onViewDetails(session)}
		>
			{/* Decorative background elements */}
			<div className='absolute inset-0 overflow-hidden'>
				<div
					className={`absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-10 ${
						session.is_active ? 'bg-emerald-400' : 'bg-slate-400'
					}`}
				/>
				<div
					className={`absolute -bottom-6 -left-6 w-32 h-32 rounded-full opacity-5 ${
						session.is_active ? 'bg-teal-400' : 'bg-gray-400'
					}`}
				/>
			</div>

			{/* Status indicator */}
			<div className='absolute top-4 right-4'>
				<div
					className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
						session.is_active
							? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
							: 'bg-slate-100 text-slate-600 border border-slate-200'
					}`}
				>
					<div
						className={`w-2 h-2 rounded-full ${
							session.is_active
								? 'bg-emerald-500 animate-pulse'
								: 'bg-slate-400'
						}`}
					/>
					{session.is_active ? 'Active' : 'Inactive'}
				</div>
			</div>

			<div className='relative p-6'>
				<div className='flex items-start justify-between mb-4'>
					<div className='flex-1'>
						<h3 className='text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors'>
							{session.name}
						</h3>

						<div className='flex items-center gap-4 text-sm text-slate-600 mb-4'>
							<div className='flex items-center gap-1'>
								<Calendar className='w-4 h-4' />
								<span>
									{formatDate(session.start_date)} -{' '}
									{formatDate(session.end_date)}
								</span>
							</div>
						</div>

						<div className='flex items-center gap-6 mb-4'>
							<div className='flex items-center gap-2 text-sm'>
								<BookOpen className='w-4 h-4 text-blue-500' />
								<span className='text-slate-700'>
									{session.terms_count} Terms
								</span>
							</div>
							<div className='flex items-center gap-2 text-sm'>
								<Users className='w-4 h-4 text-purple-500' />
								<span className='text-slate-700'>
									{session.students_count} Students
								</span>
							</div>
						</div>
					</div>

					<ChevronRight
						className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
							isHovered ? 'translate-x-1 text-emerald-500' : ''
						}`}
					/>
				</div>

				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-2'>
						<button
							onClick={(e) => {
								e.stopPropagation();
								toggleActive(session);
							}}
							className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
								session.is_active
									? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
									: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
							}`}
						>
							{session.is_active ? (
								<>
									<PowerOff className='w-4 h-4' />
									Deactivate
								</>
							) : (
								<>
									<Power className='w-4 h-4' />
									Activate
								</>
							)}
						</button>

						<button
							onClick={(e) => {
								e.stopPropagation();
								onEditClick(session);
							}}
							className='flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-all duration-200'
						>
							<Edit3 className='w-4 h-4' />
							Edit
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

const CreateSessionDialog = ({ open, setOpen, onSubmit }) => {
	const [formData, setFormData] = useState({
		name: '',
		start_date: '',
		end_date: '',
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		onSubmit(formData);
		setFormData({ name: '', start_date: '', end_date: '' });
	};

	if (!open) return null;

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center'>
			<div
				className='absolute inset-0 bg-black/20 backdrop-blur-sm'
				onClick={() => setOpen(false)}
			/>
			<div className='relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden'>
				<div className='bg-gradient-to-r from-emerald-500 to-teal-500 p-6 text-white'>
					<div className='flex items-center justify-between'>
						<div className='flex items-center gap-3'>
							<div className='w-10 h-10 bg-white/20 rounded-full flex items-center justify-center'>
								<Sparkles className='w-5 h-5' />
							</div>
							<h2 className='text-xl font-bold'>
								Create New Session
							</h2>
						</div>
						<button
							onClick={() => setOpen(false)}
							className='p-2 hover:bg-white/20 rounded-full transition-colors'
						>
							<X className='w-5 h-5' />
						</button>
					</div>
				</div>

				<div className='p-6'>
					<div className='space-y-6'>
						<div>
							<label className='block text-sm font-semibold text-slate-700 mb-2'>
								Session Name
							</label>
							<input
								type='text'
								value={formData.name}
								onChange={(e) =>
									setFormData({
										...formData,
										name: e.target.value,
									})
								}
								className='w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all'
								placeholder='e.g., 2024-2025 Academic Year'
								required
							/>
						</div>

						<div className='grid grid-cols-2 gap-4'>
							<div>
								<label className='block text-sm font-semibold text-slate-700 mb-2'>
									Start Date
								</label>
								<input
									type='date'
									value={formData.start_date}
									onChange={(e) =>
										setFormData({
											...formData,
											start_date: e.target.value,
										})
									}
									className='w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all'
									required
								/>
							</div>

							<div>
								<label className='block text-sm font-semibold text-slate-700 mb-2'>
									End Date
								</label>
								<input
									type='date'
									value={formData.end_date}
									onChange={(e) =>
										setFormData({
											...formData,
											end_date: e.target.value,
										})
									}
									className='w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all'
									required
								/>
							</div>
						</div>

						<div className='flex items-center gap-3 pt-4'>
							<button
								type='button'
								onClick={() => setOpen(false)}
								className='flex-1 px-4 py-3 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl font-medium transition-colors'
							>
								Cancel
							</button>
							<button
								onClick={handleSubmit}
								className='flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-medium transition-all shadow-lg shadow-emerald-200'
							>
								Create Session
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const SessionList = ({
	sessions,
	isLoading,
	onEditClick,
	toggleActive,
	onViewDetails,
}) => {
	if (isLoading) {
		return (
			<div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
				{[1, 2, 3].map((i) => (
					<div
						key={i}
						className='animate-pulse'
					>
						<div className='bg-slate-200 rounded-xl h-48'></div>
					</div>
				))}
			</div>
		);
	}

	if (sessions.length === 0) {
		return (
			<div className='text-center py-12'>
				<div className='w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4'>
					<GraduationCap className='w-8 h-8 text-slate-400' />
				</div>
				<h3 className='text-lg font-semibold text-slate-700 mb-2'>
					No sessions found
				</h3>
				<p className='text-slate-500'>
					Create your first session to get started.
				</p>
			</div>
		);
	}

	return (
		<div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
			{sessions.map((session) => (
				<SessionCard
					key={session.session_id}
					session={session}
					onEditClick={onEditClick}
					toggleActive={toggleActive}
					onViewDetails={onViewDetails}
				/>
			))}
		</div>
	);
};

const TermsView = ({ session, onBack }) => {
	return (
		<div className='min-h-screen '>
			<div className='max-w-7xl mx-auto p-6'>
				<div className='mb-8'>
					<button
						onClick={onBack}
						className='flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4'
					>
						<ChevronRight className='w-4 h-4 rotate-180' />
						Back to Sessions
					</button>

					<div className='flex items-center justify-between'>
						<div>
							<h1 className='text-3xl font-bold text-slate-900 mb-2'>
								{session.name}
							</h1>
							<p className='text-slate-600 flex items-center gap-2'>
								<Calendar className='w-4 h-4' />
								{formatDate(session.start_date)} -{' '}
								{formatDate(session.end_date)}
							</p>
						</div>

						<button className='flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-200'>
							<Plus className='w-5 h-5' />
							Create New Term
						</button>
					</div>
				</div>

				<div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
					{session.terms.map((term) => (
						<div
							key={term.term_id}
							className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${
								term.is_active
									? 'border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg shadow-blue-100/50'
									: 'border-slate-200 bg-gradient-to-br from-slate-50 to-gray-50 shadow-lg shadow-slate-100/50'
							}`}
						>
							{/* Status indicator */}
							<div className='absolute top-4 right-4'>
								<div
									className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
										term.is_active
											? 'bg-blue-100 text-blue-700 border border-blue-200'
											: 'bg-slate-100 text-slate-600 border border-slate-200'
									}`}
								>
									<div
										className={`w-2 h-2 rounded-full ${
											term.is_active
												? 'bg-blue-500 animate-pulse'
												: 'bg-slate-400'
										}`}
									/>
									{term.is_active ? 'Active' : 'Inactive'}
								</div>
							</div>

							<div className='p-6'>
								<h3 className='text-xl font-bold text-slate-900 mb-2'>
									{term.name}
								</h3>

								<div className='flex items-center gap-2 text-sm text-slate-600 mb-4'>
									<Calendar className='w-4 h-4' />
									<span>
										{formatDate(term.start_date)} -{' '}
										{formatDate(term.end_date)}
									</span>
								</div>

								<div className='flex items-center gap-2 mt-4'>
									<button className='flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-all duration-200'>
										<Edit3 className='w-4 h-4' />
										Edit
									</button>

									<button
										className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
											term.is_active
												? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
												: 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
										}`}
									>
										{term.is_active ? (
											<>
												<PowerOff className='w-4 h-4' />
												Deactivate
											</>
										) : (
											<>
												<Power className='w-4 h-4' />
												Activate
											</>
										)}
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default function SessionManagementUI() {
	const [openCreateDialog, setOpenCreateDialog] = useState(false);
	const [currentView, setCurrentView] = useState<'sessions' | 'terms'>(
		'sessions'
	);
	const [selectedSession, setSelectedSession] = useState<Session | null>(
		null
	);

	const queryClient = useQueryClient();
	const schoolId = useUserStore((s) => s.schoolId);

	const { data: sessions = [], isLoading } = useQuery({
		queryKey: ['sessions', schoolId],
		queryFn: async () => {
			const res = await axios.get(
				`/api/session/get-all-session/${schoolId}`
			);
			return res.data.data.sessions;
		},
		enabled: !!schoolId,
	});

	// ✅ Create a new session
	const createMutation = useMutation({
		mutationFn: async (
			formData: Omit<Session, 'session_id' | 'is_active'>
		) => {
			const res = await axios.post(
				`/api/session/create-new/${schoolId}`,
				formData
			);
			return res.data;
		},
		onSuccess: () => {
			toast.success('Session created');
			queryClient.invalidateQueries({ queryKey: ['sessions', schoolId] });
			setOpenCreateDialog(false);
		},
		onError: () => toast.error('Failed to create session'),
	});

	// ✅ Update (activate/deactivate)
	const updateMutation = useMutation({
		mutationFn: async ({
			session_id,
			data,
		}: {
			session_id: string;
			data: Partial<Session>;
		}) => {
			return axios.patch(
				`/api/session/activate/${schoolId}/${session_id}`,
				data
			);
		},
		onSuccess: () => {
			toast.success('Session updated');
			queryClient.invalidateQueries({ queryKey: ['sessions', schoolId] });
		},
		onError: () => toast.error('Failed to update session'),
	});

	const toggleActive = (session: Session) => {
		if (!schoolId) return toast.error('School ID missing');
		updateMutation.mutate({
			session_id: session.session_id,
			data: { is_active: !session.is_active },
		});
	};

	const handleCreateSession = (
		formData: Omit<Session, 'session_id' | 'is_active'>
	) => {
		if (!schoolId) return toast.error('School ID missing');
		createMutation.mutate(formData);
	};

	const handleEditClick = (session: Session) => {
		// Optional: set session for editing
		// setEditSession(session);
		setOpenCreateDialog(true);
	};

	const onViewDetails = (session: Session) => {
		setSelectedSession(session);
		setCurrentView('terms');
	};

	const handleBackToSessions = () => {
		setCurrentView('sessions');
		setSelectedSession(null);
	};

	if (currentView === 'terms' && selectedSession) {
		return (
			<TermsView
				session={selectedSession}
				onBack={handleBackToSessions}
			/>
		);
	}

	return (
		<div className='min-h-screen'>
			<div className='max-w-7xl mx-auto p-6'>
				{/* Header */}
				<div className='mb-8 flex items-center justify-between'>
					<div>
						<h1 className='text-3xl font-bold text-slate-900 mb-2'>
							School Sessions
						</h1>
						<p className='text-slate-600'>
							Manage your academic sessions and terms
						</p>
					</div>

					<button
						onClick={() => setOpenCreateDialog(true)}
						className='flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl hover:scale-105'
					>
						<Plus className='w-5 h-5' />
						Create New Session
					</button>
				</div>

				{/* Sessions Grid */}
				<SessionList
					sessions={sessions}
					isLoading={isLoading}
					onEditClick={handleEditClick}
					toggleActive={toggleActive}
					onViewDetails={onViewDetails}
				/>

				{/* Create Session Dialog */}
				<CreateSessionDialog
					open={openCreateDialog}
					setOpen={setOpenCreateDialog}
					onSubmit={handleCreateSession}
				/>
			</div>
		</div>
	);
}
