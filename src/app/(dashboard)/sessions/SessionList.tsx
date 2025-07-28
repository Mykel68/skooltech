'use client';

import { Session } from '@/lib/validations/session';
import { SessionCard } from './SessionCard';

type Props = {
	sessions: Session[];
	isLoading: boolean;
	onEditClick: (s: Session) => void;
	toggleActive: (s: Session) => void;
};

export const SessionList = ({
	sessions,
	isLoading,
	onEditClick,
	toggleActive,
}: Props) => {
	if (isLoading) return <p>Loading sessions...</p>;

	return (
		<ul className='space-y-4'>
			{sessions.map((session) => (
				<SessionCard
					key={session.session_id}
					session={session}
					onEditClick={onEditClick}
					toggleActive={toggleActive}
				/>
			))}
		</ul>
	);
};
