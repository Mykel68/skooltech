import * as z from 'zod';

export const sessionSchema = z.object({
	name: z.string().min(1, 'Session name is required'),
	start_date: z.string().min(1, 'Start date is required'),
	end_date: z.string().min(1, 'End date is required'),
});

export type Session = {
	session_id: string;
	name: string;
	start_date: string;
	end_date: string;
	is_active: boolean;
};
