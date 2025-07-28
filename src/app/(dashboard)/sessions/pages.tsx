'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { useUserStore } from '@/stores/userStore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { SessionList } from './SessionList';
import { CreateSessionDialog } from './dialog/CreateSessionDialog';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { sessionSchema, Session } from '@/lib/validations/session';

export default function SessionPage() {
	const schoolId = useUserStore((s) => s.schoolId);
	const queryClient = useQueryClient();
	const [editSession, setEditSession] = useState<Session | null>(null);
	const [openCreateDialog, setOpenCreateDialog] = useState(false);
	const [openEditDialog, setOpenEditDialog] = useState(false);

	const createForm = useForm({
		resolver: zodResolver(sessionSchema),
		defaultValues: {
			name: '',
			start_date: '',
			end_date: '',
		},
	});

	const editForm = useForm({
		resolver: zodResolver(sessionSchema),
		defaultValues: {
			name: '',
			start_date: '',
			end_date: '',
		},
	});

	const { data: sessions = [], isLoading } = useQuery({
		queryKey: ['sessions', schoolId],
		queryFn: async () => {
			const res = await axios.get(
				`/api/session/get-all-session/${schoolId}`
			);
			return res.data.data;
		},
		enabled: !!schoolId,
	});

	const createMutation = useMutation({
		mutationFn: async (data: z.infer<typeof sessionSchema>) => {
			const res = await axios.post(
				`/api/session/create-new/${schoolId}`,
				data
			);
			return res.data;
		},
		onSuccess: () => {
			toast.success('Session created');
			queryClient.invalidateQueries({ queryKey: ['sessions', schoolId] });
			setOpenCreateDialog(false);
			createForm.reset();
		},
		onError: () => toast.error('Failed to create session'),
	});

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
			setOpenEditDialog(false);
			setEditSession(null);
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

	const handleEdit = (session: Session) => {
		setEditSession(session);
		editForm.reset({
			name: session.name,
			start_date: session.start_date.slice(0, 10),
			end_date: session.end_date.slice(0, 10),
		});
		setOpenEditDialog(true);
	};

	return (
		<Card className='space-y-6'>
			<CardHeader>
				<div className='flex justify-between items-center'>
					<CardTitle className='text-xl font-bold'>
						School Sessions
					</CardTitle>
					<Button onClick={() => setOpenCreateDialog(true)}>
						Create New Session
					</Button>
				</div>
			</CardHeader>

			<CardContent>
				<CreateSessionDialog
					open={openCreateDialog}
					setOpen={setOpenCreateDialog}
					form={createForm}
					mutation={createMutation}
				/>

				<SessionList
					sessions={sessions}
					isLoading={isLoading}
					onEditClick={handleEdit}
					toggleActive={toggleActive}
				/>

				<Dialog
					open={openEditDialog}
					onOpenChange={setOpenEditDialog}
				>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Edit Session</DialogTitle>
						</DialogHeader>
						<form
							onSubmit={editForm.handleSubmit((data) => {
								if (!editSession) return;
								updateMutation.mutate({
									session_id: editSession.session_id,
									data,
								});
							})}
							className='space-y-4'
						>
							<div>
								<Label>Session Name</Label>
								<Input {...editForm.register('name')} />
							</div>
							<div>
								<Label>Start Date</Label>
								<Input
									type='date'
									{...editForm.register('start_date')}
								/>
							</div>
							<div>
								<Label>End Date</Label>
								<Input
									type='date'
									{...editForm.register('end_date')}
								/>
							</div>
							<DialogFooter>
								<Button
									type='submit'
									disabled={updateMutation.isPending}
								>
									{updateMutation.isPending
										? 'Saving...'
										: 'Save'}
								</Button>
							</DialogFooter>
						</form>
					</DialogContent>
				</Dialog>
			</CardContent>
		</Card>
	);
}
