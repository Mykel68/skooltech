'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useSidebar } from './sidebar-provider';
import { useUserStore } from '@/stores/userStore';
import { footerItems, navItems } from '@/constants/sidebar';
import { restoreUserFromCookie } from '@/utils/restoreAuth';
import axios from 'axios';
import { logout } from '@/utils/logout';

export function Sidebar() {
	const router = useRouter();
	const pathname = usePathname();
	const { isOpen, toggle } = useSidebar();

	const userId = useUserStore((s) => s.userId);
	const schoolImage = useUserStore((s) => s.schoolImage);
	const schoolName = useUserStore((s) => s.schoolName);
	const setUser = useUserStore((s) => s.setUser);
	const schoolId = useUserStore((s) => s.schoolId);

	const [ready, setReady] = useState(false);
	const [currentSession, setCurrentSession] = useState<any>(null);
	const [currentTerm, setCurrentTerm] = useState<any>(null);
	const [sessions, setSessions] = useState<Session[]>([]);

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

	const handleLogout = () => {
		logout();
		router.push('/');
	};

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
		<>
			<div
				className={cn(
					'fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden',
					isOpen ? 'block' : 'hidden'
				)}
				onClick={toggle}
			/>

			<aside
				className={cn(
					'fixed inset-y-0 left-0 z-50 w-72 bg-green-700 border-r',
					'transition-transform duration-300 ease-in-out lg:translate-x-0',
					isOpen ? 'translate-x-0' : '-translate-x-full'
				)}
			>
				{/* Header */}
				<div className='flex items-center gap-3 border-b px-4 h-16'>
					<img
						src={schoolImage ?? '/images/default-logo.png'}
						alt='logo'
						className='h-10 w-10 rounded-full object-cover'
					/>
					<div className='flex flex-col flex-1'>
						<p className='text-sm font-semibold text-white truncate'>
							{schoolName ?? 'Loading…'}
						</p>
						<div className='grid grid-cols-2 gap-2 mt-1'>
							<select
								value={currentSession?.session_id || ''}
								onChange={handleSessionChange}
								className='text-xs bg-green-800 text-white rounded px-2 py-1 outline-none focus:ring-1 ring-white'
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
								className='text-xs bg-green-800 text-white rounded px-2 py-1 outline-none focus:ring-1 ring-white'
								disabled={currentSession?.terms?.length <= 1}
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
					</div>
					<Button
						variant='ghost'
						size='icon'
						className='ml-auto text-white lg:hidden'
						onClick={toggle}
					>
						<Menu className='h-6 w-6' />
					</Button>
				</div>

				{/* Main Nav */}
				<div className='flex flex-col h-[calc(100vh-64px)] overflow-auto justify-between'>
					<nav className='flex flex-col py-4 px-3 space-y-2'>
						{navItems.map((item) => {
							const active =
								pathname === item.href ||
								pathname.startsWith(`${item.href}/`);
							return (
								<Link
									key={item.href}
									href={item.href}
									className={cn(
										'flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-semibold',
										active
											? 'bg-green-400 text-white'
											: 'text-white hover:bg-emerald-600'
									)}
								>
									<item.icon className='h-5 w-5' />
									<span>{item.name}</span>
									{item.badge && (
										<span className='ml-auto inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white'>
											{item.badge}
										</span>
									)}
								</Link>
							);
						})}
					</nav>

					{/* Footer */}
					<div className='border-t border-emerald-600 p-3'>
						{footerItems.map((item) =>
							item.subItems ? (
								<details
									key={item.name}
									className='group'
								>
									<summary
										className={cn(
											'flex items-center gap-3 rounded-lg px-4 py-2 text-sm text-white cursor-pointer',
											pathname.startsWith(item.href)
												? 'bg-green-400'
												: 'hover:bg-emerald-600'
										)}
									>
										<item.icon className='h-5 w-5' />
										<span>{item.name}</span>
										<ChevronDown className='ml-auto h-4 w-4 group-open:rotate-180 transition-transform' />
									</summary>
									<div className='mt-1 space-y-1 pl-8'>
										{item.subItems.map((sub) => (
											<Link
												key={sub.href}
												href={sub.href}
												className={cn(
													'block rounded px-3 py-1 text-sm text-white',
													pathname === sub.href
														? 'bg-emerald-600'
														: 'hover:bg-emerald-600'
												)}
											>
												{sub.name}
											</Link>
										))}
									</div>
								</details>
							) : (
								<Link
									key={item.name}
									href={item.href}
									className={cn(
										'flex items-center gap-3 rounded-lg px-4 py-2 text-sm text-white',
										pathname === item.href
											? 'bg-green-400'
											: 'hover:bg-emerald-600'
									)}
								>
									<item.icon className='h-5 w-5' />
									<span>{item.name}</span>
								</Link>
							)
						)}
					</div>
				</div>
			</aside>
		</>
	);
}
