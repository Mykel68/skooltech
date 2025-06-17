import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export type Class = {
	class_id: string;
	name: string;
	short: string;
	grade_level: string;
	teacher: string;
	student_count: number;
	subject: [];
	created_at: string;
	classroom: string;
	status: string;
};

export const useClasses = (
	schoolId: string,
	sessionId: string,
	termId: string
) => {
	return useQuery<Class[]>({
		queryKey: ['classes', schoolId],
		queryFn: async () => {
			const { data } = await axios.get(
				`/api/class/get-all-classs/${schoolId}`
			);
			return data.data.classes;
		},
		enabled: !!schoolId,
	});
};
