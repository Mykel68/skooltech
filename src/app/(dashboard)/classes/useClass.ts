import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export type Class = {
	class_id: string;
	name: string;
	short: string;
	grade_level: string;
	teacher: 'Unknown';
	student_count: number;
	subjects: [];
	created_at: string;
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
			// return data.data.classes;
			return (data.data.classes as any[]).map(
				(cls): Class => ({
					class_id: cls.class_id ?? '',
					name: cls.name ?? '',
					short: cls.short ?? '',
					grade_level: cls.grade_level ?? '',
					teacher: cls.teacher ?? 'Unknown',
					student_count: cls.student_count ?? 0,
					subjects: cls.subjects ?? [],
					created_at: cls.created_at ?? '',
					status: cls.status ?? 'active',
				})
			);
		},
		enabled: !!schoolId,
	});
};
