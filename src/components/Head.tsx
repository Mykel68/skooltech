'use client';
import { useUserStore } from '@/stores/userStore';
import { restoreUserFromCookie } from '@/utils/restoreAuth';
import axios from 'axios';
import { Bell, Menu, School, Settings, User } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { logout } from '@/utils/logout';
import { useSidebar } from './sidebar-provider';

export default function Head() {
	const router = useRouter();

	const userId = useUserStore((s) => s.userId);
	const setUser = useUserStore((s) => s.setUser);
	const schoolId = useUserStore((s) => s.schoolId);
	const firstName = useUserStore((s) => s.firstName);
	const lastName = useUserStore((s) => s.lastName);

	const [ready, setReady] = useState(false);
	const [currentSession, setCurrentSession] = useState<any>(null);
	const [currentTerm, setCurrentTerm] = useState<any>(null);
	const [sessions, setSessions] = useState<Session[]>([]);

	const { toggle } = useSidebar();

	const handleLogout = () => {
		logout();
		router.push('/login');
	};

	type Term = {
		term_id: string;
		name: string;
	};

	type Session = {
		session_id: string;
		terms: Term[];
		name: string;
	};

	useEffect(() => {
		restoreUserFromCookie();
		setReady(true);
	}, []);

	useEffect(() => {
		if (ready && userId === null) {
			router.push('/login');
		}
	}, [ready, userId, router]);

	const fetchSessions = async () => {
		if (!schoolId) return;

		const res = await axios.get(`/api/term/get-all-terms/${schoolId}`);
		const sessionData = res.data?.data?.data?.sessions;

		if (!sessionData || typeof sessionData !== 'object') {
			throw new Error('Failed to fetch sessions');
		}

		// Safely convert object to array
		return Object.entries(sessionData).map(([id, session]) => ({
			...(session as Record<string, any>), // Explicitly assert the type
			session_id: id,
		}));
	};

	useEffect(() => {
		if (!schoolId) return;

		fetchSessions()
			.then((data) => {
				if (!data) return;
				setSessions(data as any);
				const defaultSession = data[0] as Session;
				const defaultTerm = defaultSession.terms?.[0] ?? null;

				setCurrentSession(defaultSession);
				setCurrentTerm(defaultTerm);

				setUser({
					session_id: defaultSession.session_id,
					term_id: defaultTerm?.term_id!,
				});
			})
			.catch((err) => console.error('Error fetching sessions:', err));
	}, [schoolId, setUser]);

	const handleSessionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedId = e.target.value;
		const selectedSession = sessions.find(
			(s) => s.session_id === selectedId
		);
		if (selectedSession) {
			const firstTerm = selectedSession.terms?.[0] || null;
			setCurrentSession(selectedSession);
			setCurrentTerm(firstTerm);
			setUser({
				session_id: selectedSession.session_id,
				term_id: firstTerm?.term_id,
			});
		}
	};

	const handleTermChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedTermId = e.target.value;
		const selectedTerm = currentSession?.terms?.find(
			(t: any) => t.term_id === selectedTermId
		);
		if (selectedTerm) {
			setCurrentTerm(selectedTerm);
			setUser({ term_id: selectedTerm.term_id });
		}
	};
	return (
		<div className='bg-white sticky top-0 z-40 shadow-sm border-b border-gray-200'>
			<div className='max-w-7xl mx-auto px-6 py-4'>
				<Button
					variant='ghost'
					size='icon'
					className='lg:hidden'
					onClick={toggle}
				>
					<Menu className='h-5 w-5' />
					<span className='sr-only'>Toggle sidebar</span>
				</Button>
				<div className='flex items-center justify-between'>
					<div className='flex items-center space-x-4'>
						<School className='w-8 h-8 text-blue-600' />
						<div>
							<h1 className='text-2xl font-bold text-gray-900'>
								Admin Dashboard
							</h1>
							<p className='text-sm text-gray-600'>
								Welcome back, {firstName} {lastName}
							</p>
						</div>
					</div>

					<div className='flex items-center space-x-4'>
						<div className='flex items-center space-x-2'>
							<select
								value={currentSession?.session_id || ''}
								onChange={handleSessionChange}
								className='px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500'
							>
								{sessions.map((session) => (
									<option
										key={session.session_id}
										value={session.session_id}
									>
										{session.name}
									</option>
								))}
							</select>
							<select
								value={currentTerm?.term_id || ''}
								onChange={handleTermChange}
								className='px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500'
							>
								{currentSession?.terms?.map((term: any) => (
									<option
										key={term.term_id}
										value={term.term_id}
									>
										{term.name}
									</option>
								)) ?? <option disabled>No Term</option>}
							</select>
						</div>
						<div className='relative'>
							<Bell className='w-6 h-6 text-gray-600 cursor-pointer hover:text-gray-800' />
							<span className='absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full'></span>
						</div>
						<Settings className='w-6 h-6 text-gray-600 cursor-pointer hover:text-gray-800' />
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant='ghost'
									size='icon'
									className='h-8 w-8 rounded-full'
								>
									<User className='h-4 w-4' />
									<span className='sr-only'>User menu</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align='end'>
								<DropdownMenuLabel>
									{firstName} {lastName}&apos;s Account
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem>Profile</DropdownMenuItem>
								<DropdownMenuItem>Settings</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={handleLogout}>
									Logout
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</div>
		</div>
	);
}
